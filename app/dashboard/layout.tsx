import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClientLayout from '@/components/DashboardClientLayout'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) redirect('/register')

    // Traemos el nombre real de la organización
    const { data: profile } = await supabase
        .from('profiles')
        .select('organizations(name)')
        .eq('id', user.id)
        .single()

    const orgName = (profile?.organizations as any)?.name || 'Organización'

    return (
        <DashboardClientLayout orgName={orgName}>
            {children}
        </DashboardClientLayout>
    )
}