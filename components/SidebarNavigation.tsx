'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, X, LogOut } from 'lucide-react'

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function SidebarNavigation({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { label: 'Inicio', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Clientes', href: '/dashboard/customers', icon: Users },
  ]

  const NavLinks = () => (
    <nav className="flex flex-col h-full gap-2 p-4">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 px-4">Menú</p>
      <div className="flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all mb-1 ${
                  isActive 
                  ? 'bg-slate-200 text-slate-600' 
                  : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                }`}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </Link>
            )
          })}
      </div>

      {/* Botón Cerrar Sesión en el Menú (Útil para móvil) */}
      <div className="pt-4 border-t border-slate-100">
        <form action="/auth/signout" method="post">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-500 font-bold text-sm transition-colors">
                <LogOut size={18} />
                Cerrar Sesión
            </button>
        </form>
      </div>
    </nav>
  )

  return (
    <>
      <aside className="hidden lg:block w-64 border-r border-slate-200 bg-white h-[calc(100vh-64px)] sticky top-16">
        <NavLinks />
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[280px] bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-6 flex justify-between items-center border-b border-slate-50">
              <span className="font-black text-slate-900 tracking-tighter text-xl">FlashPer</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 p-1"><X size={24} /></button>
            </div>
            <NavLinks />
          </div>
        </div>
      )}
    </>
  )
}