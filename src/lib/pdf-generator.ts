import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PayrollResult } from "./payroll-calculator";

interface PayslipData {
  companyName: string;
  month: string;
  employeeName: string;
  epfNumber: string;
  designation: string;
  nicNumber: string;
  payroll: PayrollResult;
  allowances: {
    transport: number;
    meal: number;
    overtime: number;
    bonus: number;
  };
  companySettings?: {
    logo: string;
    companyName: string;
    address: string;
    phone: string;
    email: string;
    taxId: string;
  };
}

// Helper to load image
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

export async function generatePayslipPDF(data: PayslipData) {
  const doc = new jsPDF();
  const { companyName, month, employeeName, epfNumber, designation, nicNumber, payroll, allowances, companySettings } = data;

  // Colors
  const navyBlue = "#1e1b4b"; // Navy Blue
  const gray800 = "#1f2937";
  const gray500 = "#6b7280";
  const lightBlueBg = "#f1f5f9";

  // Load Logo - only use custom logo if provided
  let yPos = 10;
  if (companySettings?.logo) {
    try {
      // Use custom logo from company settings
      const logoWidth = 30;
      const logoHeight = 30; // Fixed height for consistency
      doc.addImage(companySettings.logo, "JPEG", 105 - (logoWidth / 2), yPos, logoWidth, logoHeight);
      yPos += logoHeight + 10;
    } catch (e) {
      console.error("Failed to load custom logo", e);
      yPos = 50; // Fallback position if logo fails
    }
  } else {
    // No logo - start from top
    yPos = 50;
  }

  // Header - use custom company name if provided
  doc.setFontSize(20);
  doc.setTextColor(navyBlue);
  doc.setFont("helvetica", "bold");
  doc.text(companySettings?.companyName || companyName || "Infinit Tech Systems", 105, yPos, { align: "center" });

  yPos += 10;
  doc.setFontSize(11);
  doc.setTextColor(gray500);
  doc.setFont("helvetica", "normal");
  // Ensure month is displayed, default to current month if empty
  const displayMonth = month || new Date().toLocaleString('default', { month: 'long' });
  doc.text("Salary Slip - " + displayMonth, 105, yPos, { align: "center" });

  // Employee Details
  yPos += 20;
  doc.setFontSize(12);
  doc.setTextColor(gray800);
  doc.setFont("helvetica", "bold");
  doc.text("Employee Details", 14, yPos);
  
  yPos += 2;
  doc.setDrawColor(209, 213, 219); // Gray-300
  doc.line(14, yPos, 196, yPos);

  yPos += 10;
  doc.setFontSize(10);
  
  const leftColX = 14;
  const rightColX = 196;
  
  // Row 1
  doc.setTextColor(gray800);
  doc.setFont("helvetica", "bold");
  doc.text("Name:", leftColX, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(employeeName, rightColX, yPos, { align: "right" });
  
  // Row 2
  yPos += 7;
  doc.setFont("helvetica", "bold");
  doc.text("Designation:", leftColX, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(designation, rightColX, yPos, { align: "right" });

  // Row 3
  yPos += 7;
  doc.setFont("helvetica", "bold");
  doc.text("EPF No:", leftColX, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(epfNumber, rightColX, yPos, { align: "right" });

  // Row 4
  yPos += 7;
  doc.setFont("helvetica", "bold");
  doc.text("NIC No:", leftColX, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(nicNumber, rightColX, yPos, { align: "right" });

  // Payment Details
  yPos += 15;
  doc.setFontSize(12);
  doc.setTextColor(gray800);
  doc.setFont("helvetica", "bold");
  doc.text("Payment Details", 14, yPos);
  
  yPos += 2;
  doc.setDrawColor(209, 213, 219);
  doc.line(14, yPos, 196, yPos);

  yPos += 10;
  doc.setFontSize(10);

  // Row 1
  doc.setTextColor(gray800);
  doc.setFont("helvetica", "bold");
  doc.text("Period:", leftColX, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(month, rightColX, yPos, { align: "right" });

  // Row 2
  yPos += 7;
  doc.setFont("helvetica", "bold");
  doc.text("Issue Date:", leftColX, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), rightColX, yPos, { align: "right" });

  // Earnings Table
  yPos += 15;
  doc.setFontSize(12);
  doc.setTextColor(gray800);
  doc.setFont("helvetica", "bold");
  doc.text("Earnings", 14, yPos);
  
  yPos += 2;
  doc.setDrawColor(209, 213, 219);
  doc.line(14, yPos, 196, yPos);

  const earningsData = [
    ["Basic Salary", payroll.basicSalary.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })],
  ];

  if (allowances.transport > 0) {
    earningsData.push(["Transport Allowance", allowances.transport.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })]);
  }
  if (allowances.meal > 0) {
    earningsData.push(["Meal Allowance", allowances.meal.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })]);
  }
  if (allowances.overtime > 0) {
    earningsData.push(["Overtime Pay", allowances.overtime.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })]);
  }
  if (allowances.bonus > 0) {
    earningsData.push(["Bonus", allowances.bonus.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })]);
  }

  // Add Gross Salary row
  earningsData.push(["Gross Salary", payroll.grossSalary.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })]);

  autoTable(doc, {
    startY: yPos + 5,
    head: [["Description", "Amount"]],
    body: earningsData,
    theme: 'grid', // Changed to grid for borders
    headStyles: { 
      fillColor: [241, 245, 249], // bg-slate-100
      textColor: [30, 27, 75], // text-navy
      fontStyle: 'bold', 
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: [229, 231, 235] // gray-200
    },
    bodyStyles: { 
      textColor: [31, 41, 55], // text-gray-800
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: [229, 231, 235] // gray-200
    },
    columnStyles: {
      0: { cellWidth: 'auto', fontStyle: 'bold' },
      1: { cellWidth: 'auto', halign: 'right', fontStyle: 'bold' },
    },
    didParseCell: function (data) {
        // Style Gross Salary row
        if (data.row.index === earningsData.length - 1 && data.section === 'body') {
            data.cell.styles.fillColor = [241, 245, 249];
            data.cell.styles.textColor = [30, 27, 75];
        }
    }
  });

  // Deductions Table
  yPos = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.setTextColor(gray800);
  doc.setFont("helvetica", "bold");
  doc.text("Deductions", 14, yPos);
  
  yPos += 2;
  doc.setDrawColor(209, 213, 219);
  doc.line(14, yPos, 196, yPos);

  const deductionsData = [];
  if (payroll.employeeEPF > 0) {
    deductionsData.push(["EPF (8%)", payroll.employeeEPF.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })]);
  }
  if (payroll.apit > 0) {
    deductionsData.push(["APIT", payroll.apit.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })]);
  }

  deductionsData.push(["Total Deductions", payroll.totalDeductions.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })]);

  autoTable(doc, {
    startY: yPos + 5,
    head: [["Description", "Amount"]],
    body: deductionsData,
    theme: 'grid', // Changed to grid
    headStyles: { 
      fillColor: [241, 245, 249], 
      textColor: [30, 27, 75], 
      fontStyle: 'bold', 
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: [229, 231, 235]
    },
    bodyStyles: { 
      textColor: [31, 41, 55], 
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: [229, 231, 235]
    },
    columnStyles: {
      0: { cellWidth: 'auto', fontStyle: 'bold' },
      1: { cellWidth: 'auto', halign: 'right', fontStyle: 'bold' },
    },
    didParseCell: function (data) {
        // Style Total Deductions row
        if (data.row.index === deductionsData.length - 1 && data.section === 'body') {
            data.cell.styles.fillColor = [241, 245, 249];
            data.cell.styles.textColor = [30, 27, 75];
        }
    }
  });

  // Net Salary
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFillColor(241, 245, 249); // Light blue bg
  doc.setDrawColor(229, 231, 235); // Gray border
  doc.rect(14, finalY, 182, 15, "FD");

  doc.setFontSize(12);
  doc.setTextColor(30, 27, 75); // Navy Blue
  doc.setFont("helvetica", "bold");
  doc.text("Net Salary", 20, finalY + 10);
  doc.text(payroll.netSalary.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' }), 190, finalY + 10, { align: "right" });

  // Footer info
  const footerY = finalY + 25;
  doc.setFontSize(9);
  doc.setTextColor(gray500);
  doc.setFont("helvetica", "bold");
  
  if (payroll.employerETF > 0) {
    doc.text(`* ETF Contribution by Employer (3%): ${payroll.employerETF.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}`, 14, footerY);
  }

  // Disclaimer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175); // Gray-400
  doc.text("This is a computer-generated salary slip and does not require signature.", 105, footerY + 15, { align: "center" });

  // Save
  doc.save(`${employeeName.replace(/\s+/g, '_')}_Payslip_${month}.pdf`);
}
