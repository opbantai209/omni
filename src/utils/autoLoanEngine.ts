import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart as ChartJS } from 'chart.js';

export interface AutoLoanInputs {
  vehiclePrice: number;
  downPaymentType: 'amount' | 'percentage';
  downPaymentValue: number; // Dollar amount or percentage (0-100)
  tradeInValue: number;
  tradeInOwed: number; // Existing loan on trade-in
  salesTaxRate: number; // Percentage (e.g., 7.0 for 7%)
  applyTradeInTaxCredit: boolean; // State tax credit on net trade-in value
  dealerFees: number; // Doc fees, registration, title
  financeFees: boolean; // Roll fees into loan or pay in cash
  loanTermMonths: number; // 24, 36, 48, 60, 72, 84
  annualRate: number; // APR Percentage (e.g., 6.5)
  paymentFrequency: 'monthly' | 'biweekly'; // Monthly vs Accelerated Bi-Weekly
  extraPayment: number; // Additional principal payment per period
  annualInsurance?: number;
  annualMaintenance?: number;
}

export interface MonthlySnapshot {
  period: number;
  month: number;
  year: number;
  startingBalance: number;
  payment: number;
  principalPaid: number;
  interestPaid: number;
  extraPaid: number;
  endingBalance: number;
  totalInterestPaid: number;
  vehicleValue: number;
  equity: number; // Vehicle Value - Ending Balance
  isUnderwater: boolean;
}

export interface YearlySnapshot {
  year: number;
  startingBalance: number;
  totalPayments: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
  totalInterestPaid: number;
  vehicleValue: number;
  equity: number;
}

export interface TermComparisonItem {
  termMonths: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  underwaterMonths: number;
}

export interface RebateComparisonInputs {
  vehiclePrice: number;
  downPayment: number;
  termMonths: number;
  promotionalApr: number; // e.g. 0%
  standardApr: number; // e.g. 6.5%
  rebateAmount: number; // e.g. $3,000
}

export interface RebateComparisonResult {
  promoOption: {
    financedAmount: number;
    monthlyPayment: number;
    totalInterest: number;
    totalCost: number;
  };
  rebateOption: {
    financedAmount: number;
    monthlyPayment: number;
    totalInterest: number;
    totalCost: number;
  };
  recommendedOption: 'promo' | 'rebate';
  savings: number;
}

export interface AutoLoanResults {
  netTradeInEquity: number;
  taxableBase: number;
  salesTaxAmount: number;
  upfrontCashNeeded: number;
  netFinancedPrincipal: number;
  regularPayment: number;
  actualPeriods: number;
  totalInterestPaid: number;
  totalLoanCost: number; // Principal + Interest
  totalOutofPocket: number; // Down Payment + Upfront Fees + Loan Cost
  underwaterMonthsCount: number;
  monthlySchedule: MonthlySnapshot[];
  yearlySchedule: YearlySnapshot[];
  termComparisons: TermComparisonItem[];
}

/**
 * Derives initial values, financing principal, and monthly schedule
 */
export function calculateAutoLoan(inputs: AutoLoanInputs): AutoLoanResults {
  const {
    vehiclePrice,
    downPaymentType,
    downPaymentValue,
    tradeInValue,
    tradeInOwed,
    salesTaxRate,
    applyTradeInTaxCredit,
    dealerFees,
    financeFees,
    loanTermMonths,
    annualRate,
    paymentFrequency,
    extraPayment
  } = inputs;

  // 1. Calculate Down Payment & Trade-In Equity
  const downPaymentAmount =
    downPaymentType === 'percentage'
      ? (vehiclePrice * downPaymentValue) / 100
      : downPaymentValue;

  const netTradeInEquity = tradeInValue - tradeInOwed;

  // 2. Sales Tax Calculation
  let taxableBase = vehiclePrice;
  if (applyTradeInTaxCredit && tradeInValue > 0) {
    taxableBase = Math.max(0, vehiclePrice - tradeInValue);
  }
  const salesTaxAmount = taxableBase * (salesTaxRate / 100);

  // 3. Upfront Cash Needed vs. Financed Amount
  let upfrontCashNeeded = downPaymentAmount;
  let feesToFinance = 0;

  if (financeFees) {
    feesToFinance = dealerFees;
  } else {
    upfrontCashNeeded += dealerFees;
  }

  // Net Financed Principal (P)
  // Price + Tax + FeesToFinance - DownPayment - NetTradeInEquity
  const netFinancedPrincipal = Math.max(
    0,
    vehiclePrice + salesTaxAmount + feesToFinance - downPaymentAmount - netTradeInEquity
  );

  // 4. Rate and Payment Calculations
  const isBiWeekly = paymentFrequency === 'biweekly';
  const periodsPerYear = isBiWeekly ? 26 : 12;
  const periodicRate = annualRate / 100 / periodsPerYear;
  const totalPlannedPeriods = isBiWeekly ? Math.round((loanTermMonths / 12) * 26) : loanTermMonths;

  // Amortization Payment Formula
  let regularPayment = 0;
  if (netFinancedPrincipal > 0) {
    if (periodicRate > 0) {
      regularPayment =
        (netFinancedPrincipal *
          (periodicRate * Math.pow(1 + periodicRate, totalPlannedPeriods))) /
        (Math.pow(1 + periodicRate, totalPlannedPeriods) - 1);
    } else {
      regularPayment = netFinancedPrincipal / totalPlannedPeriods;
    }
  }

  // 5. Depreciation Schedule Setup (Year 1: 20% loss, Years 2-7: 15%/yr loss)
  const calculateVehicleValueAtMonth = (m: number): number => {
    if (m === 0) return vehiclePrice;
    if (m <= 12) {
      // Linear monthly decay in year 1 matching 20% total annual drop
      return vehiclePrice * (1 - (0.20 * m) / 12);
    }
    const valYear1 = vehiclePrice * 0.80;
    const remainingYears = (m - 12) / 12;
    return valYear1 * Math.pow(1 - 0.15, remainingYears);
  };

  // 6. Generate Amortization Schedule
  let currentBalance = netFinancedPrincipal;
  let cumulativeInterest = 0;
  let periodCounter = 0;
  let underwaterCount = 0;

  const monthlySchedule: MonthlySnapshot[] = [];
  const yearlyScheduleMap: { [year: number]: YearlySnapshot } = {};

  const maxPeriods = totalPlannedPeriods * 2; // Guard rail

  while (currentBalance > 0.01 && periodCounter < maxPeriods) {
    periodCounter++;
    
    // Approximate month index for vehicle depreciation tracking
    const equivalentMonth = isBiWeekly ? Math.ceil((periodCounter * 12) / 26) : periodCounter;
    const yearIndex = Math.ceil(equivalentMonth / 12);

    const startingBalance = currentBalance;
    const interestForPeriod = startingBalance * periodicRate;
    
    let targetPayment = regularPayment;
    let actualExtra = extraPayment;

    // Check if remaining balance is less than standard payment
    if (startingBalance + interestForPeriod < targetPayment + actualExtra) {
      targetPayment = startingBalance + interestForPeriod;
      actualExtra = 0;
    }

    const principalFromRegular = Math.max(0, targetPayment - interestForPeriod);
    const totalPrincipalForPeriod = Math.min(startingBalance, principalFromRegular + actualExtra);
    const endingBalance = Math.max(0, startingBalance - totalPrincipalForPeriod);

    cumulativeInterest += interestForPeriod;
    currentBalance = endingBalance;

    const currentVehicleValue = calculateVehicleValueAtMonth(equivalentMonth);
    const equity = currentVehicleValue - endingBalance;
    const isUnderwater = equity < 0;
    if (isUnderwater) underwaterCount++;

    const snapshot: MonthlySnapshot = {
      period: periodCounter,
      month: equivalentMonth,
      year: yearIndex,
      startingBalance,
      payment: targetPayment + actualExtra,
      principalPaid: totalPrincipalForPeriod,
      interestPaid: interestForPeriod,
      extraPaid: actualExtra,
      endingBalance,
      totalInterestPaid: cumulativeInterest,
      vehicleValue: currentVehicleValue,
      equity,
      isUnderwater
    };

    monthlySchedule.push(snapshot);

    // Aggregate into Yearly Schedule
    if (!yearlyScheduleMap[yearIndex]) {
      yearlyScheduleMap[yearIndex] = {
        year: yearIndex,
        startingBalance,
        totalPayments: 0,
        principalPaid: 0,
        interestPaid: 0,
        endingBalance: 0,
        totalInterestPaid: 0,
        vehicleValue: currentVehicleValue,
        equity: 0
      };
    }

    const y = yearlyScheduleMap[yearIndex];
    y.totalPayments += snapshot.payment;
    y.principalPaid += snapshot.principalPaid;
    y.interestPaid += snapshot.interestPaid;
    y.endingBalance = endingBalance;
    y.totalInterestPaid = cumulativeInterest;
    y.vehicleValue = currentVehicleValue;
    y.equity = equity;
  }

  const yearlySchedule = Object.values(yearlyScheduleMap);

  // 7. Calculate Term Comparisons (36, 48, 60, 72, 84)
  const termOptions = [36, 48, 60, 72, 84];
  const termComparisons: TermComparisonItem[] = termOptions.map(term => {
    const pRate = annualRate / 100 / 12;
    let pmt = 0;
    if (netFinancedPrincipal > 0) {
      pmt = pRate > 0
        ? (netFinancedPrincipal * (pRate * Math.pow(1 + pRate, term))) / (Math.pow(1 + pRate, term) - 1)
        : netFinancedPrincipal / term;
    }
    const totCost = pmt * term;
    const totInt = totCost - netFinancedPrincipal;

    // Estimate underwater months for this term
    let uwCount = 0;
    let bal = netFinancedPrincipal;
    for (let m = 1; m <= term; m++) {
      const i = bal * pRate;
      const p = pmt - i;
      bal -= p;
      const v = calculateVehicleValueAtMonth(m);
      if (v - bal < 0) uwCount++;
    }

    return {
      termMonths: term,
      monthlyPayment: pmt,
      totalInterest: totInt,
      totalCost: totCost,
      underwaterMonths: uwCount
    };
  });

  const totalLoanCost = netFinancedPrincipal + cumulativeInterest;
  const totalOutofPocket = upfrontCashNeeded + totalLoanCost;

  return {
    netTradeInEquity,
    taxableBase,
    salesTaxAmount,
    upfrontCashNeeded,
    netFinancedPrincipal,
    regularPayment,
    actualPeriods: periodCounter,
    totalInterestPaid: cumulativeInterest,
    totalLoanCost,
    totalOutofPocket,
    underwaterMonthsCount: isBiWeekly ? Math.ceil((underwaterCount * 12) / 26) : underwaterCount,
    monthlySchedule,
    yearlySchedule,
    termComparisons
  };
}

/**
 * Compares 0% Promotional APR vs. Cash Back Rebate
 */
export function calculate0PercentVsRebate(inputs: RebateComparisonInputs): RebateComparisonResult {
  const { vehiclePrice, downPayment, termMonths, promotionalApr, standardApr, rebateAmount } = inputs;

  // Option A: Promotional APR (0%) on full price minus down payment
  const promoPrincipal = Math.max(0, vehiclePrice - downPayment);
  const promoMonthly = promoPrincipal / termMonths;
  const promoTotalCost = promoPrincipal;

  // Option B: Cash Rebate with Standard Market Rate
  const rebatePrincipal = Math.max(0, vehiclePrice - rebateAmount - downPayment);
  const r = standardApr / 100 / 12;
  let rebateMonthly = 0;
  if (rebatePrincipal > 0) {
    rebateMonthly = r > 0
      ? (rebatePrincipal * (r * Math.pow(1 + r, termMonths))) / (Math.pow(1 + r, termMonths) - 1)
      : rebatePrincipal / termMonths;
  }
  const rebateTotalCost = rebateMonthly * termMonths;
  const rebateTotalInterest = rebateTotalCost - rebatePrincipal;

  const promoOption = {
    financedAmount: promoPrincipal,
    monthlyPayment: promoMonthly,
    totalInterest: 0,
    totalCost: promoTotalCost
  };

  const rebateOption = {
    financedAmount: rebatePrincipal,
    monthlyPayment: rebateMonthly,
    totalInterest: rebateTotalInterest,
    totalCost: rebateTotalCost
  };

  const isPromoBetter = promoTotalCost < rebateTotalCost;

  return {
    promoOption,
    rebateOption,
    recommendedOption: isPromoBetter ? 'promo' : 'rebate',
    savings: Math.abs(promoTotalCost - rebateTotalCost)
  };
}

/**
 * Downloads Amortization Schedule as CSV
 */
export function downloadAutoLoanCSV(results: AutoLoanResults, filename = 'auto_loan_amortization.csv') {
  const headers = [
    'Period',
    'Month',
    'Year',
    'Starting Balance ($)',
    'Payment ($)',
    'Principal Paid ($)',
    'Interest Paid ($)',
    'Extra Paid ($)',
    'Ending Balance ($)',
    'Cum. Interest ($)',
    'Est. Vehicle Value ($)',
    'Net Equity ($)',
    'Underwater Risk'
  ];

  const rows = results.monthlySchedule.map(row => [
    row.period,
    row.month,
    row.year,
    row.startingBalance.toFixed(2),
    row.payment.toFixed(2),
    row.principalPaid.toFixed(2),
    row.interestPaid.toFixed(2),
    row.extraPaid.toFixed(2),
    row.endingBalance.toFixed(2),
    row.totalInterestPaid.toFixed(2),
    row.vehicleValue.toFixed(2),
    row.equity.toFixed(2),
    row.isUnderwater ? 'YES' : 'NO'
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

/**
 * Export PDF Report Function
 */
export const exportAutoLoanPDFReport = (
  results: AutoLoanResults,
  inputs: AutoLoanInputs,
  chartInstance: ChartJS<'line'> | null
) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const fmt = (val: number) =>
    `$${Math.round(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  // Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Auto Loan Financing & Amortization Report', 14, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 155, 15);

  // Executive Metric Cards
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Financing Overview', 14, 32);

  const drawCard = (
    x: number,
    y: number,
    w: number,
    h: number,
    title: string,
    val: string,
    color: [number, number, number]
  ) => {
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

  drawCard(14, 36, 43, 17, 'Regular Payment', fmt(results.regularPayment), [37, 99, 235]);
  drawCard(60, 36, 43, 17, 'Net Financed', fmt(results.netFinancedPrincipal), [51, 65, 85]);
  drawCard(106, 36, 43, 17, 'Total Interest', fmt(results.totalInterestPaid), [147, 51, 234]);
  drawCard(152, 36, 44, 17, 'Total Out of Pocket', fmt(results.totalOutofPocket), [16, 185, 129]);

  // Parameters Line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const paramLine = `Vehicle: ${fmt(inputs.vehiclePrice)} | APR: ${inputs.annualRate}% | Term: ${inputs.loanTermMonths} Mo | Freq: ${inputs.paymentFrequency}`;
  doc.text(paramLine, 14, 58);

  let currentY = 62;

  // Chart Image
  if (chartInstance) {
    const chartImageBase64 = chartInstance.toBase64Image();
    doc.addImage(chartImageBase64, 'PNG', 14, currentY, 182, 68);
    currentY += 72;
  }

  // Yearly Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('Annual Loan Amortization Schedule', 14, currentY);

  const tableHead = [['Year', 'Starting ($)', 'Total Payments ($)', 'Principal ($)', 'Interest ($)', 'Ending ($)', 'Car Value ($)', 'Equity ($)']];
  const tableData = results.yearlySchedule.map((row) => [
    `Year ${row.year}`,
    fmt(row.startingBalance),
    fmt(row.totalPayments),
    fmt(row.principalPaid),
    fmt(row.interestPaid),
    fmt(row.endingBalance),
    fmt(row.vehicleValue),
    fmt(row.equity),
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
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      5: { fontStyle: 'bold', textColor: [15, 23, 42] },
    },
    margin: { left: 14, right: 14, bottom: 15 },
  });

  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${totalPages}`, 105, 290, { align: 'center' });
  }

  doc.save(`Auto_Loan_Report_${inputs.loanTermMonths}Mo.pdf`);
};
