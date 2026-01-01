import { signup } from '../auth/actions'
import { Building2, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB] p-4">
      {/* Badge de Seguridad Opcional */}
      <div className="flex items-center gap-2 mb-8 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
        <ShieldCheck size={16} className="text-emerald-500" />
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Registro Seguro 256-bit</span>
      </div>

      <div className="bg-white border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] w-full max-w-md overflow-hidden">
        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl text-slate-800 tracking-tight mb-2">
              Únete a <span className="font-bold text-neutral-700 tracking-tight italic">Flash</span><span className='font-bold text-blue-600 tracking-tight italic'>Per</span>
            </h1>
            <p className="text-slate-500 text-sm">
              La plataforma para digitalizar tus cobros y firmas en segundos.
            </p>
          </div>
          
          <form className="space-y-5">
            {/* Empresa */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500 ml-1">Nombre de tu Empresa</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                  <Building2 size={18} strokeWidth={1.5} />
                </div>
                <input 
                  name="orgName" 
                  type="text" 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 rounded-xl py-3 pl-11 pr-4 text-slate-700 transition-all outline-none placeholder:text-slate-300 font-normal" 
                  placeholder="Ej: Aires Medellín S.A.S" 
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500 ml-1">Email Corporativo</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} strokeWidth={1.5} />
                </div>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 rounded-xl py-3 pl-11 pr-4 text-slate-700 transition-all outline-none placeholder:text-slate-300 font-normal" 
                  placeholder="gerencia@empresa.com" 
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500 ml-1">Contraseña</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} strokeWidth={1.5} />
                </div>
                <input 
                  name="password" 
                  type="password" 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 rounded-xl py-3 pl-11 pr-4 text-slate-700 transition-all outline-none font-normal" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              formAction={signup} 
              className="w-full mt-4 flex items-center justify-center gap-2 py-4 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium shadow-sm transition-all active:scale-[0.98] group"
            >
              Comenzar ahora
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-slate-400 text-xs leading-relaxed">
            Al registrarte, aceptas nuestros <br /> 
            <span className="text-slate-600 font-medium cursor-pointer hover:underline text-blue-500/80">Términos de Servicio</span> y <span className="text-slate-600 font-medium cursor-pointer hover:underline text-blue-500/80">Privacidad</span>.
          </p>
        </div>
      </div>
      
      <p className="mt-8 text-slate-500 text-sm">
        ¿Ya tienes una cuenta? <span className="text-blue-600 font-semibold cursor-pointer hover:underline">Inicia sesión</span>
      </p>
    </div>
  )
}