import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { signQuote } from '@/app/auth/actions'
import { revalidatePath } from 'next/cache'
import DownloadPDF from '@/components/DownloadPDF'
import { 
  CheckCircle2, 
  ShieldCheck, 
  User2, 
  Fingerprint,
  Calendar,
  Building2,
  Lock,
  ArrowRight
} from 'lucide-react'

export default async function PublicQuotePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const supabase = await createClient()

    const { data: quote, error } = await supabase
        .from('quotes')
        .select(`*, organizations (name, legal_text)`)
        .eq('id', id)
        .single()

    if (error || !quote) notFound()

    const date = new Date(quote.created_at).toLocaleDateString('es-CO', {
        day: 'numeric', month: 'long', year: 'numeric'
    })

    const isPending = quote.status === 'pending'

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-cyan-100 flex flex-col items-center py-10 px-4 sm:py-20">
            
            {/* Badge de Seguridad Superior */}
            <div className="flex items-center gap-2 mb-8 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm transition-all hover:shadow-md">
                <div className="flex -space-x-1">
                    <ShieldCheck size={16} className="text-cyan-600" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Documento Encriptado & Validado
                </span>
            </div>

            <div className="max-w-2xl w-full space-y-6">
                {/* CARD PRINCIPAL */}
                <div className="bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden">
                    
                    {/* Header: Marca e Info */}
                    <div className="px-8 pt-8 sm:p-12 border-b border-slate-50 bg-gradient-to-b from-slate-50/50 to-transparent">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-50 border border-cyan-100">
                                    <Building2 size={14} className="text-cyan-600" />
                                    <span className="text-[10px] font-black uppercase text-cyan-700 tracking-tighter">Emisor Verificado</span>
                                </div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                                    {(quote.organizations as any)?.name}
                                </h1>
                                <div className="flex items-center gap-4 text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} strokeWidth={2.5} />
                                        <span className="text-xs font-semibold">{date}</span>
                                    </div>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-600">REF-{(id.slice(0, 5)).toUpperCase()}</span>
                                </div>
                            </div>
                            
                            {!isPending && (
                                <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl text-[11px] font-bold uppercase tracking-tight border border-emerald-100 flex items-center gap-2">
                                    <CheckCircle2 size={16} />
                                    Acuerdo Firmado
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contenido: Partes e Importe */}
                    <div className="p-8 sm:p-12 space-y-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">De parte de</p>
                                <p className="text-sm font-bold text-slate-800">{(quote.organizations as any)?.name}</p>
                            </div>
                            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Preparado para</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-800">{quote.client_name}</span>
                                    <User2 size={14} className="text-cyan-600" />
                                </div>
                            </div>
                        </div>

                        {/* EL MONTO: EL PROTAGONISTA */}
                        <div className="py-10 bg-slate-900 rounded-[2rem] flex flex-col items-center justify-center text-white relative overflow-hidden group shadow-2xl shadow-cyan-100">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Lock size={120} />
                            </div>
                            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-4 relative z-10">Inversión Total</span>
                            <div className="flex items-baseline gap-2 relative z-10">
                                <span className="text-2xl font-light text-cyan-500/50">$</span>
                                <span className="text-6xl font-black tracking-tighter">
                                    {quote.total_amount.toLocaleString('es-CO')}
                                </span>
                                <span className="text-sm font-bold text-cyan-500/50">COP</span>
                            </div>
                        </div>

                        {/* Cláusulas */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-px flex-1 bg-slate-100" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Términos Legales</span>
                                <div className="h-px flex-1 bg-slate-100" />
                            </div>
                            <p className="text-[13px] text-slate-500 leading-relaxed text-center px-4 italic font-medium">
                                "{(quote.organizations as any)?.legal_text || "Al confirmar mediante firma digital, el cliente acepta los términos del servicio..."}"
                            </p>
                        </div>

                        {/* Acciones */}
                        {isPending ? (
                            <form action={async () => {
                                'use server'
                                await signQuote(id)
                                revalidatePath(`/view/${id}`)
                            }}>
                                <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-5 rounded-[1.5rem] font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-3 group shadow-xl shadow-cyan-100 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    <Fingerprint size={22} strokeWidth={2.5} />
                                    <span className="relative">Firmar y Aceptar Propuesta</span>
                                    <ArrowRight size={18} className="relative group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-4 font-medium italic">
                                    Al hacer clic, se generará una firma digital con timestamp único.
                                </p>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex flex-col items-center justify-center py-4 text-center">
                                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                                        <CheckCircle2 size={32} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 italic">TRANSACCIÓN ASEGURADA</h3>
                                    <p className="text-sm text-slate-400 mt-1 max-w-[280px]">El documento ha sido sellado y está listo para tu archivo personal.</p>
                                </div>
                                <div className="flex justify-center">
                                    <DownloadPDF quote={quote} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer del Portal */}
                    <div className="bg-slate-50 p-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black tracking-tighter text-slate-500 italic">Flash<span className="text-cyan-600">Per</span></span>
                            <div className="h-4 w-px bg-slate-200" />
                            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Digital Identity</span>
                        </div>
                        <div className="flex items-center gap-4">
                             <span className="text-[10px] font-mono font-bold text-slate-300 bg-white px-3 py-1 rounded-md border border-slate-200 uppercase tracking-tighter">
                                TX_{id.slice(-12)}
                             </span>
                        </div>
                    </div>
                </div>

                {/* Branding sutil de "Ganas de usarlo" */}
                <div className="text-center">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        ¿Quieres enviar propuestas como esta? 
                        <a href="/register" className="ml-2 text-cyan-600 hover:underline">Empieza gratis con FlashPer</a>
                    </p>
                </div>
            </div>
        </div>
    )
}