import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  DollarSign, 
  SendHorizontal, 
  Sparkles 
} from 'lucide-react'

export default async function NewQuotePage() {
  
  async function createQuote(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('org_id')
      .eq('id', user?.id)
      .single()

    if (!profile?.org_id) return

    const { error } = await supabase
      .from('quotes')
      .insert([
        { 
          org_id: profile.org_id, 
          client_name: formData.get('clientName'), 
          client_email: formData.get('clientEmail'), 
          total_amount: parseFloat(formData.get('amount') as string),
          status: 'pending' 
        }
      ])

    if (!error) redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 sm:p-8">
      <div className="max-w-xl mx-auto">
        
        {/* Botón Volver - Estilo minimalista */}
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Volver al Panel</span>
        </Link>

        {/* Card Principal */}
        <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-8 sm:p-12">
            
            {/* Encabezado */}
            <div className="mb-10">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-xl mb-4">
                <Sparkles size={20} />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Nueva Cotización</h2>
              <p className="text-slate-500 text-sm mt-1">Completa los datos para generar el enlace de firma.</p>
            </div>

            <form action={createQuote} className="space-y-6">
              
              {/* Campo: Nombre */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 ml-1">
                  Nombre del Cliente
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                    <User size={18} strokeWidth={1.5} />
                  </div>
                  <input 
                    name="clientName" 
                    type="text" 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 rounded-xl py-3.5 pl-11 pr-4 text-slate-700 transition-all outline-none placeholder:text-slate-300 font-normal" 
                    placeholder="Ej: Camilo Arias" 
                  />
                </div>
              </div>

              {/* Campo: Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 ml-1">
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                    <Mail size={18} strokeWidth={1.5} />
                  </div>
                  <input 
                    name="clientEmail" 
                    type="email" 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 rounded-xl py-3.5 pl-11 pr-4 text-slate-700 transition-all outline-none placeholder:text-slate-300 font-normal" 
                    placeholder="cliente@correo.com" 
                  />
                </div>
              </div>

              {/* Campo: Monto */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 ml-1">
                  Monto (COP)
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                    <DollarSign size={18} strokeWidth={1.5} />
                  </div>
                  <input 
                    name="amount" 
                    type="number" 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 rounded-xl py-3.5 pl-11 pr-4 text-slate-700 transition-all outline-none placeholder:text-slate-300 font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                    placeholder="0.00" 
                  />
                </div>
              </div>

              {/* Acción */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-medium shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <SendHorizontal size={18} strokeWidth={2} />
                  Generar y Enviar
                </button>
                <p className="text-center text-slate-400 text-[11px] mt-6 leading-relaxed">
                  Al generar, se creará un vínculo único para que el cliente <br /> pueda revisar y firmar digitalmente.
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}