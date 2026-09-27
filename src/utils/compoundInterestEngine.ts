import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export type CompoundingFrequency = 365 | 12 | 4 | 2 | 1;
export type ContributionFrequency = 'monthly' | 'annually';
export type DepositTiming = 'beginning' | 'end';

export interface CalculatorInputs {
  initialPrincipal: number;
  additionalContribution: number;
  contributionFrequency: ContributionFrequency;
  depositTiming: DepositTiming;
  annualRate: number; // Percentage (e.g. 7.5)
  compoundingFrequency: CompoundingFrequency | number;
  years: number;
  annualStepUp: number; // Percentage
  inflationRate: number; // Percentage
  taxRate: number; // Percentage
  currentAge?: number;

  // Aliases for UI options
  annualInterestRate?: number;
  investmentHorizonYears?: number;
  annualContributionStepUp?: number;
  adjustForInflation?: boolean;
  marginalTaxRate?: number;
  applyTaxDrag?: boolean;
}

export type CompoundInterestInputs = CalculatorInputs;

export interface MonthlySnapshot {
  month: number;
  year: number;
  age?: number;
  startingBalance: number;
  contribution: number;
  interestEarned: number;
  endingBalance: number;
  totalContributions: number;
  totalInterestEarned: number;
  realEndingBalance: number;
  cumulativeDeposited?: number;
  cumulativeInterest?: number;
}

export interface YearlySnapshot {
  year: number;
  age?: number;
  startingBalance: number;
  annualContributions: number;
  interestEarned: number;
  endingBalance: number;
  totalContributions: number;
  totalInterestEarned: number;
  realEndingBalance: number;
  cumulativeDeposited: number;
  cumulativeInterest: number;
}

export interface TippingPointInfo {
  year: number;
  month: number;
  totalMonth: number;
  totalMonths: number;
  age?: number;
}

export interface CalculationResults {
  monthlySchedule: MonthlySnapshot[];
  yearlySchedule: YearlySnapshot[];
  annualSchedule: YearlySnapshot[]; // alias for yearlySchedule
  finalBalance: number;
  endBalance: number; // alias for finalBalance
  totalPrincipal: number;
  totalContributions: number;
  totalDeposited: number; // alias
  totalInterestEarned: number;
  finalRealBalance: number;
  realEndBalance: number; // alias
  effectiveApr: number;
  tippingPointMonth: number | null;
  tippingPoint: TippingPointInfo | null;
}

/**
 * Calculates compound interest with step-up escalation, inflation adjustment, and tax drag.
 */
export function calculateCompoundInterest(inputs: CalculatorInputs): CalculationResults {
  const initialPrincipal = inputs.initialPrincipal ?? 10000;
  const additionalContribution = inputs.additionalContribution ?? 500;
  const contributionFrequency = inputs.contributionFrequency ?? 'monthly';
  const depositTiming = inputs.depositTiming ?? 'end';
  const annualRate = inputs.annualRate ?? inputs.annualInterestRate ?? 8;
  const compoundingFrequency = Number(inputs.compoundingFrequency) || 12;
  const years = inputs.years ?? inputs.investmentHorizonYears ?? 20;
  const annualStepUp = inputs.annualStepUp ?? inputs.annualContributionStepUp ?? 0;
  const inflationRate = inputs.adjustForInflation !== false ? (inputs.inflationRate ?? 2.5) : 0;
  const taxRate = inputs.applyTaxDrag !== false ? (inputs.taxRate ?? inputs.marginalTaxRate ?? 0) : 0;
  const currentAge = inputs.currentAge ?? 30;

  const totalMonths = Math.max(1, years * 12);
  const monthlySchedule: MonthlySnapshot[] = [];
  const yearlySchedule: YearlySnapshot[] = [];

  // Effective annual interest after tax drag
  const effectiveAnnualRate = (annualRate / 100) * (1 - taxRate / 100);

  // Equivalent monthly compound factor derived from compounding frequency n:
  const n = compoundingFrequency || 12;
  const monthlyRateFactor = n > 0
    ? Math.pow(1 + effectiveAnnualRate / n, n / 12) - 1
    : 0;

  // Monthly inflation factor
  const monthlyInflationRate = Math.pow(1 + inflationRate / 100, 1 / 12) - 1;

  let currentBalance = initialPrincipal;
  let cumulativeContributions = initialPrincipal; // starting principal + added
  let cumulativeAddedDeposits = 0;
  let cumulativeInterest = 0;
  let tippingPointMonth: number | null = null;
  let tippingPointInfo: TippingPointInfo | null = null;

  let currentYearStartingBalance = initialPrincipal;
  let currentYearContributions = 0;
  let currentYearInterest = 0;

  for (let m = 1; m <= totalMonths; m++) {
    const currentYear = Math.floor((m - 1) / 12) + 1;
    const isNewYear = (m - 1) % 12 === 0;
    const ageAtMonth = currentAge + Math.floor((m - 1) / 12);

    if (isNewYear && m > 1) {
      currentYearStartingBalance = currentBalance;
      currentYearContributions = 0;
      currentYearInterest = 0;
    }

    // Step-up contribution multiplier
    const stepUpMultiplier = Math.pow(1 + annualStepUp / 100, currentYear - 1);

    let monthlyDeposit = 0;
    if (contributionFrequency === 'monthly') {
      monthlyDeposit = additionalContribution * stepUpMultiplier;
    } else if (contributionFrequency === 'annually' && isNewYear) {
      monthlyDeposit = additionalContribution * stepUpMultiplier;
    }

    const startBalance = currentBalance;
    let interestEarned = 0;
    let endBalanceVal = startBalance;

    if (depositTiming === 'beginning') {
      const balanceForInterest = startBalance + monthlyDeposit;
      interestEarned = balanceForInterest * monthlyRateFactor;
      endBalanceVal = balanceForInterest + interestEarned;
    } else {
      interestEarned = startBalance * monthlyRateFactor;
      endBalanceVal = startBalance + interestEarned + monthlyDeposit;
    }

    cumulativeAddedDeposits += monthlyDeposit;
    cumulativeContributions = initialPrincipal + cumulativeAddedDeposits;
    cumulativeInterest += interestEarned;
    currentBalance = endBalanceVal;

    currentYearContributions += monthlyDeposit;
    currentYearInterest += interestEarned;

    // Tipping point check
    if (tippingPointMonth === null && cumulativeInterest >= cumulativeContributions) {
      tippingPointMonth = m;
      tippingPointInfo = {
        totalMonth: m,
        totalMonths: m,
        year: currentYear,
        month: ((m - 1) % 12) + 1,
        age: ageAtMonth
      };
    }

    const realEndingBalance = currentBalance / Math.pow(1 + monthlyInflationRate, m);

    monthlySchedule.push({
      month: m,
      year: currentYear,
      age: ageAtMonth,
      startingBalance: startBalance,
      contribution: monthlyDeposit,
      interestEarned,
      endingBalance: currentBalance,
      totalContributions: cumulativeContributions,
      totalInterestEarned: cumulativeInterest,
      realEndingBalance,
      cumulativeDeposited: cumulativeContributions,
      cumulativeInterest
    });

    if (m % 12 === 0 || m === totalMonths) {
      yearlySchedule.push({
        year: currentYear,
        age: ageAtMonth,
        startingBalance: currentYearStartingBalance,
        annualContributions: currentYearContributions,
        interestEarned: currentYearInterest,
        endingBalance: currentBalance,
        totalContributions: cumulativeContributions,
        totalInterestEarned: cumulativeInterest,
        realEndingBalance,
        cumulativeDeposited: cumulativeContributions,
        cumulativeInterest
      });
    }
  }

  const finalReal = currentBalance / Math.pow(1 + monthlyInflationRate, totalMonths);

  return {
    monthlySchedule,
    yearlySchedule,
    annualSchedule: yearlySchedule,
    finalBalance: currentBalance,
    endBalance: currentBalance,
    totalPrincipal: initialPrincipal,
    totalContributions: cumulativeContributions,
    totalDeposited: cumulativeContributions,
    totalInterestEarned: cumulativeInterest,
    finalRealBalance: finalReal,
    realEndBalance: finalReal,
    effectiveApr: effectiveAnnualRate * 100,
    tippingPointMonth,
    tippingPoint: tippingPointInfo
  };
}

/**
 * Downloads the year-by-year schedule as CSV file.
 */
export function downloadScheduleCSV(results: CalculationResults, filename = 'compound_interest_schedule.csv') {
  const headers = [
    'Year',
    'Age',
    'Starting Balance ($)',
    'Annual Contributions ($)',
    'Interest Earned ($)',
    'Ending Balance ($)',
    'Total Contributions ($)',
    'Total Interest Earned ($)',
    'Real Value ($)'
  ];

  const rows = results.yearlySchedule.map(row => [
    row.year,
    row.age ?? '',
    row.startingBalance.toFixed(2),
    row.annualContributions.toFixed(2),
    row.interestEarned.toFixed(2),
    row.endingBalance.toFixed(2),
    row.totalContributions.toFixed(2),
    row.totalInterestEarned.toFixed(2),
    row.realEndingBalance.toFixed(2)
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const downloadCSV = downloadScheduleCSV;
export const generateCompoundInterestCSV = (
  results: CalculationResults,
  filename = 'compound_interest_schedule.csv',
  _unused?: unknown
) => downloadScheduleCSV(results, filename);

export { exportPDFReport } from './compoundInterestPDF';

/**
 * PDF Executive Summary Generator
 */
export function generateCompoundInterestPDF(
  inputsOrResults: CalculatorInputs | CalculationResults | unknown,
  resultsOrInputs?: CalculationResults | CalculatorInputs | unknown,
  chartCanvasOrFilename?: HTMLCanvasElement | string | null
) {
  let inputs: CalculatorInputs;
  let results: CalculationResults;
  let chartCanvas: HTMLCanvasElement | null = null;

  if (inputsOrResults && 'yearlySchedule' in (inputsOrResults as CalculationResults)) {
    results = inputsOrResults as CalculationResults;
    inputs = (resultsOrInputs as CalculatorInputs) || {};
  } else {
    inputs = (inputsOrResults as CalculatorInputs) || {};
    results = (resultsOrInputs as CalculationResults) || calculateCompoundInterest(inputs);
  }

  if (chartCanvasOrFilename && typeof chartCanvasOrFilename !== 'string') {
    chartCanvas = chartCanvasOrFilename as HTMLCanvasElement;
  }

  const doc = new jsPDF('p', 'pt', 'a4');

  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59);
  doc.text('Compound Interest Investment Report', 40, 40);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on ${new Date().toLocaleDateString()} | Strategy Analysis`, 40, 55);

  autoTable(doc, {
    startY: 70,
    head: [['Key Metric', 'Value']],
    body: [
      ['Final Portfolio Value', `$${(results.finalBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
      ['Total Cash Deposited', `$${(results.totalContributions || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
      ['Total Interest Earned', `$${(results.totalInterestEarned || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
      ['Real Value (Inflation Adjusted)', `$${(results.finalRealBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
      ['Tipping Point', results.tippingPoint ? `Year ${results.tippingPoint.year}, Month ${results.tippingPoint.month}` : 'Not reached within horizon']
    ],
    theme: 'striped',
    styles: { fontSize: 9 }
  });

  let currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;

  if (chartCanvas) {
    try {
      const imgData = chartCanvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 40, currentY, 515, 200);
      currentY += 210;
    } catch {
      // Ignore if canvas capture fails
    }
  }

  autoTable(doc, {
    startY: currentY,
    head: [['Input Parameter', 'Value']],
    body: [
      ['Starting Principal', `$${(inputs.initialPrincipal || 0).toLocaleString()}`],
      ['Additional Contribution', `$${(inputs.additionalContribution || 0).toLocaleString()} / ${inputs.contributionFrequency || 'monthly'}`],
      ['Expected Annual Rate', `${inputs.annualRate ?? inputs.annualInterestRate ?? 8}%`],
      ['Compounding Frequency', `${inputs.compoundingFrequency || 12} times/year`],
      ['Investment Horizon', `${inputs.years ?? inputs.investmentHorizonYears ?? 20} Years`],
      ['Annual Step-Up', `${inputs.annualStepUp ?? inputs.annualContributionStepUp ?? 0}%`],
      ['Inflation Rate', `${inputs.inflationRate || 0}%`],
      ['Tax Rate Drag', `${inputs.taxRate ?? inputs.marginalTaxRate ?? 0}%`]
    ],
    theme: 'grid',
    styles: { fontSize: 8 }
  });

  currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;

  autoTable(doc, {
    startY: currentY,
    head: [['Year', 'Starting ($)', 'Deposits ($)', 'Interest ($)', 'Ending ($)', 'Cumulative Interest ($)']],
    body: (results.yearlySchedule || []).map(r => [
      `Yr ${r.year}`,
      `$${Math.round(r.startingBalance).toLocaleString()}`,
      `$${Math.round(r.annualContributions).toLocaleString()}`,
      `$${Math.round(r.interestEarned).toLocaleString()}`,
      `$${Math.round(r.endingBalance).toLocaleString()}`,
      `$${Math.round(r.totalInterestEarned).toLocaleString()}`
    ]),
    theme: 'striped',
    styles: { fontSize: 7 }
  });

  doc.save('compound_interest_report.pdf');
}

/**
 * Search Params URL persistence utilities
 */
export function inputsToSearchParams(inputs: CalculatorInputs): URLSearchParams {
  const params = new URLSearchParams();
  params.set('p', (inputs.initialPrincipal ?? 10000).toString());
  params.set('c', (inputs.additionalContribution ?? 500).toString());
  params.set('cf', inputs.contributionFrequency || 'monthly');
  params.set('dt', inputs.depositTiming || 'end');
  params.set('r', (inputs.annualRate ?? inputs.annualInterestRate ?? 8).toString());
  params.set('n', (inputs.compoundingFrequency || 12).toString());
  params.set('y', (inputs.years ?? inputs.investmentHorizonYears ?? 20).toString());
  params.set('su', (inputs.annualStepUp ?? inputs.annualContributionStepUp ?? 0).toString());
  params.set('inf', (inputs.inflationRate ?? 2.5).toString());
  params.set('tax', (inputs.taxRate ?? inputs.marginalTaxRate ?? 0).toString());
  if (inputs.currentAge) params.set('age', inputs.currentAge.toString());
  return params;
}

export function searchParamsToInputs(params: URLSearchParams, defaults?: CalculatorInputs): CalculatorInputs {
  const def = defaults || {
    initialPrincipal: 10000,
    additionalContribution: 500,
    contributionFrequency: 'monthly',
    depositTiming: 'end',
    annualRate: 8,
    annualInterestRate: 8,
    compoundingFrequency: 12,
    years: 20,
    investmentHorizonYears: 20,
    annualStepUp: 0,
    annualContributionStepUp: 0,
    inflationRate: 2.5,
    taxRate: 0,
    marginalTaxRate: 0,
    currentAge: 30
  };

  const p = parseFloat(params.get('p') || '');
  const c = parseFloat(params.get('c') || '');
  const r = parseFloat(params.get('r') || '');
  const n = parseInt(params.get('n') || '', 10) as CompoundingFrequency;
  const y = parseInt(params.get('y') || '', 10);
  const su = parseFloat(params.get('su') || '');
  const inf = parseFloat(params.get('inf') || '');
  const tax = parseFloat(params.get('tax') || '');
  const age = parseInt(params.get('age') || '', 10);

  return {
    initialPrincipal: !isNaN(p) ? p : def.initialPrincipal,
    additionalContribution: !isNaN(c) ? c : def.additionalContribution,
    contributionFrequency: (params.get('cf') as ContributionFrequency) || def.contributionFrequency,
    depositTiming: (params.get('dt') as DepositTiming) || def.depositTiming,
    annualRate: !isNaN(r) ? r : (def.annualRate ?? 8),
    annualInterestRate: !isNaN(r) ? r : (def.annualInterestRate ?? 8),
    compoundingFrequency: !isNaN(n) ? n : def.compoundingFrequency,
    years: !isNaN(y) ? y : (def.years ?? 20),
    investmentHorizonYears: !isNaN(y) ? y : (def.investmentHorizonYears ?? 20),
    annualStepUp: !isNaN(su) ? su : (def.annualStepUp ?? 0),
    annualContributionStepUp: !isNaN(su) ? su : (def.annualContributionStepUp ?? 0),
    inflationRate: !isNaN(inf) ? inf : def.inflationRate,
    taxRate: !isNaN(tax) ? tax : (def.taxRate ?? 0),
    marginalTaxRate: !isNaN(tax) ? tax : (def.marginalTaxRate ?? 0),
    currentAge: !isNaN(age) ? age : def.currentAge
  };
}
