'use client'

import { useState } from 'react'
import { Share2, Check, Copy, MessageCircle } from 'lucide-react'

export default function ShareQuote({ quoteId, clientName }: { quoteId: string, clientName: string }) {
    const [copied, setCopied] = useState(false)
    
    // Generamos la URL absoluta para el cliente
    const shareUrl = `${window.location.origin}/view/${quoteId}`
    const shareText = `Hola ${clientName}, adjunto la propuesta comercial de nuestra parte. Puedes revisarla y firmarla aquí: ${shareUrl}`

    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleShare = async () => {
        // Si el navegador soporta el "compartir" nativo (móvil)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Propuesta Comercial',
                    text: shareText,
                    url: shareUrl,
                })
            } catch (err) {
                console.log('Error al compartir', err)
            }
        } else {
            // Si no hay share nativo, abrir WhatsApp Web por defecto
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
            window.open(whatsappUrl, '_blank')
        }
    }

    return (
        <div className="flex flex-col gap-3 w-full">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Enviar al Cliente</p>
            
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 bg-[#1ebea5] hover:bg-slate-900 text-white p-3 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-100"
                >
                    <MessageCircle size={18} />
                    WhatsApp
                </button>

                <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 p-3 rounded-2xl font-bold text-sm transition-all active:scale-95"
                >
                    {copied ? (
                        <>
                            <Check size={18} className="text-emerald-500" />
                            Copiado
                        </>
                    ) : (
                        <>
                            <Copy size={18} />
                            Link
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}