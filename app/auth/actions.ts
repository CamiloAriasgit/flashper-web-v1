'use server'

import { createClient } from '@/utils/supabase/server'
import { Resend } from 'resend'

// Inicializamos Resend con tu API Key del .env.local
const resend = new Resend(process.env.RESEND_API_KEY)

export async function signQuote(quoteId: string) {
    const supabase = await createClient()

    // 1. Actualizar el estado de la cotización a 'signed'
    const { data: quote, error: updateError } = await supabase
        .from('quotes')
        .update({ status: 'signed' })
        .eq('id', quoteId)
        .select(`
            *,
            organizations (name)
        `)
        .single()

    if (updateError || !quote) {
        console.error('Error al actualizar estado:', updateError)
        return { error: 'No se pudo procesar la firma.' }
    }

    try {
        // 2. Buscar el perfil del dueño de la organización para obtener su ID
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('org_id', quote.org_id)
            .single()

        if (profileError || !profile) {
            console.error('No se encontró el perfil del dueño:', profileError)
            return { success: true } // Retornamos éxito porque la firma sí se guardó
        }

        // 3. Usar el servicio de Admin de Supabase para obtener el Email del dueño
        // Nota: getUserById requiere que la Service Role Key esté configurada si se usa en entornos complejos,
        // pero en este flujo básico debería funcionar.
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(profile.id)
        
        const ownerEmail = authUser.user?.email

        if (ownerEmail) {
            // 4. Enviar la notificación por correo vía Resend
            await resend.emails.send({
                from: 'FlashPer <onboarding@resend.dev>', // Resend requiere este remitente por defecto al inicio
                to: ownerEmail,
                subject: `✅ ¡Cotización Firmada! - ${quote.client_name}`,
                html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden;">
                    <div style="background-color: #2563eb; padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">¡Nueva Firma Recibida!</h1>
                    </div>
                    <div style="padding: 40px; background-color: white;">
                        <p style="font-size: 16px; color: #475569; line-height: 1.6;">
                            Hola, tu cliente <strong>${quote.client_name}</strong> ha aceptado y firmado digitalmente la cotización.
                        </p>
                        <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Monto del cierre</p>
                            <p style="margin: 5px 0 0 0; color: #0f172a; font-size: 28px; font-weight: bold;">$${quote.total_amount.toLocaleString('es-CO')} COP</p>
                        </div>
                        <p style="font-size: 14px; color: #94a3b8; text-align: center;">
                            ID del Documento: ${quote.id}
                        </p>
                    </div>
                    <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9;">
                        <p style="margin: 0; font-size: 12px; color: #cbd5e1;">Gestión inteligente por FlashPer</p>
                    </div>
                </div>
                `
            })
        }
    } catch (err) {
        // Logueamos el error pero no bloqueamos la experiencia del cliente final
        console.error('Error en el flujo de notificación:', err)
    }

    return { success: true }
}