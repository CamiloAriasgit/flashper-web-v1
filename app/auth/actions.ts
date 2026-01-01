// app/auth/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * REGISTRO DE USUARIOS
 * Crea Auth, Organización y Perfil vinculado
 */
export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const orgName = formData.get('orgName') as string

  // 1. Crear el usuario en Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError || !authData.user) {
    console.error("Error Auth:", authError?.message)
    return redirect('/register?error=auth-failed')
  }

  // 2. Crear la Organización
  const { data: orgData, error: orgError } = await supabase
    .from('organizations')
    .insert([{ name: orgName }])
    .select()
    .single()

  if (orgError) {
    console.error("Error Org:", orgError.message)
    return redirect('/register?error=org-failed')
  }

  // 3. Crear el Perfil vinculado
  const { error: profileError } = await supabase.from('profiles').insert([
    {
      id: authData.user.id,
      org_id: orgData.id,
      full_name: email.split('@')[0],
      role: 'admin',
    },
  ])

  if (profileError) {
    console.error("Error Profile:", profileError.message)
    return redirect('/register?error=profile-failed')
  }

  return redirect('/dashboard')
}

/**
 * FIRMA DE COTIZACIÓN
 * Actualiza estado y envía notificaciones (Telegram/Make y Email)
 */
export async function signQuote(quoteId: string) {
  const supabase = await createClient()

  // 1. Actualizar estado de la cotización
  const { data: quote, error: updateError } = await supabase
    .from('quotes')
    .update({ status: 'signed' })
    .eq('id', quoteId)
    .select(`*, organizations (name)`)
    .single()

  if (updateError || !quote) {
    console.error("Error al firmar:", updateError?.message)
    return { success: false }
  }

  // 2. NOTIFICACIÓN A TELEGRAM (Vía Make Webhook)
  try {
    await fetch('https://hook.us2.make.com/vhb6ce9sdir7g7kj6f88x8radgxdy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre_cliente: quote.client_name,
        valor: quote.total_amount.toLocaleString('es-CO'),
        empresa: quote.organizations.name,
        id_propuesta: quote.id
      })
    });
  } catch (e) {
    console.error("Error enviando a Make/Telegram:", e);
  }

  // 3. NOTIFICACIÓN POR EMAIL (Opcional/Backup)
  try {
    const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('org_id', quote.org_id)
      .single()

    if (profile) {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(profile.id)
      const ownerEmail = authUser.user?.email

      if (ownerEmail) {
        await resend.emails.send({
          from: 'FlashPer <onboarding@resend.dev>',
          to: ownerEmail,
          subject: `✅ Cotización Firmada - ${quote.client_name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h2 style="color: #0f172a;">¡Firma recibida!</h2>
              <p style="color: #475569;">Tu cliente <strong>${quote.client_name}</strong> ha firmado la propuesta.</p>
              <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #64748b; font-size: 12px;">VALOR TOTAL</p>
                <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #2563eb;">$${quote.total_amount.toLocaleString('es-CO')}</p>
              </div>
            </div>
          `
        })
      }
    }
  } catch (err) {
    console.error("Error en proceso de email:", err)
  }

  return { success: true }
}