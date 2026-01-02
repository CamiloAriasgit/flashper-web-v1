import { createClient } from '@/utils/supabase/server'
import { User2, ChevronRight, FileText, Calendar } from 'lucide-react'
import Link from 'next/link'

export default async function CustomersPage() {
    const supabase = await createClient()
    
    // Traemos todas las cotizaciones del usuario
    const { data: quotes } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false })

    // Agrupamos por email (nuestro identificador único de cliente)
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
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
            <header className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">Directorio de Clientes</h1>
                <p className="text-slate-500 text-sm mt-1">Historial acumulado por cliente.</p>
            </header>

            <div className="grid gap-4">
                {customers.map((customer: any) => (
                    <details key={customer.email} className="group bg-white border border-slate-200 rounded-[2rem] overflow-hidden transition-all hover:border-cyan-200">
                        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-open:bg-cyan-600 group-open:text-white transition-colors">
                                    <User2 size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{customer.name}</h3>
                                    <p className="text-xs text-slate-400">{customer.email}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-8">
                                <div className="hidden md:block text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inversión Total</p>
                                    <p className="text-sm font-black text-slate-900">${customer.totalAmount.toLocaleString('es-CO')}</p>
                                </div>
                                <div className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 border border-slate-100">
                                    {customer.totalQuotes} {customer.totalQuotes === 1 ? 'Propuesta' : 'Propuestas'}
                                </div>
                                <ChevronRight size={18} className="text-slate-300 transition-transform group-open:rotate-90" />
                            </div>
                        </summary>

                        {/* HISTORIAL DETALLADO */}
                        <div className="px-6 pb-6 pt-2 border-t border-slate-50 bg-slate-50/30">
                            <div className="space-y-2 mt-4">
                                {customer.history.map((q: any) => (
                                    <div key={q.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:shadow-sm transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${q.status === 'signed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                                <FileText size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">Cotización #{q.id.slice(0,5).toUpperCase()}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                                    <Calendar size={10} />
                                                    {new Date(q.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-bold text-slate-900">${q.total_amount.toLocaleString('es-CO')}</span>
                                            <Link 
                                                href={`/view/${q.id}`} 
                                                target="_blank"
                                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                                            >
                                                <ChevronRight size={16} />
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