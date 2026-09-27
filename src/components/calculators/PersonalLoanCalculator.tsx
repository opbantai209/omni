import React, { useState, useMemo, useEffect } from 'react';
import {
  DollarSign,
  Layers,
  Sparkles,
  Printer,
  Calendar,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export interface LoanScheduleRow {
  month: number;
  startingBalance: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  cumulativeInterest: number;
}

export interface AnnualScheduleRow {
  year: number;
  startingBalance: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export const PersonalLoanCalculator: React.FC = () => {
  // Read initial query params for deep linking
  const searchParams = new URLSearchParams(window.location.search);
  const initialAmount = parseFloat(searchParams.get('amount') || '') || 15000;
  const initialRate = parseFloat(searchParams.get('rate') || '') || 11.5;
  const initialTerm = parseInt(searchParams.get('term') || '', 10) || 36;
  const initialExtra = parseFloat(searchParams.get('extra') || '') || 0;
  const initialLump = parseFloat(searchParams.get('lump') || '') || 0;
  const initialLumpMonth = parseInt(searchParams.get('lumpMonth') || '', 10) || 12;
  const initialFreq = (searchParams.get('freq') === 'biweekly' ? 'biweekly' : 'monthly') as 'monthly' | 'biweekly';

  const [loanAmount, setLoanAmount] = useState<number>(initialAmount);
  const [interestRate, setInterestRate] = useState<number>(initialRate);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(initialTerm);
  const [extraPayment, setExtraPayment] = useState<number>(initialExtra);
  const [lumpSumAmount, setLumpSumAmount] = useState<number>(initialLump);
  const [lumpSumMonth, setLumpSumMonth] = useState<number>(initialLumpMonth);
  const [paymentFrequency, setPaymentFrequency] = useState<'monthly' | 'biweekly'>(initialFreq);

  // Side-by-side comparison state (Loan B)
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [loanBAmount, setLoanBAmount] = useState<number>(20000);
  const [loanBRate, setLoanBRate] = useState<number>(9.5);
  const [loanBTerm, setLoanBTerm] = useState<number>(60);

  // Amortization Table Visibility & View Mode
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [scheduleViewMode, setScheduleViewMode] = useState<'monthly' | 'annual'>('monthly');

  // Copy shareable link state
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Update URL query parameters on input change (Deep Linking)
  useEffect(() => {
    const params = new URLSearchParams();
    if (loanAmount) params.set('amount', loanAmount.toString());
    if (interestRate) params.set('rate', interestRate.toString());
    if (loanTermMonths) params.set('term', loanTermMonths.toString());
    if (extraPayment) params.set('extra', extraPayment.toString());
    if (lumpSumAmount) params.set('lump', lumpSumAmount.toString());
    if (lumpSumMonth) params.set('lumpMonth', lumpSumMonth.toString());
    if (paymentFrequency) params.set('freq', paymentFrequency);

    const newRelativePathQuery = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
    window.history.replaceState(null, '', newRelativePathQuery);
  }, [loanAmount, interestRate, loanTermMonths, extraPayment, lumpSumAmount, lumpSumMonth, paymentFrequency]);

  // Real-time calculation math matching requested snippet logic with lump sum support
  const calculations = useMemo(() => {
    const P = parseFloat(loanAmount.toString()) || 0;
    const annualRate = parseFloat(interestRate.toString()) || 0;
    const n = parseInt(loanTermMonths.toString(), 10) || 1;
    const extra = parseFloat(extraPayment.toString()) || 0;
    const lumpSum = parseFloat(lumpSumAmount.toString()) || 0;
    const lumpMonth = parseInt(lumpSumMonth.toString(), 10) || 1;

    if (P <= 0 || annualRate <= 0 || n <= 0) {
      return {
        isValid: false,
        monthlyPayment: 0,
        periodicPayment: 0,
        totalCost: 0,
        totalInterest: 0,
        principalPercent: 100,
        interestPercent: 0,
        actualMonths: 0,
        interestSaved: 0,
        monthsSaved: 0,
        timeSavedStr: '0 months',
        biweeklyInterest: 0,
        monthlyInterestBaseline: 0,
        biweeklyMonthsSaved: 0,
        standardMonthlyPayment: 0,
        baselineTotalInterest: 0,
        schedule: [] as LoanScheduleRow[],
        annualSchedule: [] as AnnualScheduleRow[],
      };
    }

    const r = (annualRate / 100) / 12;
    const standardMonthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const baselineTotalInterest = (standardMonthlyPayment * n) - P;

    // Bi-weekly specific calculations for comparison metric
    const biweeklyRate = (annualRate / 100) / 26;
    const biweeklyPaymentBase = standardMonthlyPayment / 2;
    let bwBalance = P;
    let bwInterestTotal = 0;
    let bwPeriods = 0;
    for (let p = 1; p <= n * 3 && bwBalance > 0.01; p++) {
      bwPeriods = p;
      const interestForPeriod = bwBalance * biweeklyRate;
      let principalForPeriod = biweeklyPaymentBase - interestForPeriod;
      if (bwBalance < principalForPeriod) {
        principalForPeriod = bwBalance;
        bwInterestTotal += interestForPeriod;
        bwBalance = 0;
      } else {
        bwInterestTotal += interestForPeriod;
        bwBalance -= principalForPeriod;
      }
      if (bwBalance <= 0) break;
    }
    const biweeklyMonthsSaved = Math.max(0, n - Math.ceil(bwPeriods / 2.166));

    // Track accelerated payoff schedule with recurring extra + lump sum
    let remainingBalance = P;
    let acceleratedTotalInterest = 0;
    let actualMonths = 0;
    const schedule: LoanScheduleRow[] = [];

    const activeRate = paymentFrequency === 'monthly' ? r : biweeklyRate;
    const activeBasePayment = paymentFrequency === 'monthly' ? standardMonthlyPayment : biweeklyPaymentBase;

    while (remainingBalance > 0.01 && actualMonths < n * 2) {
      actualMonths++;
      const interestPayment = remainingBalance * activeRate;
      let principalPayment = (activeBasePayment - interestPayment) + extra;

      if (actualMonths === lumpMonth && lumpSum > 0) {
        principalPayment += lumpSum;
      }

      if (principalPayment > remainingBalance) {
        principalPayment = remainingBalance;
      }

      acceleratedTotalInterest += interestPayment;
      remainingBalance -= principalPayment;
      if (remainingBalance < 0) remainingBalance = 0;

      schedule.push({
        month: actualMonths,
        startingBalance: remainingBalance + principalPayment,
        payment: principalPayment + interestPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: remainingBalance,
        cumulativeInterest: acceleratedTotalInterest,
      });

      if (remainingBalance <= 0) break;
    }

    // Calculate savings metrics
    const interestSaved = Math.max(0, baselineTotalInterest - acceleratedTotalInterest);
    const monthsSaved = Math.max(0, n - actualMonths);

    const yearsSaved = Math.floor(monthsSaved / 12);
    const remMonthsSaved = monthsSaved % 12;
    
    let timeSavedStr = '';
    if (yearsSaved > 0) timeSavedStr += `${yearsSaved} yr${yearsSaved > 1 ? 's' : ''} `;
    if (remMonthsSaved > 0 || yearsSaved === 0) timeSavedStr += `${remMonthsSaved} mo${remMonthsSaved !== 1 ? 's' : ''}`;
    const timeSavedFormatted = `${timeSavedStr} (Payoff in ${actualMonths} mos)`;

    const totalCost = P + acceleratedTotalInterest;
    const principalPercent = (P / totalCost) * 100;
    const interestPercent = (acceleratedTotalInterest / totalCost) * 100;

    // Build Annual Amortization Schedule
    const annualSchedule: AnnualScheduleRow[] = [];
    let yearStartBal = P;
    let yearPrincipal = 0;
    let yearInterest = 0;
    let yearPayment = 0;
    let currentYear = 1;
    const periodsPerYear = paymentFrequency === 'monthly' ? 12 : 26;

    schedule.forEach((row) => {
      yearPrincipal += row.principal;
      yearInterest += row.interest;
      yearPayment += row.payment;

      if (row.month % periodsPerYear === 0 || row.month === actualMonths) {
        annualSchedule.push({
          year: currentYear,
          startingBalance: yearStartBal,
          payment: yearPayment,
          principal: yearPrincipal,
          interest: yearInterest,
          remainingBalance: row.remainingBalance,
        });
        currentYear++;
        yearStartBal = row.remainingBalance;
        yearPrincipal = 0;
        yearInterest = 0;
        yearPayment = 0;
      }
    });

    return {
      isValid: true,
      monthlyPayment: standardMonthlyPayment,
      periodicPayment: activeBasePayment,
      totalCost,
      totalInterest: acceleratedTotalInterest,
      principalPercent,
      interestPercent,
      actualMonths,
      interestSaved,
      monthsSaved,
      timeSavedStr: timeSavedFormatted,
      biweeklyInterest: bwInterestTotal,
      monthlyInterestBaseline: baselineTotalInterest,
      biweeklyMonthsSaved,
      standardMonthlyPayment,
      baselineTotalInterest,
      schedule,
      annualSchedule,
    };
  }, [loanAmount, interestRate, loanTermMonths, extraPayment, lumpSumAmount, lumpSumMonth, paymentFrequency]);

  // Loan B Calculations for Side-by-Side Comparison
  const loanBCalculations = useMemo(() => {
    const P = parseFloat(loanBAmount.toString()) || 0;
    const annualRate = parseFloat(loanBRate.toString()) || 0;
    const n = parseInt(loanBTerm.toString(), 10) || 1;

    if (P <= 0 || annualRate <= 0 || n <= 0) return null;

    const r = (annualRate / 100) / 12;
    const compoundFactor = Math.pow(1 + r, n);
    const monthlyPayment = P * (r * compoundFactor) / (compoundFactor - 1);
    const totalCost = monthlyPayment * n;
    const totalInterest = totalCost - P;

    return {
      monthlyPayment,
      totalCost,
      totalInterest,
      loanAmount: P,
      termMonths: n,
    };
  }, [loanBAmount, loanBRate, loanBTerm]);

  // Export to CSV handler
  const exportAmortizationCSV = () => {
    if (calculations.schedule.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Period,Payment,Principal,Interest,Remaining Balance\r\n";

    calculations.schedule.forEach(row => {
      let rowData = `${row.month},"${row.payment.toFixed(2)}","${row.principal.toFixed(2)}","${row.interest.toFixed(2)}","${row.remainingBalance.toFixed(2)}"`;
      csvContent += rowData + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `personal_loan_schedule_${paymentFrequency}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleAmortizationTable = () => {
    setShowSchedule(!showSchedule);
  };

  const copyShareableLink = () => {
    const params = new URLSearchParams({
      amount: loanAmount.toString(),
      rate: interestRate.toString(),
      term: loanTermMonths.toString(),
      extra: extraPayment ? extraPayment.toString() : '0',
      lump: lumpSumAmount ? lumpSumAmount.toString() : '0',
      lumpMonth: lumpSumMonth ? lumpSumMonth.toString() : '12'
    });

    const shareableURL = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    navigator.clipboard.writeText(shareableURL).then(() => {
      setCopiedLink(true);
      setTimeout(() => { setCopiedLink(false); }, 2500);
    }).catch(err => {
      console.error('Failed to copy share link: ', err);
    });
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Main Calculator Card */}
      <div className="calculator-card bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 sm:p-8 max-w-xl mx-auto">
        <div className="calc-header text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-3">
            <DollarSign className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Personal Loan Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Estimate payments, accelerate payoff, and compare financing options
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="form-group space-y-1.5">
            <label htmlFor="loanAmount" className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-700">
              <span>Loan Amount</span>
              <span className="label-hint text-slate-400 font-normal text-xs">$1,000 – $100,000</span>
            </label>
            <div className="input-wrapper relative">
              <span className="currency-symbol absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
              <input
                type="number"
                id="loanAmount"
                value={loanAmount || ''}
                onChange={e => setLoanAmount(parseFloat(e.target.value) || 0)}
                min="1000"
                max="100000"
                step="500"
                placeholder="15000"
                className="w-full pl-8 pr-4 py-3 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 rounded-xl text-sm sm:text-base font-semibold text-slate-900 transition-all outline-none"
              />
            </div>
          </div>

          <div className="form-group space-y-1.5">
            <label htmlFor="interestRate" className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-700">
              <span>Interest Rate (APR %)</span>
              <span className="label-hint text-slate-400 font-normal text-xs">Fixed Rate</span>
            </label>
            <div className="input-wrapper relative">
              <input
                type="number"
                id="interestRate"
                value={interestRate || ''}
                onChange={e => setInterestRate(parseFloat(e.target.value) || 0)}
                min="1"
                max="36"
                step="0.1"
                placeholder="11.5"
                className="w-full pl-4 pr-9 py-3 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 rounded-xl text-sm sm:text-base font-semibold text-slate-900 transition-all outline-none"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
            </div>
          </div>

          <div className="form-group space-y-1.5">
            <label htmlFor="loanTerm" className="block text-xs sm:text-sm font-bold text-slate-700">
              Loan Term
            </label>
            <select
              id="loanTerm"
              value={loanTermMonths}
              onChange={e => setLoanTermMonths(parseInt(e.target.value, 10))}
              className="w-full px-4 py-3 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 rounded-xl text-sm sm:text-base font-semibold text-slate-900 transition-all outline-none cursor-pointer"
            >
              <option value={12}>1 Year (12 months)</option>
              <option value={24}>2 Years (24 months)</option>
              <option value={36}>3 Years (36 months)</option>
              <option value={48}>4 Years (48 months)</option>
              <option value={60}>5 Years (60 months)</option>
              <option value={72}>6 Years (72 months)</option>
              <option value={84}>7 Years (84 months)</option>
            </select>
          </div>

          {/* Feature 4: Payment Frequency Switcher (Monthly vs Bi-Weekly) */}
          <div className="form-group space-y-1.5 pt-1">
            <label className="block text-xs sm:text-sm font-bold text-slate-700">
              Payment Frequency
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPaymentFrequency('monthly')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${paymentFrequency === 'monthly' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Monthly (12/yr)
              </button>
              <button
                type="button"
                onClick={() => setPaymentFrequency('biweekly')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${paymentFrequency === 'biweekly' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Bi-Weekly (26/yr)
              </button>
            </div>
            {paymentFrequency === 'biweekly' && (
              <p className="text-[11px] text-emerald-700 font-medium">
                Bi-weekly results in 26 half-payments per year (equivalent to 13 full payments), reducing principal faster.
              </p>
            )}
          </div>

          {/* Feature 1: Extra Payment Engine */}
          <div className="form-group space-y-1.5 pt-2 border-t border-slate-100">
            <label htmlFor="extraPayment" className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <Sparkles className="w-4 h-4" /> Extra Monthly Payment ($)
              </span>
              <span className="label-hint text-slate-400 font-normal text-xs">Accelerates Payoff</span>
            </label>
            <div className="input-wrapper relative">
              <span className="currency-symbol absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
              <input
                type="number"
                id="extraPayment"
                value={extraPayment || 0}
                onChange={e => setExtraPayment(parseFloat(e.target.value) || 0)}
                min="0"
                step="50"
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 bg-emerald-50/30 hover:bg-white focus:bg-white border border-emerald-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 rounded-xl text-sm sm:text-base font-semibold text-slate-900 transition-all outline-none"
              />
            </div>
          </div>

          {/* Additional One-Time Lump Sum Inputs */}
          <div className="extra-payments-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <div className="input-group space-y-1.5">
              <label htmlFor="lumpSumAmount" className="text-xs sm:text-sm font-bold text-slate-700 block">
                One-Time Lump Sum ($)
              </label>
              <input
                type="number"
                id="lumpSumAmount"
                placeholder="0"
                value={lumpSumAmount || 0}
                onChange={e => setLumpSumAmount(parseFloat(e.target.value) || 0)}
                min="0"
                className="w-full px-4 py-3 bg-emerald-50/30 hover:bg-white focus:bg-white border border-emerald-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 rounded-xl text-sm sm:text-base font-semibold text-slate-900 transition-all outline-none"
              />
            </div>

            <div className="input-group space-y-1.5">
              <label htmlFor="lumpSumMonth" className="text-xs sm:text-sm font-bold text-slate-700 block">
                Apply at Month #
              </label>
              <input
                type="number"
                id="lumpSumMonth"
                placeholder="12"
                value={lumpSumMonth || 12}
                onChange={e => setLumpSumMonth(parseInt(e.target.value, 10) || 1)}
                min="1"
                max="84"
                className="w-full px-4 py-3 bg-emerald-50/30 hover:bg-white focus:bg-white border border-emerald-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 rounded-xl text-sm sm:text-base font-semibold text-slate-900 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        {calculations.isValid && (
          <div id="results" className="results-card mt-6 pt-6 border-t border-slate-200/80 space-y-4" style={{ display: 'block' }}>
            <div className="main-stat text-center bg-blue-50/80 border border-blue-100 p-4 sm:p-5 rounded-2xl">
              <div className="main-stat-label text-xs font-bold text-slate-500 uppercase tracking-wider">
                {paymentFrequency === 'monthly' ? 'Estimated Monthly Payment' : 'Estimated Bi-Weekly Payment'}
              </div>
              <div id="monthlyPaymentOutput" className="main-stat-value text-2xl sm:text-4xl font-black text-blue-600 mt-1 font-mono">
                ${(calculations.periodicPayment + extraPayment).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              {extraPayment > 0 && (
                <div className="text-xs font-bold text-emerald-700 mt-1">
                  Base Payment: ${calculations.periodicPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ${extraPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Extra
                </div>
              )}
            </div>

            {/* Savings Callout Card */}
            <div
              id="savingsCard"
              className="savings-card"
              style={{
                display: (extraPayment > 0 || lumpSumAmount > 0) && calculations.interestSaved > 0 ? 'block' : 'none',
                marginTop: '16px',
                padding: '16px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px'
              }}
            >
              <h4 style={{ margin: '0 0 12px 0', color: '#166534', fontSize: '0.95rem', fontWeight: 600 }}>
                Payoff Acceleration Impact
              </h4>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#15803d', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                    Total Interest Saved
                  </span>
                  <div id="interestSavedOutput" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#166534' }}>
                    ${calculations.interestSaved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#15803d', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                    Time Saved
                  </span>
                  <div id="timeSavedOutput" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#166534' }}>
                    {calculations.timeSavedStr}
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Comparison Summary Table */}
            <div
              id="comparisonContainer"
              className="comparison-container"
              style={{
                display: (extraPayment > 0 || lumpSumAmount > 0) ? 'block' : 'none',
                marginTop: '20px',
                padding: '16px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px'
              }}
            >
              <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#0f172a', fontWeight: 700 }}>
                Plan Comparison Summary
              </h4>
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Standard Loan</th>
                    <th className="highlight-header">Accelerated Plan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Monthly Payment</td>
                    <td id="compStandardPayment">${(calculations.standardMonthlyPayment).toFixed(2)}</td>
                    <td id="compAccelPayment" className="highlight-cell">${(calculations.periodicPayment + extraPayment).toFixed(2)} / mo</td>
                  </tr>
                  <tr>
                    <td>Payoff Duration</td>
                    <td id="compStandardTime">{loanTermMonths} months</td>
                    <td id="compAccelTime" className="highlight-cell">{calculations.actualMonths} months</td>
                  </tr>
                  <tr>
                    <td>Total Interest Paid</td>
                    <td id="compStandardInterest">${(calculations.baselineTotalInterest).toFixed(2)}</td>
                    <td id="compAccelInterest" className="highlight-cell">${(calculations.totalInterest).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Total Loan Cost</td>
                    <td id="compStandardCost">${(loanAmount + calculations.baselineTotalInterest).toFixed(2)}</td>
                    <td id="compAccelCost" className="highlight-cell">${(calculations.totalCost).toFixed(2)}</td>
                  </tr>
                  <tr className="savings-row">
                    <td><strong>Total Net Savings</strong></td>
                    <td>—</td>
                    <td id="compNetSavings" className="highlight-savings">${(calculations.interestSaved).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bi-Weekly vs Monthly Interest Comparison Box */}
            {paymentFrequency === 'biweekly' && (
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-blue-800">
                  <Calendar className="w-4 h-4 text-blue-600" /> Bi-Weekly Advantage Summary:
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                  <div>
                    <span className="text-slate-500 font-sans block">Standard Monthly Interest:</span>
                    <strong className="text-slate-800">${calculations.monthlyInterestBaseline.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-sans block">Bi-Weekly Interest:</span>
                    <strong className="text-purple-700">${calculations.biweeklyInterest.toFixed(2)}</strong>
                  </div>
                </div>
                <div className="pt-1 text-emerald-800 font-bold">
                  Bi-weekly schedule saves approx. ${(calculations.monthlyInterestBaseline - calculations.biweeklyInterest).toFixed(2)} in interest and pays off ~{calculations.biweeklyMonthsSaved} months faster!
                </div>
              </div>
            )}

            <div className="breakdown-bar-wrapper space-y-2 pt-1">
              <div className="breakdown-bar h-3 w-full rounded-full flex overflow-hidden bg-slate-100">
                <div id="barPrincipal" className="bar-principal bg-blue-600 h-full transition-all duration-500" style={{ width: `${calculations.principalPercent}%` }} />
                <div id="barInterest" className="bar-interest bg-purple-500 h-full transition-all duration-500" style={{ width: `${calculations.interestPercent}%` }} />
              </div>
              <div className="legend flex justify-between items-center text-xs font-bold text-slate-600 px-0.5">
                <span className="legend-item flex items-center gap-1.5">
                  <span className="dot dot-principal w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Principal (<span id="principalPct">{Math.round(calculations.principalPercent)}%</span>)
                </span>
                <span className="legend-item flex items-center gap-1.5">
                  <span className="dot dot-interest w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Interest (<span id="interestPct">{Math.round(calculations.interestPercent)}%</span>)
                </span>
              </div>
            </div>

            <div className="result-row flex justify-between items-center text-xs sm:text-sm">
              <span className="result-label text-slate-500 font-medium">Total Principal:</span>
              <span id="principalOutput" className="result-value font-bold text-slate-800 font-mono">
                ${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="result-row flex justify-between items-center text-xs sm:text-sm">
              <span className="result-label text-slate-500 font-medium">Total Interest Paid:</span>
              <span id="interestOutput" className="result-value font-bold text-purple-700 font-mono">
                ${calculations.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="result-row flex justify-between items-center text-xs sm:text-sm pt-2 border-t border-slate-100">
              <span className="result-label text-slate-700 font-bold">Total Loan Cost:</span>
              <span id="totalOutput" className="result-value font-extrabold text-slate-900 font-mono text-sm sm:text-base">
                ${calculations.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Action Buttons: Share & PDF Print */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 items-center">
              <div className="share-container" style={{ marginTop: '0', textAlign: 'left' }}>
                <button id="shareBtn" className="btn btn-outline py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer w-full" onClick={copyShareableLink}>
                  🔗 Copy Shareable Link
                </button>
                <span id="shareFeedback" style={{ display: copiedLink ? 'inline-block' : 'none', marginLeft: '0', marginTop: '4px', color: 'var(--accent-green, #15803d)', fontSize: '0.85rem', fontWeight: 600 }}>
                  Copied to clipboard!
                </span>
              </div>
              <button
                onClick={handlePrintPDF}
                className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print / Export PDF Report
              </button>
            </div>

            {/* Export Container */}
            <div className="export-container" style={{ marginTop: '20px' }}>
              <button
                id="exportBtn"
                onClick={exportAmortizationCSV}
                style={{ backgroundColor: '#10b981', display: 'block', width: '100%', padding: '14px', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', textAlign: 'center' }}
                className="hover:opacity-90 transition-opacity"
              >
                Download Amortization Schedule (CSV)
              </button>
            </div>

            {/* Table toggle & view selector wrapper */}
            <div className="table-controls-wrapper" style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                id="toggleTableBtn"
                onClick={toggleAmortizationTable}
                style={{ backgroundColor: 'transparent', color: '#2563eb', border: '1px solid #2563eb', padding: '10px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                className="hover:bg-blue-50 transition-colors"
              >
                {showSchedule ? 'Hide Schedule' : 'Show Schedule'}
              </button>

              {/* View Mode Switcher */}
              <div
                id="viewToggleGroup"
                className="btn-group"
                style={{ display: showSchedule ? 'flex' : 'none', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}
              >
                <button
                  id="viewMonthlyBtn"
                  className={`toggle-btn px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${scheduleViewMode === 'monthly' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  onClick={() => setScheduleViewMode('monthly')}
                >
                  {paymentFrequency === 'monthly' ? 'Monthly' : 'Periodic'}
                </button>
                <button
                  id="viewAnnualBtn"
                  className={`toggle-btn px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${scheduleViewMode === 'annual' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  onClick={() => setScheduleViewMode('annual')}
                >
                  Annual
                </button>
              </div>
            </div>

            {/* Amortization Table Container */}
            <div id="tableContainer" className="table-container" style={{ display: showSchedule ? 'block' : 'none', marginTop: '20px' }}>
              <div className="table-scroll overflow-x-auto rounded-xl border border-slate-200 max-h-96">
                <table className="amortization-table w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500 sticky top-0">
                    <tr id="tableHeaderRow">
                      <th className="px-3 py-2.5">{scheduleViewMode === 'monthly' ? (paymentFrequency === 'monthly' ? 'Month' : 'Period') : 'Year'}</th>
                      <th className="px-3 py-2.5">Payment</th>
                      <th className="px-3 py-2.5 text-blue-600">Principal</th>
                      <th className="px-3 py-2.5 text-purple-700">Interest</th>
                      <th className="px-3 py-2.5 font-bold text-slate-900">Balance</th>
                    </tr>
                  </thead>
                  <tbody id="amortizationTbody" className="divide-y divide-slate-100 font-mono">
                    {scheduleViewMode === 'monthly' ? (
                      calculations.schedule.map(row => (
                        <tr key={row.month} className="hover:bg-slate-50/80">
                          <td className="px-3 py-2 font-bold font-sans">{paymentFrequency === 'monthly' ? `Month ${row.month}` : `Period ${row.month}`}</td>
                          <td className="px-3 py-2">${row.payment.toFixed(2)}</td>
                          <td className="px-3 py-2 text-blue-600">${row.principal.toFixed(2)}</td>
                          <td className="px-3 py-2 text-purple-700">${row.interest.toFixed(2)}</td>
                          <td className="px-3 py-2 font-bold text-slate-900">${row.remainingBalance.toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      calculations.annualSchedule.map(row => (
                        <tr key={row.year} className="hover:bg-slate-50/80">
                          <td className="px-3 py-2 font-bold font-sans">Year {row.year}</td>
                          <td className="px-3 py-2">${row.payment.toFixed(2)}</td>
                          <td className="px-3 py-2 text-blue-600">${row.principal.toFixed(2)}</td>
                          <td className="px-3 py-2 text-purple-700">${row.interest.toFixed(2)}</td>
                          <td className="px-3 py-2 font-bold text-slate-900">${row.remainingBalance.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chart Canvas Container inside .calculator-card */}
            <div className="chart-wrapper" style={{ position: 'relative', height: '320px', marginTop: '24px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
              <Line
                id="amortizationChart"
                data={{
                  labels: ['Start', ...calculations.schedule.map(r => paymentFrequency === 'monthly' ? `Month ${r.month}` : `Period ${r.month}`)],
                  datasets: [
                    {
                      label: 'Remaining Principal Balance',
                      data: [loanAmount, ...calculations.schedule.map(r => r.remainingBalance)],
                      borderColor: '#2563eb',
                      backgroundColor: 'rgba(37, 99, 235, 0.15)',
                      fill: true,
                      tension: 0.2,
                      pointRadius: 0,
                      pointHoverRadius: 6,
                    },
                    {
                      label: 'Cumulative Interest Paid',
                      data: [0, ...calculations.schedule.map(r => r.cumulativeInterest)],
                      borderColor: '#ef4444',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      fill: true,
                      tension: 0.2,
                      pointRadius: 0,
                      pointHoverRadius: 6,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    mode: 'index',
                    intersect: false,
                  },
                  plugins: {
                    title: {
                      display: true,
                      text: 'Loan Payoff & Interest Accumulation Over Time',
                      font: { size: 14, weight: 'bold' as const },
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context: any) {
                          const val = context.parsed.y !== null ? context.parsed.y : 0;
                          return `${context.dataset.label}: $${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: {
                        maxTicksLimit: 12,
                      },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value: any) {
                          return '$' + Number(value).toLocaleString();
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Feature 2: Side-by-Side Loan Scenario Comparison Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" /> Scenario Comparison
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Compare Loan A vs. Loan B
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Evaluate differences in monthly payments and total interest charges side-by-side.
            </p>
          </div>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-2"
          >
            {showComparison ? 'Hide Comparison' : 'Compare Second Loan'}
          </button>
        </div>

        {showComparison && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Loan A Summary */}
              <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-blue-900 text-sm">Loan A (Current Calculator)</span>
                  <span className="text-xs font-bold px-2.5 py-1 bg-blue-600 text-white rounded-lg">Active</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                    <span className="text-slate-400 block">Amount</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">${loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                    <span className="text-slate-400 block">APR</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">{interestRate}%</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                    <span className="text-slate-400 block">Term</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">{loanTermMonths} mos</span>
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t border-blue-100 text-xs sm:text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-sans">Periodic Payment:</span>
                    <span className="font-bold text-blue-700">${calculations.periodicPayment.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-sans">Total Interest:</span>
                    <span className="font-bold text-purple-700">${calculations.totalInterest.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-sans">Total Cost:</span>
                    <span className="font-bold text-slate-900">${calculations.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Loan B Inputs & Summary */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-900 text-sm">Loan B (Alternative Scenario)</span>
                  <span className="text-xs font-bold px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg">Scenario B</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Amount ($)</label>
                    <input
                      type="number"
                      value={loanBAmount}
                      onChange={e => setLoanBAmount(parseFloat(e.target.value) || 0)}
                      className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">APR (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={loanBRate}
                      onChange={e => setLoanBRate(parseFloat(e.target.value) || 0)}
                      className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Term (Mos)</label>
                    <select
                      value={loanBTerm}
                      onChange={e => setLoanBTerm(parseInt(e.target.value, 10))}
                      className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold font-mono"
                    >
                      <option value={12}>12m</option>
                      <option value={24}>24m</option>
                      <option value={36}>36m</option>
                      <option value={48}>48m</option>
                      <option value={60}>60m</option>
                      <option value={72}>72m</option>
                      <option value={84}>84m</option>
                    </select>
                  </div>
                </div>

                {loanBCalculations && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 text-xs sm:text-sm font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-sans">Monthly Payment:</span>
                      <span className="font-bold text-slate-800">${loanBCalculations.monthlyPayment.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-sans">Total Interest:</span>
                      <span className="font-bold text-slate-800">${loanBCalculations.totalInterest.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-sans">Total Cost:</span>
                      <span className="font-bold text-slate-900">${loanBCalculations.totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Variance Analysis */}
            {loanBCalculations && (
              <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm font-medium">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Monthly Payment Difference (B vs A)</span>
                  <span className={`text-base font-bold font-mono ${loanBCalculations.monthlyPayment > calculations.monthlyPayment ? 'text-red-400' : 'text-emerald-400'}`}>
                    {loanBCalculations.monthlyPayment > calculations.monthlyPayment ? '+' : ''}
                    ${(loanBCalculations.monthlyPayment - calculations.monthlyPayment).toFixed(2)} / mo
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Interest Difference</span>
                  <span className={`text-base font-bold font-mono ${loanBCalculations.totalInterest > calculations.totalInterest ? 'text-red-400' : 'text-emerald-400'}`}>
                    {loanBCalculations.totalInterest > calculations.totalInterest ? '+' : ''}
                    ${(loanBCalculations.totalInterest - calculations.totalInterest).toFixed(2)}
                  </span>
                </div>
                <div className="text-right sm:text-left">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Recommendation</span>
                  <span className="text-blue-300 font-bold">
                    {loanBCalculations.totalInterest < calculations.totalInterest ? 'Scenario B saves more interest' : 'Loan A saves more interest'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
