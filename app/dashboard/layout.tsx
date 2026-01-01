import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { LayoutDashboard, LogOut, Building2 } from 'lucide-react'

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

    return (
        <div className="min-h-screen bg-[#f8f8ff]">
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-cyan-600 p-2 rounded-xl shadow-sm shadow-blue-100">
                                <LayoutDashboard className="text-white" size={18} />
                            </div>
                            <div className="flex items-center text-xl font-black italic tracking-tighter select-none">
                                <span className="text-slate-600">Flash</span>
                                <span className="text-cyan-600">Per</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                                <Building2 size={14} className="text-slate-400" />
                                <span className="text-xs font-medium text-slate-600">
                                    {(profile?.organizations as any)?.name || 'Organización'}
                                </span>
                            </div>
                            <form action="/auth/signout" method="post">
                                <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                    <LogOut size={20} strokeWidth={1.5} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </div>
    )
}