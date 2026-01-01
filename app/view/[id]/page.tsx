import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { signQuote } from '@/app/auth/actions'
import { revalidatePath } from 'next/cache'
import DownloadPDF from '@/components/DownloadPDF'
import { 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  User2, 
  Fingerprint,
  Info,
  Calendar
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

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-blue-50 flex flex-col items-center py-12 px-4 sm:py-20">
            
            <div className="flex items-center gap-2 mb-10 opacity-60">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-500">
                    Portal de Firma Segura — Verificado por FlashPer
                </span>
            </div>

            <div className="max-w-2xl w-full">
                <div className="bg-white border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] rounded-3xl overflow-hidden">
                    
                    <div className="p-8 sm:p-12 border-b border-slate-100">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                            <div>
                                <h1 className="text-xl font-semibold tracking-tight text-slate-900 mb-1">
                                    {(quote.organizations as any)?.name}
                                </h1>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={12} />
                                        <span className="text-xs">{date}</span>
                                    </div>
                                    <span className="text-slate-200">•</span>
                                    <span className="text-xs font-medium uppercase tracking-wider text-blue-600/80">Propuesta #{(id.slice(0, 5))}</span>
                                </div>
                            </div>
                            {quote.status === 'signed' && (
                                <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100 flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    Documento Firmado
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-8 sm:p-12 space-y-12">
                        <div className="grid grid-cols-2 gap-8 border-b border-slate-50 pb-10">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Emisor</p>
                                <p className="text-sm font-medium text-slate-700">{(quote.organizations as any)?.name}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Receptor</p>
                                <div className="flex items-center justify-end gap-2 text-slate-700">
                                    <span className="text-sm font-medium">{quote.client_name}</span>
                                    <User2 size={14} className="text-slate-300" />
                                </div>
                            </div>
                        </div>

                        <div className="py-6 border-y border-slate-50 flex flex-col items-center justify-center">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-2">Total de la Inversión</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-light text-slate-400">$</span>
                                <span className="text-5xl font-semibold tracking-tighter text-slate-900">
                                    {quote.total_amount.toLocaleString('es-CO')}
                                </span>
                                <span className="text-sm font-medium text-slate-400 ml-2">COP</span>
                            </div>
                        </div>

                        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-3 text-slate-600">
                                <span className="text-xs font-semibold uppercase tracking-wider">Cláusulas de Aceptación</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed italic">
                                "{(quote.organizations as any)?.legal_text || "Al estampar la firma digital, el cliente acepta íntegramente los servicios descritos..."}"
                            </p>
                        </div>

                        {quote.status === 'pending' ? (
                            <form action={async () => {
                                'use server'
                                await signQuote(id)
                                revalidatePath(`/view/${id}`)
                            }} className="space-y-4">
                                <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-medium transition-all active:scale-[0.99] flex items-center justify-center gap-2 group shadow-sm">
                                    <Fingerprint size={18} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                                    Firmar y Confirmar Propuesta
                                </button>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-4 text-center">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                                    <CheckCircle2 size={24} />
                                </div>
                                <h3 className="text-sm font-semibold text-slate-900">Transacción Completada</h3>
                                <p className="text-xs text-slate-500 mt-1 mb-8">Este documento fue firmado digitalmente y es legalmente vinculante.</p>
                                
                                {/* Componente de descarga de PDF */}
                                <DownloadPDF quote={quote} />
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-50/80 p-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2 grayscale opacity-70 text-xs">
                            <span className="font-bold text-slate-900">Flash</span>
                            <span className="font-bold text-blue-600">Per</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-300">AUTH_TOKEN: {id.slice(-12).toUpperCase()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}