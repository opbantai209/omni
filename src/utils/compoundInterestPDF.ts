import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart as ChartJS } from 'chart.js';
import { CalculationResults, CalculatorInputs } from './compoundInterestEngine';

export const exportPDFReport = (
  results: CalculationResults,
  inputs: CalculatorInputs,
  chartInstance: ChartJS<'line'> | null
) => {
  // 1. Initialize A4 portrait document
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const fmt = (val: number) =>
    `$${Math.round(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  // 2. Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Compound Interest Investment Report', 14, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 155, 15);

  // 3. Executive Metric Cards
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Executive Summary', 14, 32);

  const drawCard = (x: number, y: number, w: number, h: number, title: string, val: string, color: [number, number, number]) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, y, w, h, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(title, x + 3.5, y + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(val, x + 3.5, y + 13.5);
  };

  drawCard(14, 36, 43, 17, 'Future Value', fmt(results.finalBalance), [37, 99, 235]);
  drawCard(60, 36, 43, 17, 'Total Out-of-Pocket', fmt(results.totalPrincipal + results.totalContributions), [51, 65, 85]);
  drawCard(106, 36, 43, 17, 'Total Interest Earned', fmt(results.totalInterestEarned), [147, 51, 234]);
  drawCard(152, 36, 44, 17, 'Real Inflation Value', fmt(results.finalRealBalance), [217, 119, 6]);

  // 4. Calculation Parameters Sub-header
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const paramLine = `Params: Initial ${fmt(inputs.initialPrincipal)} | Deposit: ${fmt(inputs.additionalContribution)}/${inputs.contributionFrequency} | Rate: ${inputs.annualRate}% | Horizon: ${inputs.years} Yrs | Inflation: ${inputs.inflationRate}%`;
  doc.text(paramLine, 14, 58);

  let currentY = 62;

  // 5. Convert Chart.js Canvas to Base64 Image and Embed
  if (chartInstance) {
    try {
      const chartImageBase64 = chartInstance.toBase64Image();
      // Width: 182mm (fits page margins), Height: 70mm
      doc.addImage(chartImageBase64, 'PNG', 14, currentY, 182, 70);
      currentY += 74;
    } catch {
      // Ignore if chart canvas export fails
    }
  }

  // 6. Year-by-Year Accumulation Schedule Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('Annual Accumulation Schedule', 14, currentY);

  const tableHead = [['Year', 'Starting ($)', 'Deposits ($)', 'Interest ($)', 'Ending ($)', 'Cum. Interest ($)', 'Real Value ($)']];
  
  const tableData = results.yearlySchedule.map(row => [
    `Year ${row.year}`,
    fmt(row.startingBalance),
    `+${fmt(row.annualContributions)}`,
    `+${fmt(row.interestEarned)}`,
    fmt(row.endingBalance),
    fmt(row.totalInterestEarned),
    fmt(row.realEndingBalance)
  ]);

  autoTable(doc, {
    startY: currentY + 4,
    head: tableHead,
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [51, 65, 85]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      4: { fontStyle: 'bold', textColor: [15, 23, 42] }
    },
    margin: { left: 14, right: 14, bottom: 15 }
  });

  // 7. Dynamic Page Numbering Footer
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${totalPages}`, 105, 290, { align: 'center' });
  }

  // 8. Trigger Download
  doc.save(`Compound_Interest_Report_${inputs.years}Y.pdf`);
};
