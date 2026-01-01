'use client'

import { X, Calendar, Mail, DollarSign, Fingerprint, FileText } from 'lucide-react'
import DownloadPDF from './DownloadPDF'
import ShareQuote from './ShareQuote'

export default function QuoteDetailSheet({ quote, onClose }: { quote: any, onClose: () => void }) {
    if (!quote) return null;

    return (
        <>
            {/* Overlay oscuro */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity"
                onClick={onClose}
            />

            {/* Panel: Lateral en PC, Bottom Sheet en Móvil */}
            <div className="fixed inset-x-0 bottom-0 z-[70] sm:inset-y-0 sm:right-0 sm:left-auto w-full sm:w-[450px] bg-white rounded-t-[2.5rem] sm:rounded-l-[2.5rem] sm:rounded-t-none shadow-2xl transform transition-transform duration-300 ease-out flex flex-col max-h-[90vh] sm:max-h-screen">

                {/* Header del Panel */}
                <div className="p-6 sm:p-8 border-b border-slate-50 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Detalles de Propuesta</h3>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">ID: {quote.id.slice(0, 8)}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Contenido Scrolleable */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-slate-700 font-medium">

                    <section className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Fecha de Creación</p>
                                <p className="text-sm">{new Date(quote.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
                                <Mail size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Cliente</p>
                                <p className="text-sm">{quote.client_name}</p>
                                <p className="text-xs text-slate-400 font-normal">{quote.client_email}</p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-slate-50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-slate-400 uppercase">Monto Total</span>
                            <div className="bg-white px-3 py-1 rounded-full border border-slate-200 text-[10px] font-bold text-slate-600">COP</div>
                        </div>
                        <p className="text-3xl font-black text-slate-900">${quote.total_amount.toLocaleString('es-CO')}</p>
                    </section>

                    <section>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Estado de Firma</p>
                        {quote.status === 'signed' ? (
                            <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                                <Fingerprint size={24} />
                                <div>
                                    <p className="text-sm font-bold">Documento Firmado</p>
                                    <p className="text-[10px] opacity-80 font-normal italic">Verificado mediante FlashPer Digital ID</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 text-orange-600 bg-orange-50 p-4 rounded-2xl border border-orange-100">
                                <FileText size={24} />
                                <div>
                                    <p className="text-sm font-bold">Pendiente de Firma</p>
                                    <p className="text-[10px] opacity-80 font-normal">Esperando acción del cliente</p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* Footer con Acción Principal */}
                <div className="p-6 sm:p-8 bg-slate-50/50 border-t border-slate-100">
                    <section className="pb-4">
                        <ShareQuote quoteId={quote.id} clientName={quote.client_name} />
                    </section>
                    {quote.status === 'signed' ? (
                        <DownloadPDF quote={quote} />
                    ) : (
                        <button
                            disabled
                            className="w-full bg-slate-200 text-slate-500 py-4 rounded-2xl font-bold text-sm cursor-not-allowed"
                        >
                            PDF Disponible tras Firma
                        </button>
                    )}
                </div>

            </div>
        </>
    )
}