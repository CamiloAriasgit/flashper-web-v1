'use client'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface PDFProps {
  quote: any;
}

export default function DownloadPDF({ quote }: PDFProps) {
  const generatePDF = () => {
    const doc = new jsPDF();

    // 1. Encabezado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('COTIZACIÓN FORMAL', 105, 20, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Empresa: ${quote.organizations?.name || 'FlashPer User'}`, 20, 40);
    doc.text(`Fecha: ${new Date(quote.created_at).toLocaleDateString()}`, 20, 45);
    doc.text(`ID Cotización: ${quote.id.slice(0, 8).toUpperCase()}`, 20, 50);

    // 2. Información del Cliente
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL CLIENTE', 20, 65);
    doc.line(20, 67, 190, 67);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${quote.client_name}`, 20, 75);
    doc.text(`Email: ${quote.client_email || 'N/A'}`, 20, 81);

    // 3. Tabla de Productos/Servicios
    const items = quote.items || []; 
    autoTable(doc, {
      startY: 90,
      head: [['Descripción', 'Cant.', 'Precio Unitario', 'Subtotal']],
      body: items.map((item: any) => [
        item.description,
        item.quantity,
        `$${item.price.toLocaleString('es-CO')}`,
        `$${(item.quantity * item.price).toLocaleString('es-CO')}`
      ]),
      foot: [[{ content: 'TOTAL A PAGAR', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } }, 
              { content: `$${quote.total_amount.toLocaleString('es-CO')}`, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }]],
      theme: 'striped',
      headStyles: { fillColor: [15, 23, 42] } // Color Slate-900 para combinar con tu web
    });

    // 4. Sección de Firma
    const finalY = (doc as any).lastAutoTable.finalY + 35;
    
    // Dibujar una línea de firma más estética
    doc.setDrawColor(200, 200, 200);
    doc.line(20, finalY, 80, finalY);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('FIRMA DIGITAL DEL CLIENTE', 20, finalY + 5);
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Firmado electrónicamente por: ${quote.client_name}`, 20, finalY + 10);
    doc.text(`Hash de seguridad: ${quote.id}`, 20, finalY + 14);
    doc.text(`Fecha de firma: ${new Date().toLocaleString()}`, 20, finalY + 18);

    // 5. Descargar
    doc.save(`Cotizacion_${quote.client_name.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
      Descargar PDF Oficial
    </button>
  );
}