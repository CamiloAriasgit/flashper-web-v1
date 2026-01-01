'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, DollarSign, FileText, CircleDot,CheckCircle2, TrendingUp, ArrowUpRight } from 'lucide-react'
import QuoteDetailSheet from '@/components/QuoteDetailSheet'

export default function DashboardClient({ initialQuotes }: { initialQuotes: any[] }) {
    const [selectedQuote, setSelectedQuote] = useState<any>(null)

    // MÉTRICAS
    const pendingQuotes = initialQuotes.filter(q => q.status === 'pending')
    const signedQuotes = initialQuotes.filter(q => q.status === 'signed')
    const potentialMoney = pendingQuotes.reduce((acc, q) => acc + (Number(q.total_amount) || 0), 0)
    const earnedMoney = signedQuotes.reduce((acc, q) => acc + (Number(q.total_amount) || 0), 0)
    const totalQuotes = initialQuotes.length;
    const closeRate = totalQuotes > 0 ? (signedQuotes.length / totalQuotes) * 100 : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">

            {/* Header */}
            <div className="flex items-center justify-between mb-8 sm:mb-12">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">Tu Actividad</h1>
                    <p className="hidden sm:block text-slate-500 text-sm font-normal">Resumen de operaciones comerciales.</p>
                </div>
                <Link
                    href="/dashboard/new-quote"
                    className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl font-semibold shadow-xl shadow-slate-200 transition-all active:scale-95 text-sm"
                >
                    <Plus size={18} /> <span className="hidden sm:inline">Nueva Cotización</span>
                </Link>
            </div>

            {/* Stats Grid: 2x2 en móvil, 4 en escritorio */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-10">
                <StatCard
                    label="Ganado"
                    val={`${(earnedMoney / 1000000).toFixed(1)}M`}
                    sub={earnedMoney.toLocaleString('es-CO')}
                    icon={TrendingUp} color="text-emerald-600" bg="bg-emerald-50"
                />
                <StatCard
                    label="Pendiente"
                    val={`${(potentialMoney / 1000000).toFixed(1)}M`}
                    sub={potentialMoney.toLocaleString('es-CO')}
                    icon={DollarSign} color="text-cyan-600" bg="bg-cyan-50"
                />
                <StatCard
                    label="Enviadas"
                    val={totalQuotes}
                    sub="Total propuestas"
                    icon={FileText} color="text-slate-600" bg="bg-slate-100"
                />
                <StatCard
                    label="Tasa Cierre"
                    val={`${closeRate.toFixed(0)}%`}
                    sub={`${signedQuotes.length} de ${totalQuotes} firmadas`}
                    icon={CheckCircle2} // Asegúrate de importar CheckCircle2 de lucide-react
                    color="text-violet-600" bg="bg-violet-50"
                />
            </div>

            {/* Lista de Movimientos */}
            <div className="bg-white rounded-[2rem] border border-slate-200/50 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Actividad Reciente</h2>
                </div>

                <div className="divide-y divide-slate-50">
                    {initialQuotes.map((q) => (
                        <div
                            key={q.id}
                            onClick={() => setSelectedQuote(q)}
                            className="group flex items-center justify-between p-4 sm:px-8 sm:py-5 hover:bg-slate-50 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                                <div className="hidden sm:flex w-10 h-10 rounded-full bg-slate-50 text-slate-400 items-center justify-center font-bold text-xs border border-slate-100 group-hover:bg-white transition-colors">
                                    {q.client_name[0]}
                                </div>
                                <div className="truncate">
                                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-cyan-600">
                                        {q.client_name}
                                        <ArrowUpRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                                    </h4>
                                    <p className="text-[11px] text-slate-400 truncate">{q.client_email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 sm:gap-12">
                                <div className="hidden sm:block">
                                    <StatusBadge status={q.status} />
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm sm:text-base font-bold text-slate-900">
                                        ${(q.total_amount / 1000).toFixed(0)}k
                                    </p>
                                    <div className="sm:hidden">
                                        <StatusBadge status={q.status} mini />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* El Panel Lateral Interactivo */}
            {selectedQuote && (
                <QuoteDetailSheet
                    quote={selectedQuote}
                    onClose={() => setSelectedQuote(null)}
                />
            )}
        </div>
    )
}

function StatCard({ label, val, sub, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-[1.5rem] border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full group hover:border-cyan-200 transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 ${bg} ${color} rounded-xl flex items-center justify-center`}>
                    <Icon size={18} strokeWidth={2} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
            </div>
            <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{val}</p>
                <p className="text-[9px] sm:text-[10px] font-medium text-slate-400 mt-1 truncate">COP {sub}</p>
            </div>
        </div>
    )
}

function StatusBadge({ status, mini = false }: { status: string, mini?: boolean }) {
    const isPending = status === 'pending'
    if (mini) return (
        <div className={`flex items-center gap-1 text-[9px] font-bold uppercase ${isPending ? 'text-orange-500' : 'text-emerald-500'}`}>
            <CircleDot size={8} strokeWidth={4} className={isPending ? 'animate-pulse' : ''} />
            {isPending ? 'Pendiente' : 'Firmado'}
        </div>
    )
    return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${isPending ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
            <CircleDot size={10} strokeWidth={3} className={isPending ? 'animate-pulse' : ''} />
            {isPending ? 'Pendiente' : 'Firmado'}
        </div>
    )
}