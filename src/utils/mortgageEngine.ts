export interface MortgageInputs {
  homePrice: number;
  downPaymentValue: number;
  downPaymentType: 'amount' | 'percentage';
  loanTermYears: number;
  interestRate: number; // Annual %
  propertyTaxRate: number; // Annual %
  homeInsurance: number; // Annual $
  pmiRate: number; // Annual %
  hoaFees: number; // Monthly $
  extraPaymentMonthly?: number;
  extraPaymentAnnual?: number;
  extraPaymentOneTime?: number;
  extraPaymentOneTimeMonth?: number;
}

export interface AmortizationPeriod {
  period: number;
  month: number;
  year: number;
  startingBalance: number;
  payment: number;
  principalPaid: number;
  interestPaid: number;
  extraPaid: number;
  pmiPaid: number;
  propertyTaxPaid: number;
  insurancePaid: number;
  hoaPaid: number;
  endingBalance: number;
  totalInterestPaid: number;
}

export interface AmortizationYear {
  year: number;
  startingBalance: number;
  totalPayments: number;
  principalPaid: number;
  interestPaid: number;
  pmiPaid: number;
  propertyTaxPaid: number;
  insurancePaid: number;
  hoaPaid: number;
  endingBalance: number;
}

export interface MortgageResults {
  basePrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyHomeInsurance: number;
  initialMonthlyPmi: number;
  monthlyHoa: number;
  totalInitialMonthlyPayment: number;
  loanAmount: number;
  downPaymentAmount: number;
  totalInterestPaid: number;
  totalPaymentsCost: number;
  payoffTermMonths: number;
  interestSavings: number;
  timeSavingsMonths: number;
  monthlySchedule: AmortizationPeriod[];
  yearlySchedule: AmortizationYear[];
  termComparisons: Array<{
    termYears: number;
    monthlyP_I: number;
    totalInterest: number;
    totalCost: number;
  }>;
}

export function calculateMortgage(inputs: MortgageInputs): MortgageResults {
  const {
    homePrice,
    downPaymentValue,
    downPaymentType,
    loanTermYears,
    interestRate,
    propertyTaxRate,
    homeInsurance,
    pmiRate,
    hoaFees,
    extraPaymentMonthly = 0,
    extraPaymentAnnual = 0,
    extraPaymentOneTime = 0,
    extraPaymentOneTimeMonth = 0,
  } = inputs;

  // 1. Calculate Down Payment & Loan Amount
  const downPaymentAmount =
    downPaymentType === 'percentage'
      ? (homePrice * downPaymentValue) / 100
      : downPaymentValue;
  const loanAmount = Math.max(0, homePrice - downPaymentAmount);

  // 2. Base Amortization Monthly payment
  const r = interestRate / 100 / 12;
  const nTotal = loanTermYears * 12;

  let basePrincipalAndInterest = 0;
  if (loanAmount > 0) {
    if (r === 0) {
      basePrincipalAndInterest = loanAmount / nTotal;
    } else {
      basePrincipalAndInterest =
        (loanAmount * r * Math.pow(1 + r, nTotal)) / (Math.pow(1 + r, nTotal) - 1);
    }
  }

  // 3. Taxes, Insurance, PMI, HOA monthly costs
  const monthlyPropertyTax = (homePrice * (propertyTaxRate / 100)) / 12;
  const monthlyHomeInsurance = homeInsurance / 12;
  const initialMonthlyPmi =
    downPaymentAmount < homePrice * 0.2
      ? (loanAmount * (pmiRate / 100)) / 12
      : 0;

  const totalInitialMonthlyPayment =
    basePrincipalAndInterest +
    monthlyPropertyTax +
    monthlyHomeInsurance +
    initialMonthlyPmi +
    hoaFees;

  // Run schedules with and without extra payments to compute comparison / savings
  const {
    schedule: standardSchedule,
    totalInterest: stdInterest,
  } = runAmortizationSimulation({
    loanAmount,
    interestRate,
    termMonths: nTotal,
    homePrice,
    pmiRate,
    downPaymentAmount,
    monthlyPropertyTax,
    monthlyHomeInsurance,
    hoaFees,
    basePayment: basePrincipalAndInterest,
    extraMonthly: 0,
    extraAnnual: 0,
    extraOneTime: 0,
    extraOneTimeMonth: 0,
  });

  const {
    schedule: acceleratedSchedule,
    totalInterest: accelInterest,
    payoffMonths: accelPayoffMonths,
  } = runAmortizationSimulation({
    loanAmount,
    interestRate,
    termMonths: nTotal,
    homePrice,
    pmiRate,
    downPaymentAmount,
    monthlyPropertyTax,
    monthlyHomeInsurance,
    hoaFees,
    basePayment: basePrincipalAndInterest,
    extraMonthly: extraPaymentMonthly,
    extraAnnual: extraPaymentAnnual,
    extraOneTime: extraPaymentOneTime,
    extraOneTimeMonth: extraPaymentOneTimeMonth,
  });

  // Calculate savings
  const interestSavings = Math.max(0, stdInterest - accelInterest);
  const timeSavingsMonths = Math.max(0, nTotal - accelPayoffMonths);

  // Group accelerated schedule by year for yearly view
  const yearlySchedule: AmortizationYear[] = [];
  let currentYear: AmortizationYear | null = null;

  acceleratedSchedule.forEach((period) => {
    if (!currentYear || currentYear.year !== period.year) {
      if (currentYear) {
        yearlySchedule.push(currentYear);
      }
      currentYear = {
        year: period.year,
        startingBalance: period.startingBalance,
        totalPayments: 0,
        principalPaid: 0,
        interestPaid: 0,
        pmiPaid: 0,
        propertyTaxPaid: 0,
        insurancePaid: 0,
        hoaPaid: 0,
        endingBalance: period.endingBalance,
      };
    }

    currentYear.totalPayments += period.payment + period.extraPaid + period.pmiPaid + period.propertyTaxPaid + period.insurancePaid + period.hoaPaid;
    currentYear.principalPaid += period.principalPaid + period.extraPaid;
    currentYear.interestPaid += period.interestPaid;
    currentYear.pmiPaid += period.pmiPaid;
    currentYear.propertyTaxPaid += period.propertyTaxPaid;
    currentYear.insurancePaid += period.insurancePaid;
    currentYear.hoaPaid += period.hoaPaid;
    currentYear.endingBalance = period.endingBalance;
  });

  if (currentYear) {
    yearlySchedule.push(currentYear);
  }

  // Term comparisons: 10, 15, 20, 30 years
  const compareTerms = [10, 15, 20, 30];
  const termComparisons = compareTerms.map((years) => {
    const tComp = years * 12;
    let piPayment = 0;
    if (loanAmount > 0) {
      if (r === 0) {
        piPayment = loanAmount / tComp;
      } else {
        piPayment = (loanAmount * r * Math.pow(1 + r, tComp)) / (Math.pow(1 + r, tComp) - 1);
      }
    }
    const sim = runAmortizationSimulation({
      loanAmount,
      interestRate,
      termMonths: tComp,
      homePrice,
      pmiRate,
      downPaymentAmount,
      monthlyPropertyTax,
      monthlyHomeInsurance,
      hoaFees,
      basePayment: piPayment,
      extraMonthly: 0,
      extraAnnual: 0,
      extraOneTime: 0,
      extraOneTimeMonth: 0,
    });
    return {
      termYears: years,
      monthlyP_I: piPayment,
      totalInterest: sim.totalInterest,
      totalCost: sim.totalInterest + loanAmount,
    };
  });

  return {
    basePrincipalAndInterest,
    monthlyPropertyTax,
    monthlyHomeInsurance,
    initialMonthlyPmi,
    monthlyHoa: hoaFees,
    totalInitialMonthlyPayment,
    loanAmount,
    downPaymentAmount,
    totalInterestPaid: accelInterest,
    totalPaymentsCost: loanAmount + accelInterest,
    payoffTermMonths: accelPayoffMonths,
    interestSavings,
    timeSavingsMonths,
    monthlySchedule: acceleratedSchedule,
    yearlySchedule,
    termComparisons,
  };
}

function runAmortizationSimulation(params: {
  loanAmount: number;
  interestRate: number;
  termMonths: number;
  homePrice: number;
  pmiRate: number;
  downPaymentAmount: number;
  monthlyPropertyTax: number;
  monthlyHomeInsurance: number;
  hoaFees: number;
  basePayment: number;
  extraMonthly: number;
  extraAnnual: number;
  extraOneTime: number;
  extraOneTimeMonth: number;
}): { schedule: AmortizationPeriod[]; totalInterest: number; payoffMonths: number } {
  const {
    loanAmount,
    interestRate,
    termMonths,
    homePrice,
    pmiRate,
    downPaymentAmount,
    monthlyPropertyTax,
    monthlyHomeInsurance,
    hoaFees,
    basePayment,
    extraMonthly,
    extraAnnual,
    extraOneTime,
    extraOneTimeMonth,
  } = params;

  const schedule: AmortizationPeriod[] = [];
  let remainingBalance = loanAmount;
  let totalInterest = 0;
  const r = interestRate / 100 / 12;

  for (let i = 1; i <= termMonths; i++) {
    if (remainingBalance <= 0) break;

    const startingBalance = remainingBalance;
    const interestPaid = remainingBalance * r;
    let principalPaid = basePayment - interestPaid;

    if (principalPaid > remainingBalance) {
      principalPaid = remainingBalance;
    }

    // Determine if PMI is still required (PMI is cancelled once balance falls below 80% of home price)
    const isPmiRequired = remainingBalance > homePrice * 0.8;
    const pmiPaid = isPmiRequired ? (loanAmount * (pmiRate / 100)) / 12 : 0;

    // Extra payments
    let extraPaid = extraMonthly;
    if (i % 12 === 0) {
      extraPaid += extraAnnual;
    }
    if (i === extraOneTimeMonth) {
      extraPaid += extraOneTime;
    }

    if (principalPaid + extraPaid > remainingBalance) {
      extraPaid = remainingBalance - principalPaid;
    }

    remainingBalance = Math.max(0, remainingBalance - (principalPaid + extraPaid));
    totalInterest += interestPaid;

    const monthNum = i;
    const monthIndex = (i - 1) % 12;
    const yearNum = Math.ceil(i / 12);

    schedule.push({
      period: i,
      month: monthIndex + 1,
      year: yearNum,
      startingBalance,
      payment: basePayment,
      principalPaid,
      interestPaid,
      extraPaid,
      pmiPaid,
      propertyTaxPaid: monthlyPropertyTax,
      insurancePaid: monthlyHomeInsurance,
      hoaPaid: hoaFees,
      endingBalance: remainingBalance,
      totalInterestPaid: totalInterest,
    });
  }

  return {
    schedule,
    totalInterest,
    payoffMonths: schedule.length,
  };
}

export function downloadMortgageCSV(results: MortgageResults): void {
  const headers = [
    'Period',
    'Year',
    'Month',
    'Starting Balance ($)',
    'Regular P&I ($)',
    'Principal Paid ($)',
    'Interest Paid ($)',
    'Extra Paid ($)',
    'PMI Paid ($)',
    'Property Tax ($)',
    'Home Insurance ($)',
    'HOA Fee ($)',
    'Ending Balance ($)',
    'Cumulative Interest ($)',
  ];

  const rows = results.monthlySchedule.map((p) => [
    p.period,
    p.year,
    p.month,
    Math.round(p.startingBalance),
    Math.round(p.payment),
    Math.round(p.principalPaid),
    Math.round(p.interestPaid),
    Math.round(p.extraPaid),
    Math.round(p.pmiPaid),
    Math.round(p.propertyTaxPaid),
    Math.round(p.insurancePaid),
    Math.round(p.hoaPaid),
    Math.round(p.endingBalance),
    Math.round(p.totalInterestPaid),
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `mortgage_amortization_schedule.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
