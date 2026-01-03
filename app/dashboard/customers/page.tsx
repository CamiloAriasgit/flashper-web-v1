import { createClient } from '@/utils/supabase/server'
import { User2, ChevronRight, FileText, Calendar, Wallet } from 'lucide-react'
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
        <div className="max-w-7xl mx-auto sm:px-8">
            <header className="mb-8 px-4 sm:px-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Directorio de Clientes</h1>
                <p className="text-slate-500 text-sm mt-1">Historial y métricas acumuladas por cliente.</p>
            </header>

            <div className="grid gap-4">
                {customers.map((customer: any) => (
                    <details key={customer.email} className="group bg-white border border-slate-200 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden transition-all hover:shadow-md">
                        <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer list-none">
                            {/* LADO IZQUIERDO: Avatar e Info principal */}
                            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0"> 
                                {/* Avatar */}
                                <div className="hidden xs:flex w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl sm:rounded-2xl items-center justify-center text-slate-400 group-open:bg-cyan-600 group-open:text-white transition-all shrink-0">
                                    <User2 size={20} />
                                </div>
                                
                                {/* Texto con truncado para evitar empujar el resto */}
                                <div className="min-w-0 flex-1"> 
                                    <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate group-open:text-cyan-600 transition-colors">
                                        {customer.name}
                                    </h3>
                                    <p className="text-[10px] sm:text-xs text-slate-400 truncate uppercase tracking-tight font-medium">
                                        {customer.email}
                                    </p>
                                </div>
                            </div>
                            
                            {/* LADO DERECHO: Métricas y Flecha */}
                            <div className="flex items-center gap-2 sm:gap-8 ml-4 shrink-0">
                                {/* Monto Total (Solo Desktop para no saturar) */}
                                <div className="hidden md:block text-right">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Inversión</p>
                                    <p className="text-sm font-black text-slate-900">${customer.totalAmount.toLocaleString('es-CO')}</p>
                                </div>

                                {/* Contador de Propuestas: Rediseñado para móvil */}
                                <div className="flex flex-col items-end sm:items-center">
                                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-black border border-slate-200/50 group-open:bg-cyan-50 group-open:text-cyan-700 group-open:border-cyan-100 transition-colors">
                                        {customer.totalQuotes} <span className="hidden xs:inline">{customer.totalQuotes === 1 ? 'DOC' : 'DOCS'}</span>
                                    </span>
                                </div>

                                <ChevronRight size={18} className="text-slate-300 transition-transform group-open:rotate-90 shrink-0" />
                            </div>
                        </summary>

                        {/* CONTENIDO DEL HISTORIAL */}
                        <div className="px-4 pb-4 sm:px-6 sm:pb-6 border-t border-slate-50 bg-slate-50/40">
                            {/* Resumen móvil del monto total */}
                            <div className="md:hidden flex items-center justify-between py-4 border-b border-slate-100 mb-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Wallet size={12} /> Inversión Total
                                </span>
                                <span className="text-sm font-black text-slate-900">${customer.totalAmount.toLocaleString('es-CO')}</span>
                            </div>

                            <div className="space-y-2 mt-2">
                                {customer.history.map((q: any) => (
                                    <div key={q.id} className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 flex items-center justify-between hover:border-cyan-200 transition-all shadow-sm">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`p-2 rounded-lg shrink-0 ${q.status === 'signed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                                <FileText size={14} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-bold text-slate-800 truncate">#{q.id.slice(0,6).toUpperCase()}</p>
                                                <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                                                    <Calendar size={10} />
                                                    {new Date(q.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0 ml-2">
                                            <span className="text-xs sm:text-sm font-black text-slate-900">${q.total_amount.toLocaleString('es-CO')}</span>
                                            <Link 
                                                href={`/view/${q.id}`} 
                                                target="_blank"
                                                className="p-1.5 bg-slate-50 hover:bg-cyan-600 hover:text-white rounded-lg text-slate-400 transition-all"
                                            >
                                                <ChevronRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </details>
                ))}
            </div>
        </div>
    )
}