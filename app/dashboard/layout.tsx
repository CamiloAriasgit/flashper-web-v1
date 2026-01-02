import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SidebarNavigation from '@/components/SidebarNavigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) redirect('/register')

    const { data: profile } = await supabase
        .from('profiles')
        .select('organizations(name)')
        .eq('id', user.id)
        .single()

    const orgName = (profile?.organizations as any)?.name || 'Organización'

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
            {/* Navegación Lateral e Interactividad */}
            <SidebarNavigation orgName={orgName} />

            {/* Contenido Principal */}
            <main className="flex-1 w-full overflow-x-hidden">
                {children}
            </main>
        </div>
    )
}