import { signin } from '../auth/actions' // Necesitaremos crear esta acción
import { Mail, Lock, ArrowRight, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC] p-4">
      <div className="bg-white border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] w-full max-w-md overflow-hidden">
        <div className="p-8 sm:p-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl text-slate-800 tracking-tight mb-2 font-bold italic">
              Flash<span className="text-cyan-600">Per</span>
            </h1>
            <p className="text-slate-500 text-sm">Bienvenido de nuevo, ingresa a tu panel.</p>
          </div>
          
          <form className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500 transition-colors">
                  <Mail size={18} strokeWidth={1.5} />
                </div>
                <input 
                  name="email" type="email" required 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50 rounded-xl py-3 pl-11 pr-4 text-slate-700 transition-all outline-none" 
                  placeholder="gerencia@empresa.com" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500 ml-1">Contraseña</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500 transition-colors">
                  <Lock size={18} strokeWidth={1.5} />
                </div>
                <input 
                  name="password" type="password" required 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-50 rounded-xl py-3 pl-11 pr-4 text-slate-700 transition-all outline-none" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              formAction={signin} 
              className="w-full mt-4 flex items-center justify-center gap-2 py-4 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-sm transition-all active:scale-[0.98] group"
            >
              Entrar al Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
      <p className="mt-8 text-slate-500 text-sm">
        ¿No tienes cuenta? <Link href="/register" className="text-cyan-600 font-semibold hover:underline">Regístrate gratis</Link>
      </p>
    </div>
  )
}