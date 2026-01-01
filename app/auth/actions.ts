// app/auth/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
// import { createClient as createSupabaseClient } from '@supabase/supabase-js' // Comentado temporalmente
import { redirect } from 'next/navigation'
// import { Resend } from 'resend' // Comentado temporalmente

// const resend = new Resend(process.env.RESEND_API_KEY) // Comentado temporalmente

/**
 * REGISTRO DE USUARIOS
 */
export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const orgName = formData.get('orgName') as string

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError || !authData.user) {
    console.error("Error Auth:", authError?.message)
    return redirect('/register?error=auth-failed')
  }

  const { data: orgData, error: orgError } = await supabase
    .from('organizations')
    .insert([{ name: orgName }])
    .select()
    .single()

  if (orgError) {
    console.error("Error Org:", orgError.message)
    return redirect('/register?error=org-failed')
  }

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
 * Se enfoca solo en la lógica de base de datos para asegurar el ROI
 */
export async function signQuote(quoteId: string) {
  const supabase = await createClient()

  // 1. Actualizar estado de la cotización (Prioridad #1)
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

  /* // 2. NOTIFICACIÓN A TELEGRAM (Comentado temporalmente)
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
  */

  /*
  // 3. NOTIFICACIÓN POR EMAIL (Comentado temporalmente)
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
          html: `<h1>Firma recibida</h1><p>Cliente: ${quote.client_name}</p>`
        })
      }
    }
  } catch (err) {
    console.error("Error en proceso de email:", err)
  }
  */

  return { success: true }
}