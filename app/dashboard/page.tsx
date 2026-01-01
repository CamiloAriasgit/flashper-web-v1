import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/register')
    
    const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single()

    const { data: quotes } = await supabase
        .from('quotes')
        .select('*')
        .eq('org_id', profile?.org_id)
        .order('created_at', { ascending: false })

    // Pasamos los datos al componente de cliente
    return <DashboardClient initialQuotes={quotes || []} />
}