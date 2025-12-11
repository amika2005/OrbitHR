/**
 * Payslip PDF Generation Utility
 * Generates professional PDF payslips with company branding
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export interface PayslipData {
  employee: {
    name: string;
    employeeId: string;
    department: string;
    position: string;
    joinDate: string;
    bankAccount?: string;
  };
  company: {
    name: string;
    address?: string;
    logo?: string;
  };
  payPeriod: {
    month: number;
    year: number;
  };
  earnings: {
    basicSalary: number;
    hra: number;
    transportAllowance: number;
    medicalAllowance: number;
    specialAllowance: number;
    bonus?: number;
    overtime?: number;
  };
  deductions: {
    epf: number;
    etf: number;
    incomeTax: number;
    professionalTax: number;
    loan?: number;
    advance?: number;
    other?: number;
  };
  totals: {
    grossSalary: number;
    totalDeductions: number;
    netSalary: number;
  };
  currency: string;
}

/**
 * Format currency for display
 */
function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    USD: "$",
    LKR: "Rs.",
    JPY: "¥",
    EUR: "€",
    GBP: "£",
  };

  const symbol = symbols[currency] || currency;
  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Generate PDF payslip
 */
export function generatePayslipPDF(data: PayslipData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Colors
  const primaryColor = [109, 166, 112]; // Rooster Green
  const secondaryColor = [214, 115, 73]; // Rooster Orange
  const textColor = [51, 51, 51];

  // Header - Company Info
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(data.company.name, pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  if (data.company.address) {
    doc.text(data.company.address, pageWidth / 2, 30, { align: "center" });
  }

  // Title
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("PAYSLIP", pageWidth / 2, 55, { align: "center" });

  // Pay Period
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  doc.text(
    `Pay Period: ${monthNames[data.payPeriod.month - 1]} ${data.payPeriod.year}`,
    pageWidth / 2,
    65,
    { align: "center" }
  );

  // Employee Details
  let yPos = 80;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Employee Details", 20, yPos);

  yPos += 7;
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${data.employee.name}`, 20, yPos);
  doc.text(`Employee ID: ${data.employee.employeeId}`, 120, yPos);

  yPos += 7;
  doc.text(`Department: ${data.employee.department}`, 20, yPos);
  doc.text(`Position: ${data.employee.position}`, 120, yPos);

  yPos += 7;
  doc.text(`Join Date: ${data.employee.joinDate}`, 20, yPos);
  if (data.employee.bankAccount) {
    doc.text(`Bank Account: ${data.employee.bankAccount}`, 120, yPos);
  }

  // Earnings Table
  yPos += 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Earnings", 20, yPos);

  const earningsData = [
    ["Basic Salary", formatCurrency(data.earnings.basicSalary, data.currency)],
    ["House Rent Allowance (HRA)", formatCurrency(data.earnings.hra, data.currency)],
    ["Transport Allowance", formatCurrency(data.earnings.transportAllowance, data.currency)],
    ["Medical Allowance", formatCurrency(data.earnings.medicalAllowance, data.currency)],
    ["Special Allowance", formatCurrency(data.earnings.specialAllowance, data.currency)],
  ];

  if (data.earnings.bonus && data.earnings.bonus > 0) {
    earningsData.push(["Bonus", formatCurrency(data.earnings.bonus, data.currency)]);
  }

  if (data.earnings.overtime && data.earnings.overtime > 0) {
    earningsData.push(["Overtime Pay", formatCurrency(data.earnings.overtime, data.currency)]);
  }

  autoTable(doc, {
    startY: yPos + 5,
    head: [["Description", "Amount"]],
    body: earningsData,
    theme: "striped",
    headStyles: {
      fillColor: primaryColor as any, // Cast to avoid tuple mistmatch
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 60, halign: "right" },
    },
    margin: { left: 20, right: 20 },
  });

  // Deductions Table
  yPos = (doc as any).lastAutoTable.finalY + 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Deductions", 20, yPos);

  const deductionsData = [
    ["EPF (12%)", formatCurrency(data.deductions.epf, data.currency)],
    ["ETF (3%)", formatCurrency(data.deductions.etf, data.currency)],
    ["Income Tax", formatCurrency(data.deductions.incomeTax, data.currency)],
    ["Professional Tax", formatCurrency(data.deductions.professionalTax, data.currency)],
  ];

  if (data.deductions.loan && data.deductions.loan > 0) {
    deductionsData.push(["Loan Deduction", formatCurrency(data.deductions.loan, data.currency)]);
  }

  if (data.deductions.advance && data.deductions.advance > 0) {
    deductionsData.push([
      "Advance Deduction",
      formatCurrency(data.deductions.advance, data.currency),
    ]);
  }

  if (data.deductions.other && data.deductions.other > 0) {
    deductionsData.push([
      "Other Deductions",
      formatCurrency(data.deductions.other, data.currency),
    ]);
  }

  autoTable(doc, {
    startY: yPos + 5,
    head: [["Description", "Amount"]],
    body: deductionsData,
    theme: "striped",
    headStyles: {
      fillColor: secondaryColor as any,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 60, halign: "right" },
    },
    margin: { left: 20, right: 20 },
  });

  // Summary Table
  yPos = (doc as any).lastAutoTable.finalY + 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Summary", 20, yPos);

  autoTable(doc, {
    startY: yPos + 5,
    body: [
      ["Gross Salary", formatCurrency(data.totals.grossSalary, data.currency)],
      ["Total Deductions", formatCurrency(data.totals.totalDeductions, data.currency)],
      ["Net Salary (Take Home)", formatCurrency(data.totals.netSalary, data.currency)],
    ],
    theme: "plain",
    styles: {
      fontSize: 11,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 60, halign: "right", textColor: primaryColor as any },
    },
    margin: { left: 20, right: 20 },
  });

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 30;
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(128, 128, 128);
  doc.text(
    "This is a computer-generated payslip and does not require a signature.",
    pageWidth / 2,
    footerY,
    { align: "center" }
  );

  doc.text(
    `Generated on ${format(new Date(), "PPP")}`,
    pageWidth / 2,
    footerY + 5,
    { align: "center" }
  );

  return doc;
}

/**
 * Download payslip as PDF
 */
export function downloadPayslip(data: PayslipData): void {
  const doc = generatePayslipPDF(data);
  const filename = `Payslip_${data.employee.employeeId}_${data.payPeriod.month}_${data.payPeriod.year}.pdf`;
  doc.save(filename);
}

/**
 * Get payslip as blob for email attachment
 */
export function getPayslipBlob(data: PayslipData): Blob {
  const doc = generatePayslipPDF(data);
  return doc.output("blob");
}
