'use client' // Cambiamos a client para manejar el estado del menú

import { useState } from 'react'
import { Building2, LogOut, Menu } from 'lucide-react'
import SidebarNavigation from '@/components/SidebarNavigation'

export default function DashboardLayout({
    children,
    orgName // Asumiendo que lo pasas o lo obtienes de un componente padre/wrapper
}: {
    children: React.ReactNode
    orgName?: string 
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
            <header className="sticky top-0 z-[60] h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 w-full px-4 sm:px-8 flex items-center justify-between">
                <div className="flex items-center text-xl font-black italic tracking-tighter">
                    <span className="text-slate-600">Flash</span>
                    <span className="text-cyan-600">Per</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl">
                        <Building2 size={14} className="text-slate-400" />
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                            {orgName || 'Organización'}
                        </span>
                    </div>

                    {/* Botón LogOut: Visible solo en Desktop */}
                    <form action="/auth/signout" method="post" className="hidden sm:block">
                        <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                            <LogOut size={20} strokeWidth={1.5} />
                        </button>
                    </form>

                    {/* Botón Menú: Visible solo en Móvil */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="sm:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </header>

            <div className="flex flex-1">
                <SidebarNavigation 
                    isMobileMenuOpen={isMobileMenuOpen} 
                    setIsMobileMenuOpen={setIsMobileMenuOpen} 
                />
                <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    )
}