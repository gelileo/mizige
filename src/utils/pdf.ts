import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export async function exportToPdf(
  element: HTMLElement,
  paperSize: 'a4' | 'letter' = 'a4'
) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#f5e6c8',
  });

  const imgData = canvas.toDataURL('image/png');
  const pageWidth = paperSize === 'a4' ? 210 : 215.9;
  const pageHeight = paperSize === 'a4' ? 297 : 279.4;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: paperSize,
  });

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = position - pageHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save('mizige-worksheet.pdf');
}
