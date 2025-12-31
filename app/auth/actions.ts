// app/auth/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const orgName = formData.get('orgName') as string

  // 1. Crear el usuario en Auth (Sin confirmación de email)
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
    // Opcional: Podrías borrar el usuario de auth aquí si falla la org
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

  // REVALIDAR Y REDIRIGIR
  return redirect('/dashboard')
}
export async function signQuote(quoteId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('quotes')
    .update({ status: 'signed' }) // Cambiamos el estado
    .eq('id', quoteId)

  if (error) {
    console.error("Error al firmar:", error.message)
    return { success: false }
  }

  return { success: true }
}