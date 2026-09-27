export interface AdvancedDebt {
  id: string;
  name: string;
  balance: number;
  nominalApr: number;
  minPaymentFloor: number;
  minPaymentPrincipalPercent: number;
  isTaxDeductible?: boolean;
  promoApr?: number;
  promoMonthsRemaining?: number;
  isDeferredInterest?: boolean;
}

export interface SimulationConfig {
  extraMonthlyBudget: number;
  strategy: 'snowball' | 'avalanche' | 'effective_avalanche';
  marginalTaxRate?: number;
  annualInflationRate?: number;
}

export interface MonthlySnapshot {
  month: number;
  totalRemainingBalance: number;
  totalInterestAccrued: number;
  discountedNpvInterest: number;
}

export interface SimulationResult {
  totalMonths: number;
  totalInterestPaid: number;
  npvInterestPaid: number;
  monthlyHistory: MonthlySnapshot[];
}

export function runAdvancedPayoffSimulation(
  initialDebts: AdvancedDebt[],
  config: SimulationConfig
): SimulationResult {
  let debts = initialDebts.map(d => ({
    ...d,
    currentBalance: d.balance,
    accruedDeferredInterest: 0
  }));

  const taxRate = config.marginalTaxRate || 0;
  const inflationRate = config.annualInflationRate || 0;
  
  let totalInterestPaid = 0;
  let npvInterestPaid = 0;
  let month = 0;
  const monthlyHistory: MonthlySnapshot[] = [];

  while (debts.some(d => d.currentBalance > 0) && month < 480) {
    month++;
    let monthlyInterestSum = 0;

    debts.forEach(d => {
      if (d.currentBalance <= 0) return;

      const isPromoActive = d.promoMonthsRemaining && d.promoMonthsRemaining >= month;
      const currentApr = isPromoActive ? (d.promoApr ?? 0) : d.nominalApr;
      const monthlyRate = (currentApr / 100) / 12;

      if (isPromoActive && d.isDeferredInterest) {
        const shadowRate = (d.nominalApr / 100) / 12;
        d.accruedDeferredInterest += d.currentBalance * shadowRate;
      }

      if (d.promoMonthsRemaining === month - 1 && d.isDeferredInterest && d.currentBalance > 0) {
        d.currentBalance += d.accruedDeferredInterest;
        monthlyInterestSum += d.accruedDeferredInterest;
        d.accruedDeferredInterest = 0;
      }

      const interestCharge = d.currentBalance * monthlyRate;
      d.currentBalance += interestCharge;
      monthlyInterestSum += interestCharge;
    });

    totalInterestPaid += monthlyInterestSum;

    const monthlyDiscountFactor = Math.pow(1 + inflationRate / 12, month);
    npvInterestPaid += monthlyInterestSum / monthlyDiscountFactor;

    debts.forEach(d => {
      if (d.currentBalance <= 0) return;
      const currentApr = (d.promoMonthsRemaining && d.promoMonthsRemaining >= month) ? (d.promoApr ?? 0) : d.nominalApr;
      const monthlyInterest = d.currentBalance * ((currentApr / 100) / 12);
      const calcMin = monthlyInterest + (d.minPaymentPrincipalPercent * d.currentBalance);
      const minPayment = Math.min(d.currentBalance, Math.max(d.minPaymentFloor, calcMin));
      d.currentBalance -= minPayment;
    });

    const activeDebts = debts.filter(d => d.currentBalance > 0);

    activeDebts.sort((a, b) => {
      if (config.strategy === 'snowball') {
        return a.currentBalance - b.currentBalance;
      }
      const getEffectiveRate = (d: typeof a) => {
        const isPromo = d.promoMonthsRemaining && d.promoMonthsRemaining >= month;
        const baseApr = isPromo ? (d.promoApr ?? 0) : d.nominalApr;
        return d.isTaxDeductible ? baseApr * (1 - taxRate) : baseApr;
      };
      return getEffectiveRate(b) - getEffectiveRate(a);
    });

    let surplus = config.extraMonthlyBudget;
    for (const debt of activeDebts) {
      if (surplus <= 0) break;
      const payoffAmount = Math.min(debt.currentBalance, surplus);
      debt.currentBalance -= payoffAmount;
      surplus -= payoffAmount;
    }

    const totalRemaining = debts.reduce((sum, d) => sum + Math.max(0, d.currentBalance), 0);
    monthlyHistory.push({
      month,
      totalRemainingBalance: totalRemaining,
      totalInterestAccrued: totalInterestPaid,
      discountedNpvInterest: npvInterestPaid
    });
  }

  return {
    totalMonths: month,
    totalInterestPaid,
    npvInterestPaid,
    monthlyHistory
  };
}

export interface BalanceTransferConfig {
  transferFeePercent: number;
  promoApr: number;
  promoMonths: number;
  postPromoApr: number;
  monthlyPayment: number;
}

export interface BalanceTransferResult {
  initialPrincipal: number;
  feeAmount: number;
  totalInterest: number;
  totalCost: number;
  payoffMonths: number;
  history: { month: number; balance: number }[];
}

export interface ConsolidationLoanConfig {
  loanApr: number;
  originationFeePercent: number;
  loanTermMonths: number;
}

export interface ConsolidationLoanResult {
  initialPrincipal: number;
  feeAmount: number;
  totalLoanAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  history: { month: number; balance: number }[];
}

/**
 * Evaluates a Balance Transfer offer against selected debts.
 */
export function evaluateBalanceTransfer(
  selectedDebts: Array<{ balance: number | string }>,
  transferConfig: BalanceTransferConfig
): BalanceTransferResult {
  const { transferFeePercent, promoApr, promoMonths, postPromoApr, monthlyPayment } = transferConfig;

  // Total balance transferred
  const initialPrincipal = selectedDebts.reduce((sum, d) => sum + (Number(d.balance) || 0), 0);
  const feeAmount = initialPrincipal * (transferFeePercent / 100);
  let currentBalance = initialPrincipal + feeAmount;

  let totalInterest = 0;
  let month = 0;
  const history: { month: number; balance: number }[] = [];

  while (currentBalance > 0 && month < 360) {
    month++;
    
    // Apply appropriate APR based on promo window
    const activeApr = month <= promoMonths ? promoApr : postPromoApr;
    const monthlyRate = (activeApr / 100) / 12;
    const interest = currentBalance * monthlyRate;
    
    currentBalance += interest;
    totalInterest += interest;

    // Apply fixed monthly payment
    const payment = Math.min(currentBalance, monthlyPayment);
    currentBalance -= payment;

    history.push({ month, balance: Math.max(0, currentBalance) });
  }

  return {
    initialPrincipal,
    feeAmount,
    totalInterest,
    totalCost: initialPrincipal + feeAmount + totalInterest,
    payoffMonths: month,
    history
  };
}

/**
 * Evaluates a Personal Consolidation Loan against selected debts.
 */
export function evaluateConsolidationLoan(
  selectedDebts: Array<{ balance: number | string }>,
  loanConfig: ConsolidationLoanConfig
): ConsolidationLoanResult {
  const { loanApr, originationFeePercent, loanTermMonths } = loanConfig;

  const initialPrincipal = selectedDebts.reduce((sum, d) => sum + (Number(d.balance) || 0), 0);
  const feeAmount = initialPrincipal * (originationFeePercent / 100);
  const totalLoanAmount = initialPrincipal + feeAmount;

  // Fixed monthly installment payment formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
  const monthlyRate = (loanApr / 100) / 12;
  const monthlyPayment = monthlyRate > 0
    ? (totalLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths))) /
      (Math.pow(1 + monthlyRate, loanTermMonths) - 1)
    : totalLoanAmount / loanTermMonths;

  let balance = totalLoanAmount;
  let totalInterest = 0;
  const history: { month: number; balance: number }[] = [];

  for (let month = 1; month <= loanTermMonths; month++) {
    const interest = balance * monthlyRate;
    totalInterest += interest;
    balance = Math.max(0, balance + interest - monthlyPayment);
    history.push({ month, balance });
  }

  return {
    initialPrincipal,
    feeAmount,
    totalLoanAmount,
    monthlyPayment,
    totalInterest,
    totalCost: totalLoanAmount + totalInterest,
    history
  };
}

