import { Country, Currency } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface SalaryBreakdown {
  basic: number;
  allowances: number;
  bonuses: number;
  grossPay: number;

  // Employee Deductions
  incomeTax: number;
  employeePension: number; // EPF (SL) or Social Insurance (JP)
  healthInsurance: number;
  totalDeductions: number;

  // Employer Contributions (not deducted from employee)
  employerPension: number;
  employerETF: number; // Only Sri Lanka

  // Final
  netPay: number;
  currency: Currency;

  // Breakdown details
  taxBreakdown?: {
    bracket: string;
    rate: number;
    amount: number;
  }[];
}

interface CalculateSalaryInput {
  basicSalary: number;
  allowances?: Record<string, number>; // { housing: 50000, transport: 20000 }
  bonuses?: number;
  deductions?: Record<string, number>; // Manual deductions
  country: Country;
  currency: Currency;
  employmentStatus?: 'PERMANENT' | 'PROBATION' | 'INTERN' | 'CONTRACT';
}

// ========================================
// SRI LANKA TAX RULES (2025 - APIT Monthly)
// ========================================
const SRI_LANKA_APIT_BRACKETS = [
  { limit: 100000, rate: 0 },      // Tax-free up to LKR 100,000/month
  { limit: 141667, rate: 0.06 },   // 6% on LKR 100,001 - 141,667
  { limit: 183333, rate: 0.12 },   // 12% on LKR 141,668 - 183,333
  { limit: 225000, rate: 0.18 },   // 18% on LKR 183,334 - 225,000
  { limit: 266667, rate: 0.24 },   // 24% on LKR 225,001 - 266,667
  { limit: 308333, rate: 0.30 },   // 30% on LKR 266,668 - 308,333
  { limit: Infinity, rate: 0.36 }, // 36% above LKR 308,333
];

const SRI_LANKA_EPF_EMPLOYEE = 0.08; // 8%
const SRI_LANKA_EPF_EMPLOYER = 0.12; // 12%
const SRI_LANKA_ETF = 0.03; // 3% (employer only)

// ========================================
// JAPAN TAX RULES (Simplified Estimate)
// ========================================
const JAPAN_SOCIAL_INSURANCE = 0.15; // ~15% (Health + Pension + Unemployment combined)
const JAPAN_INCOME_TAX = 0.10; // Flat 10% estimate (actual is progressive)

// ========================================
// MAIN CALCULATION FUNCTION
// ========================================
export function calculateSalary(
  input: CalculateSalaryInput
): SalaryBreakdown {
  const { basicSalary, allowances = {}, bonuses = 0, country, currency, employmentStatus = 'PERMANENT' } = input;

  const totalAllowances = Object.values(allowances).reduce(
    (sum, val) => sum + val,
    0
  );
  const grossPay = basicSalary + totalAllowances + bonuses;

  if (country === Country.SRI_LANKA) {
    return calculateSriLankaSalary(
      basicSalary,
      totalAllowances,
      bonuses,
      grossPay,
      currency,
      employmentStatus
    );
  } else if (country === Country.JAPAN) {
    return calculateJapanSalary(
      basicSalary,
      totalAllowances,
      bonuses,
      grossPay,
      currency
    );
  }

  throw new Error(`Unsupported country: ${country}`);
}

// ========================================
// SRI LANKA CALCULATION
// ========================================
function calculateSriLankaSalary(
  basic: number,
  allowances: number,
  bonuses: number,
  gross: number,
  currency: Currency,
  employmentStatus: 'PERMANENT' | 'PROBATION' | 'INTERN' | 'CONTRACT' = 'PERMANENT'
): SalaryBreakdown {
  // INTERNS ARE EXEMPT from EPF, ETF, and APIT
  if (employmentStatus === 'INTERN') {
    return {
      basic,
      allowances,
      bonuses,
      grossPay: gross,
      incomeTax: 0,
      employeePension: 0,
      healthInsurance: 0,
      totalDeductions: 0,
      employerPension: 0,
      employerETF: 0,
      netPay: gross,
      currency,
      taxBreakdown: [],
    };
  }

  // Monthly gross for APIT calculation (2025 uses monthly brackets)
  const monthlyGross = gross;

  // Calculate progressive APIT (Advanced Personal Income Tax)
  let taxOwed = 0;
  let previousLimit = 0;
  const taxBreakdown: { bracket: string; rate: number; amount: number }[] = [];

  for (const bracket of SRI_LANKA_APIT_BRACKETS) {
    if (monthlyGross > previousLimit) {
      const taxableInBracket = Math.min(
        monthlyGross - previousLimit,
        bracket.limit - previousLimit
      );
      const taxForBracket = taxableInBracket * bracket.rate;
      taxOwed += taxForBracket;

      if (bracket.rate > 0) {
        taxBreakdown.push({
          bracket: `${previousLimit.toLocaleString()} - ${bracket.limit === Infinity ? "Above" : bracket.limit.toLocaleString()} LKR`,
          rate: bracket.rate * 100,
          amount: taxForBracket,
        });
      }

      previousLimit = bracket.limit;
    }
  }

  // EPF Employee (8% of basic)
  const employeePension = basic * SRI_LANKA_EPF_EMPLOYEE;

  // EPF Employer (12% of basic)
  const employerPension = basic * SRI_LANKA_EPF_EMPLOYER;

  // ETF Employer (3% of basic)
  const employerETF = basic * SRI_LANKA_ETF;

  const totalDeductions = taxOwed + employeePension;
  const netPay = gross - totalDeductions;

  return {
    basic,
    allowances,
    bonuses,
    grossPay: gross,
    incomeTax: parseFloat(taxOwed.toFixed(2)),
    employeePension: parseFloat(employeePension.toFixed(2)),
    healthInsurance: 0, // Not standard in SL private sector
    totalDeductions: parseFloat(totalDeductions.toFixed(2)),
    employerPension: parseFloat(employerPension.toFixed(2)),
    employerETF: parseFloat(employerETF.toFixed(2)),
    netPay: parseFloat(netPay.toFixed(2)),
    currency,
    taxBreakdown,
  };
}

// ========================================
// JAPAN CALCULATION
// ========================================
function calculateJapanSalary(
  basic: number,
  allowances: number,
  bonuses: number,
  gross: number,
  currency: Currency
): SalaryBreakdown {
  // Social Insurance (Health + Pension + Employment Insurance)
  const socialInsurance = gross * JAPAN_SOCIAL_INSURANCE;

  // Income Tax (simplified - actual is more complex with deductions)
  const incomeTax = gross * JAPAN_INCOME_TAX;

  // Employer also pays social insurance (typically same amount as employee)
  const employerContribution = gross * JAPAN_SOCIAL_INSURANCE;

  const totalDeductions = socialInsurance + incomeTax;
  const netPay = gross - totalDeductions;

  return {
    basic,
    allowances,
    bonuses,
    grossPay: gross,
    incomeTax: parseFloat(incomeTax.toFixed(2)),
    employeePension: parseFloat((socialInsurance * 0.5).toFixed(2)), // Split pension from health
    healthInsurance: parseFloat((socialInsurance * 0.5).toFixed(2)),
    totalDeductions: parseFloat(totalDeductions.toFixed(2)),
    employerPension: parseFloat((employerContribution * 0.5).toFixed(2)),
    employerETF: 0, // Japan doesn't have ETF
    netPay: parseFloat(netPay.toFixed(2)),
    currency,
  };
}

// ========================================
// BATCH PAYROLL GENERATION
// ========================================
export interface GeneratePayrollInput {
  employeeId: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances?: Record<string, number>;
  bonuses?: number;
  deductions?: Record<string, number>;
  country: Country;
  currency: Currency;
  employmentStatus?: 'PERMANENT' | 'PROBATION' | 'INTERN' | 'CONTRACT';
}

export function generatePayrollData(input: GeneratePayrollInput) {
  const breakdown = calculateSalary({
    basicSalary: input.basicSalary,
    allowances: input.allowances,
    bonuses: input.bonuses,
    country: input.country,
    currency: input.currency,
    employmentStatus: input.employmentStatus,
  });

  return {
    employeeId: input.employeeId,
    month: input.month,
    year: input.year,
    basicSalary: new Decimal(breakdown.basic),
    allowances: input.allowances || {},
    bonuses: new Decimal(breakdown.bonuses),
    taxDeductions: new Decimal(breakdown.incomeTax),
    employeePension: new Decimal(breakdown.employeePension),
    healthInsurance: new Decimal(breakdown.healthInsurance),
    otherDeductions: input.deductions || {},
    employerPension: new Decimal(breakdown.employerPension),
    employerETF: new Decimal(breakdown.employerETF),
    netSalary: new Decimal(breakdown.netPay - Object.values(input.deductions || {}).reduce((a, b) => a + b, 0)),
    currency: input.currency,
  };
}

// ========================================
// CURRENCY CONVERSION HELPER
// ========================================
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  exchangeRate?: number // Optional: fetch from API in production
): number {
  if (from === to) return amount;

  // Default exchange rate (should be fetched from live API in production)
  // 1 JPY = ~2.2 LKR (approximate as of 2024)
  const defaultRate = from === Currency.JPY ? 2.2 : 1 / 2.2;
  const rate = exchangeRate || defaultRate;

  return parseFloat((amount * rate).toFixed(2));
}
