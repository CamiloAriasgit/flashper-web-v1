'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  Building2,
  Zap 
} from 'lucide-react'

export default function SidebarNavigation({ orgName }: { orgName: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { label: 'Inicio', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Clientes', href: '/dashboard/customers', icon: Users },
  ]

  const NavContent = () => (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Logotipo */}
      <div className="flex items-center gap-2.5 px-3 mb-10">
        
        <div className="flex items-center text-2xl font-black italic tracking-tighter">
          <span className="text-slate-600">Flash</span>
          <span className="text-cyan-600">Per</span>
        </div>
      </div>

      {/* Info de Organización (Desktop) */}
      <div className="hidden lg:flex items-center gap-2 px-4 py-3 mb-6 bg-slate-50 border border-slate-100 rounded-2xl">
        <Building2 size={14} className="text-slate-400" />
        <span className="text-xs font-bold text-slate-600 truncate">{orgName}</span>
      </div>

      {/* Enlaces */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                isActive 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Botón Salir */}
      <div className="pt-4 border-t border-slate-100">
        <form action="/auth/signout" method="post">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-500 font-bold text-sm transition-colors group">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            Cerrar Sesión
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <>
      {/* SIDEBAR ESCRITORIO */}
      <aside className="hidden lg:block w-72 border-r border-slate-200 bg-white sticky top-0 h-screen">
        <NavContent />
      </aside>

      {/* HEADER MÓVIL */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
            <div className="bg-cyan-600 p-1.5 rounded-lg">
                <Zap className="text-white" size={16} fill="currentColor" />
            </div>
            <span className="font-black text-slate-900 tracking-tighter">FlashPer</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 bg-slate-50 rounded-xl text-slate-600"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* OVERLAY & MENÚ MÓVIL */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[280px] bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-5 right-4 p-2 text-slate-400"
            >
              <X size={24} />
            </button>
            <NavContent />
          </div>
        </div>
      )}
    </>
  )
}