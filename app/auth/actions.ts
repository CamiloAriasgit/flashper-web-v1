// app/auth/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

/**
 * INICIO DE SESIÓN (LOGIN)
 */
export async function signin(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Error Login:", error.message)
    // Redirigimos con un parámetro de error para mostrar feedback si quisieras
    return redirect('/login?error=auth-failed')
  }

  // Revalidamos la ruta para asegurar que el Layout obtenga los datos frescos de la sesión
  revalidatePath('/', 'layout')
  return redirect('/dashboard')
}

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
 * CERRAR SESIÓN
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  return redirect('/login')
}

/**
 * FIRMA DE COTIZACIÓN
 */
export async function signQuote(quoteId: string) {
  const supabase = await createClient()

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

  return { success: true }
}