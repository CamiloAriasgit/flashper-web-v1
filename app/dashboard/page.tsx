import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
    LayoutDashboard,
    Plus,
    LogOut,
    DollarSign,
    FileText,
    ExternalLink,
    CircleDot,
    CheckCircle2,
    AlertCircle,
    Building2
} from 'lucide-react'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/register')

    const { data: profile } = await supabase
        .from('profiles')
        .select('org_id, organizations(name)')
        .eq('id', user.id)
        .single()

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="max-w-md w-full bg-white p-10 rounded-[2rem] shadow-sm border border-slate-200 text-center">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                        <AlertCircle size={24} />
                    </div>
                    <h1 className="text-xl font-semibold text-slate-900 mb-2">Configuración incompleta</h1>
                    <p className="text-slate-500 mb-8 text-sm">No encontramos una organización vinculada a tu cuenta.</p>
                    <form action="/auth/signout" method="post">
                        <button className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-medium hover:bg-slate-800 transition-all">
                            Cerrar Sesión
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    const { data: quotes } = await supabase
        .from('quotes')
        .select('*')
        .eq('org_id', profile.org_id)
        .order('created_at', { ascending: false })

    const totalMoney = quotes?.reduce((acc, q) => acc + (Number(q.total_amount) || 0), 0) || 0
    const signedQuotes = quotes?.filter(q => q.status === 'signed').length || 0

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Navbar Balanceado */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-blue-600 p-2 rounded-xl shadow-sm shadow-blue-100">
                                <LayoutDashboard className="text-white" size={18} />
                            </div>
                            <div className="flex items-center text-xl italic tracking-tighter select-none">
                                <span className="font-bold text-slate-900">Flash</span>
                                <span className="font-bold text-blue-600">Per</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                                <Building2 size={14} className="text-slate-400" />
                                <span className="text-xs font-medium text-slate-600">
                                    {(profile.organizations as any)?.name}
                                </span>
                            </div>
                            <form action="/auth/signout" method="post">
                                <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                    <LogOut size={20} strokeWidth={1.5} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                {/* Header Hero */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Tu Actividad</h1>
                        <p className="text-slate-500 text-sm mt-1.5 font-normal">Gestiona tus cotizaciones y firmas digitales.</p>
                    </div>
                    <Link
                        href="/dashboard/new-quote"
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium shadow-lg shadow-blue-100 transition-all active:scale-95 text-sm"
                    >
                        <Plus size={18} /> Nueva Cotización
                    </Link>
                </div>

                {/* Stats Grid - Menos agresivo */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
                    {[
                        { label: 'Total Cotizado', val: `$${totalMoney.toLocaleString('es-CO')}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Enviadas', val: quotes?.length || 0, icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100' },
                        { label: 'Firmadas', val: signedQuotes, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-slate-200/60 shadow-sm flex items-center gap-4">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center shrink-0`}>
                                <stat.icon size={22} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{stat.label}</p>
                                <p className="text-xl font-semibold text-slate-900 tracking-tight">{stat.val}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sección de Movimientos */}
                <div className="bg-white rounded-[1.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-800">Movimientos Recientes</h2>
                    </div>

                    {/* VISTA MÓVIL (Cards) */}
                    <div className="sm:hidden divide-y divide-slate-100">
                        {quotes?.map((q) => (
                            <div key={q.id} className="p-6 active:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center font-medium border border-slate-100">
                                            {q.client_name[0]}
                                        </div>
                                        <div>
                                            <Link href={`/view/${q.id}`} target="_blank" className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                                                {q.client_name} <ExternalLink size={12} className="text-slate-300" />
                                            </Link>
                                            <p className="text-xs text-slate-400 font-normal">{q.client_email}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-tight border ${q.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        }`}>
                                        {q.status === 'pending' ? 'Pendiente' : 'Firmado'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Monto</span>
                                    <span className="text-base font-semibold text-slate-900">${q.total_amount?.toLocaleString('es-CO')}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* VISTA ESCRITORIO (Tabla) */}
                    <div className="hidden sm:block">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Cliente</th>
                                    <th className="px-8 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Estado</th>
                                    <th className="px-8 py-4 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {quotes?.map((q) => (
                                    <tr key={q.id} className="group hover:bg-slate-50/40 transition-all">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center text-sm font-medium border border-slate-100">
                                                    {q.client_name[0]}
                                                </div>
                                                <div>
                                                    <Link href={`/view/${q.id}`} target="_blank" className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                                                        {q.client_name}
                                                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
                                                    </Link>
                                                    <span className="block text-xs text-slate-400 font-normal">{q.client_email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-tight border ${q.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                <CircleDot size={10} strokeWidth={3} className={q.status === 'pending' ? 'animate-pulse' : ''} />
                                                {q.status === 'pending' ? 'Pendiente' : 'Firmado'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right font-semibold text-slate-900 text-base">
                                            ${q.total_amount?.toLocaleString('es-CO')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}