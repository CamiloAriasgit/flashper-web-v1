import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { signQuote } from '@/app/auth/actions'
import { revalidatePath } from 'next/cache'
import { CheckCircle, ShieldCheck, FileText, User, ReceiptText } from 'lucide-react'

export default async function PublicQuotePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const supabase = await createClient()

    const { data: quote, error } = await supabase
        .from('quotes')
        .select(`
      *,
      organizations (name, legal_text)
    `)
        .eq('id', id)
        .single()

    if (error || !quote) {
        console.error("Error buscando cotización:", error);
        notFound()
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6">
            {/* Badge de Seguridad superior */}
            <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                <ShieldCheck size={14} className="text-blue-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                    Documento Protegido y Cifrado
                </span>
            </div>

            <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
                {/* Cabecera con Logo/Nombre Emisor */}
                <div className="p-8 sm:p-10 border-b border-slate-50 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl mb-4">
                        <FileText size={24} strokeWidth={1.5} />
                    </div>
                    <p className="text-[11px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-1">
                        Cotización Comercial
                    </p>
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                        {(quote.organizations as any)?.name}
                    </h1>
                </div>

                <div className="p-8 sm:p-10">
                    {/* Tarjeta de Resumen */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10 bg-slate-50/80 border border-slate-100 p-8 rounded-[2rem]">
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Inversión Total</p>
                            <p className="text-4xl font-semibold text-slate-900 tracking-tighter">
                                ${quote.total_amount.toLocaleString('es-CO')}
                            </p>
                        </div>
                        <div className="h-px w-full sm:h-12 sm:w-px bg-slate-200"></div>
                        <div className="text-center sm:text-right">
                            <div className="flex items-center justify-center sm:justify-end gap-2 text-slate-400 mb-1">
                                <User size={12} />
                                <p className="text-[10px] font-bold uppercase tracking-widest">Para</p>
                            </div>
                            <p className="font-semibold text-slate-800 tracking-tight">{quote.client_name}</p>
                        </div>
                    </div>

                    {/* Términos */}
                    <div className="space-y-4 mb-10 px-2">
                        <div className="flex items-center gap-2 text-slate-900">
                            <ReceiptText size={18} className="text-slate-400" />
                            <h3 className="font-semibold text-sm tracking-tight">Términos y Condiciones</h3>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed font-normal">
                            {(quote.organizations as any)?.legal_text || "Al proceder con la firma, el cliente manifiesta su acuerdo con los servicios descritos y se compromete al cumplimiento del pago en los términos estipulados."}
                        </p>
                    </div>

                    {/* Lógica del Botón / Estado */}
                    {quote.status === 'pending' ? (
                        <form action={async () => {
                            'use server'
                            await signQuote(id)
                            revalidatePath(`/view/${id}`)
                        }}>
                            <button
                                type="submit"
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-medium text-lg shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
                            >
                                Aceptar y Firmar Digitalmente
                                <CheckCircle size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
                            </button>
                        </form>
                    ) : (
                        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex flex-col items-center gap-2">
                            <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-100">
                                <CheckCircle size={24} />
                            </div>
                            <div className="text-center">
                                <p className="text-emerald-700 font-semibold tracking-tight">Cotización Firmada</p>
                                <p className="text-emerald-600/70 text-xs font-medium">Este documento ya cuenta con aceptación digital.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Branding */}
                <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-center gap-1">
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Tecnología de gestión por</span>
                    <div className="flex items-center italic tracking-tighter select-none text-[12px]">
                        <span className="font-bold text-slate-900">Flash</span>
                        <span className="font-bold text-blue-600">Per</span>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-slate-400 text-[11px] font-medium italic">
                ID de Seguridad: {id.split('-')[0]}...{id.split('-').pop()}
            </p>
        </div>
    )
}