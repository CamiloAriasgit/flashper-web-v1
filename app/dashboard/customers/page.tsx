import { createClient } from '@/utils/supabase/server'
import { User2, ChevronRight, FileText, Calendar, Wallet, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default async function CustomersPage() {
    const supabase = await createClient()
    
    const { data: quotes } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false })

    const customersMap = quotes?.reduce((acc: any, quote) => {
        const email = quote.client_email
        if (!acc[email]) {
            acc[email] = {
                name: quote.client_name,
                email: email,
                totalQuotes: 0,
                totalAmount: 0,
                lastActivity: quote.created_at,
                history: []
            }
        }
        acc[email].totalQuotes += 1
        acc[email].totalAmount += quote.total_amount
        acc[email].history.push(quote)
        return acc
    }, {})

    const customers = Object.values(customersMap || {})

    return (
        <div className="max-w-7xl mx-auto mb-20">
            <header className="mb-8 sm:px-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">Directorio de Clientes</h1>
                <p className="text-slate-500 text-sm mt-1">Gestión de historial acumulado.</p>
            </header>

            <div className="grid gap-4">
                {customers.map((customer: any) => (
                    <details key={customer.email} className="group bg-white border border-slate-200 rounded-3xl overflow-hidden transition-all hover:border-slate-300">
                        <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer list-none select-none">
                            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0"> 
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400 group-open:bg-cyan-600 group-open:text-white transition-all shrink-0">
                                    <User2 size={20} />
                                </div>
                                <div className="min-w-0 flex-1"> 
                                    <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate group-open:text-cyan-600">
                                        {customer.name}
                                    </h3>
                                    <p className="text-[10px] sm:text-xs text-slate-400 truncate uppercase tracking-tight">
                                        {customer.email}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 sm:gap-8 ml-4 shrink-0">
                                <div className="hidden md:block text-right">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Inversión</p>
                                    <p className="text-sm font-black text-slate-900">${customer.totalAmount.toLocaleString('es-CO')}</p>
                                </div>
                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold border border-slate-200/50 group-open:bg-cyan-50 group-open:text-cyan-700">
                                    {customer.totalQuotes} {customer.totalQuotes === 1 ? 'DOC' : 'DOCS'}
                                </span>
                                <ChevronRight size={18} className="text-slate-300 transition-transform group-open:rotate-90" />
                            </div>
                        </summary>

                        <div className="px-4 pb-6 pt-2 border-t border-slate-50 bg-slate-50/30">
                            {/* Resumen de cartera en móvil */}
                            <div className="md:hidden flex items-center justify-between py-4 px-2 mb-2 bg-white/50 rounded-2xl">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 italic">
                                    <Wallet size={12} /> Total Cartera
                                </span>
                                <span className="text-sm font-black text-cyan-600">${customer.totalAmount.toLocaleString('es-CO')}</span>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Historial de documentos</p>
                                {customer.history.map((q: any) => (
                                    <Link 
                                        key={q.id}
                                        href={`/view/${q.id}`}
                                        target="_blank"
                                        className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md active:scale-[0.98] transition-all group/item"
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${q.status === 'signed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                                <FileText size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                                    Cotización #{q.id.slice(0,6).toUpperCase()}
                                                    <ExternalLink size={10} className="text-slate-300 group-hover/item:text-cyan-500" />
                                                </p>
                                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                                                    <Calendar size={10} />
                                                    {new Date(q.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right ml-4 shrink-0">
                                            <p className="text-sm font-black text-slate-900">${q.total_amount.toLocaleString('es-CO')}</p>
                                            <p className={`text-[9px] font-bold uppercase ${q.status === 'signed' ? 'text-emerald-500' : 'text-orange-500'}`}>
                                                {q.status === 'signed' ? '● Firmado' : '○ Pendiente'}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </details>
                ))}
            </div>
        </div>
    )
}