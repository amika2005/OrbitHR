import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PayslipData {
  employeeName: string;
  employeeId?: string;
  epfNumber?: string;
  designation: string;
  department?: string;
  dateOfJoining?: string;
  payPeriod: string;
  workedDays: number;
  basicSalary: number;
  allowances: {
    operational: number;
    wellBeing: number;
    utilityTravel: number;
    salesCommission: number;
    other: number;
  };
  deductions: {
    apit: number;
    unpaidLeave: number;
    lateAttendance: number;
    other: number;
  };
  commission: number;
  epf: number;
  epfEmployer: number; // 12%
  etf: number; // 3%
  netPay: number;
  bankName?: string;
  branch?: string;
  accountNumber?: string;
  companyName: string;
  companyAddress: string;
  companyLogo?: string;
}

// Helper to convert number to words (simplified version)
function numberToWords(num: number): string {
  const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
  const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];

  if ((num = num.toString().length > 9 ? parseFloat(num.toString().substring(0,9)) : num) === 0) return 'Zero';
  
  const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';

  let str = '';
  str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';

  return str.trim();
}

export function generatePayslipPDF(data: PayslipData): string {
  // A5 Landscape: 210mm x 148mm
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a5'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10; // Reduced margin
  let yPos = 10; // Reduced top spacing

  // --- Header ---
  
  // Company Logo
  if (data.companyLogo) {
    try {
      doc.addImage(data.companyLogo, 'PNG', margin, yPos - 2, 15, 15); // Smaller logo
    } catch (e) {
      console.error("Error adding logo", e);
    }
  }

  // Company Details (Centered)
  doc.setFontSize(14); // Slightly smaller title
  doc.setFont('helvetica', 'bold');
  doc.text(data.companyName || 'Company Name', pageWidth / 2, yPos + 2, { align: 'center' });
  yPos += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(data.companyAddress || 'Company Address', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;

  // Title
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYSLIP', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;

  // --- Employee Details Grid ---
  doc.setFontSize(8); // Smaller font for details
  doc.setFont('helvetica', 'normal');
  
  const leftColX = margin;
  const rightColX = pageWidth / 2 + 10;
  const rowHeight = 4.5; // Reduced row height

  // Row 1
  doc.text('Employee Name', leftColX, yPos);
  doc.text(`: ${data.employeeName}`, leftColX + 35, yPos);
  
  doc.text('EPF Number', rightColX, yPos);
  doc.text(`: ${data.epfNumber || '-'}`, rightColX + 35, yPos);
  yPos += rowHeight;

  // Row 2
  doc.text('Designation', leftColX, yPos);
  doc.text(`: ${data.designation}`, leftColX + 35, yPos);

  doc.text('Date of Joining', rightColX, yPos);
  doc.text(`: ${data.dateOfJoining || '-'}`, rightColX + 35, yPos);
  yPos += rowHeight;

  // Row 3
  doc.text('Department', leftColX, yPos);
  doc.text(`: ${data.department || '-'}`, leftColX + 35, yPos);

  doc.text('Pay Period', rightColX, yPos);
  doc.text(`: ${data.payPeriod}`, rightColX + 35, yPos);
  yPos += rowHeight;

  // Row 4
  doc.text('Employee ID', leftColX, yPos);
  doc.text(`: ${data.employeeId || '-'}`, leftColX + 35, yPos);

  doc.text('Attendance', rightColX, yPos);
  doc.text(`: ${data.workedDays}`, rightColX + 35, yPos);
  yPos += 10;

  // --- Salary Table ---
  // Build earnings array with all allowances
  const earnings = [
    { name: 'Basic Salary', amount: data.basicSalary },
    { name: 'Operational Allowance', amount: data.allowances.operational },
    { name: 'Employee Well-being Allowance', amount: data.allowances.wellBeing },
    { name: 'Utility/Travel Allowance', amount: data.allowances.utilityTravel },
    { name: 'Sales Commission', amount: data.allowances.salesCommission },
    { name: 'Other Additions/Reimbursements', amount: data.allowances.other },
    { name: 'Commission', amount: data.commission },
  ].filter(e => e.amount > 0);

  // Deductions - EPF 8% from employee + additional deductions
  const deductions = [
    { name: 'EPF (8%)', amount: data.epf },
    { name: 'APIT', amount: data.deductions.apit },
    { name: 'Unpaid Leave', amount: data.deductions.unpaidLeave },
    { name: 'Late Attendance', amount: data.deductions.lateAttendance },
    { name: 'Other Deductions', amount: data.deductions.other },
  ].filter(d => d.amount > 0);

  // Pad rows to match length
  const maxRows = Math.max(earnings.length, deductions.length);
  const tableBody = [];

  for (let i = 0; i < maxRows; i++) {
    const earn = earnings[i] || { name: '', amount: '' };
    const ded = deductions[i] || { name: '', amount: '' };
    
    tableBody.push([
      earn.name,
      earn.amount ? earn.amount.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '',
      ded.name,
      ded.amount ? ded.amount.toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''
    ]);
  }

  // Add Total Row
  const totalEarnings = data.basicSalary + 
    data.allowances.operational + 
    data.allowances.wellBeing + 
    data.allowances.salesCommission + 
    data.allowances.other + 
    data.commission;
  const totalDeductions = data.epf + data.deductions.apit + data.deductions.unpaidLeave + data.deductions.lateAttendance + data.deductions.other;

  tableBody.push([
    { content: 'Total Earnings', styles: { fontStyle: 'bold' } },
    { content: totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 }), styles: { fontStyle: 'bold' } },
    { content: 'Total Deductions', styles: { fontStyle: 'bold' } },
    { content: totalDeductions.toLocaleString('en-US', { minimumFractionDigits: 2 }), styles: { fontStyle: 'bold' } }
  ]);

  // Add Net Salary Row - Label in first column, amount in last column
  tableBody.push([
    { content: 'Net Salary', colSpan: 3, styles: { fontStyle: 'bold', fillColor: [240, 240, 240], halign: 'left' } },
    { content: data.netPay.toLocaleString('en-US', { minimumFractionDigits: 2 }), styles: { fontStyle: 'bold', fillColor: [240, 240, 240], halign: 'right' } }
  ]);

  // Add Employer Contributions Rows with Bank Details inline (no borders)
  // EPF row with Bank Name and Branch
  const bankNameBranch = [data.bankName, data.branch].filter(Boolean).join(' - ');
  
  tableBody.push([
    { content: 'EPF Contribution by Employer (12%)', styles: { fontStyle: 'italic', textColor: [100, 100, 100] } },
    { content: data.epfEmployer.toLocaleString('en-US', { minimumFractionDigits: 2 }), styles: { fontStyle: 'italic', textColor: [100, 100, 100] } },
    { content: bankNameBranch || '', colSpan: 2, styles: { fontSize: 8, halign: 'center', lineWidth: 0 } }
  ]);
  
  // ETF row with Account Number
  const accountNumberText = data.accountNumber ? `Acc No: ${data.accountNumber}` : '';
  
  tableBody.push([
    { content: 'ETF Contribution by Employer (3%)', styles: { fontStyle: 'italic', textColor: [100, 100, 100] } },
    { content: data.etf.toLocaleString('en-US', { minimumFractionDigits: 2 }), styles: { fontStyle: 'italic', textColor: [100, 100, 100] } },
    { content: accountNumberText, colSpan: 2, styles: { fontSize: 8, halign: 'center', lineWidth: 0 } }
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Earnings', 'Amount', 'Deductions', 'Amount']],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 30, halign: 'right' },
      2: { cellWidth: 60 },
      3: { cellWidth: 30, halign: 'right' }
    },
    styles: {
      fontSize: 8, // Reduced font size
      cellPadding: 1.5, // Reduced padding
      lineColor: [200, 200, 200],
      lineWidth: 0.1
    },
    // Custom draw to remove borders from bank details cells
    didDrawCell: (data: any) => {
      // Remove right borders from bank details cells (last 2 rows, columns 2-3)
      if (data.row.index >= tableBody.length - 2 && data.column.index >= 2) {
        data.cell.styles.lineWidth = 0;
      }
    },
    margin: { left: margin, right: margin }
  });

  // --- Footer ---
  // @ts-ignore
  yPos = doc.lastAutoTable.finalY + 5; // Reduced gap 

  // Net Pay in Words
  doc.setFontSize(12); // Increased font size slightly for emphasis
  doc.setFont('helvetica', 'bold');
  doc.text(`Net Salary: LKR ${data.netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 7;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text(numberToWords(Math.floor(data.netPay)) + ' Only', pageWidth / 2, yPos, { align: 'center' });

  // System Generated Message (Bottom Left)
  const bottomY = pageHeight - 10;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('*THIS IS A SYSTEM-GENERATED PAYSLIP. NO SIGNATURE REQUIRED*', margin, bottomY);

  // Return Data URL
  return doc.output('datauristring');
}
