import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  Percent,
  Calendar,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Download,
} from 'lucide-react';

export type PayoffMode = 'fixed-payment' | 'target-months';

export interface MonthScheduleItem {
  month: number;
  startingBalance: number;
  interestPaid: number;
  principalPaid: number;
  totalPayment: number;
  endingBalance: number;
  cumulativeInterest: number;
}

export const CreditCardPayoffCalculator: React.FC = () => {
  // Mode Selection: Mode A (Fixed Payment) vs Mode B (Target Months)
  const [mode, setMode] = useState<PayoffMode>('fixed-payment');

  // Input States
  const [balance, setBalance] = useState<number>(5000);
  const [apr, setApr] = useState<number>(21.99);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(200);
  const [targetMonths, setTargetMonths] = useState<number>(24);

  // Result States
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeToPayOff, setTimeToPayOff] = useState<string>('2 years, 2 months');
  const [calculatedMonthlyPayment, setCalculatedMonthlyPayment] = useState<number>(259.95);
  const [totalMonths, setTotalMonths] = useState<number>(26);
  const [totalInterest, setTotalInterest] = useState<number>(1304.54);
  const [totalPaid, setTotalPaid] = useState<number>(6304.54);
  const [principalPercentage, setPrincipalPercentage] = useState<number>(79.3);
  const [interestPercentage, setInterestPercentage] = useState<number>(20.7);
  const [schedule, setSchedule] = useState<MonthScheduleItem[]>([]);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const calculatePayoff = () => {
    const balanceInput = parseFloat(balance.toString());
    const aprInput = parseFloat(apr.toString());

    setErrorMessage(null);

    if (isNaN(balanceInput) || isNaN(aprInput) || balanceInput <= 0 || aprInput <= 0) {
      setErrorMessage('Please enter valid positive numbers for all fields.');
      setHasCalculated(false);
      return;
    }

    const monthlyRate = (aprInput / 100) / 12;
    const firstMonthInterest = balanceInput * monthlyRate;

    let effectivePayment = 0;
    let months = 0;
    let accumulatedInterest = 0;
    let currentBalance = balanceInput;
    const scheduleItems: MonthScheduleItem[] = [];

    if (mode === 'fixed-payment') {
      const paymentInput = parseFloat(monthlyPayment.toString());
      if (isNaN(paymentInput) || paymentInput <= 0) {
        setErrorMessage('Please enter a valid positive monthly payment.');
        setHasCalculated(false);
        return;
      }

      if (paymentInput <= firstMonthInterest) {
        setErrorMessage(
          `Your monthly payment of $${paymentInput.toFixed(2)} is too low to cover the monthly interest charge ($${firstMonthInterest.toFixed(2)}). Increase your payment.`
        );
        setHasCalculated(false);
        return;
      }

      effectivePayment = paymentInput;

      while (currentBalance > 0.001) {
        const startBal = currentBalance;
        const interestForMonth = currentBalance * monthlyRate;
        const principalForMonth = effectivePayment - interestForMonth;

        let actualPrincipal = principalForMonth;
        let actualPayment = effectivePayment;

        if (currentBalance < principalForMonth) {
          actualPrincipal = currentBalance;
          actualPayment = currentBalance + interestForMonth;
          accumulatedInterest += interestForMonth;
          currentBalance = 0;
        } else {
          accumulatedInterest += interestForMonth;
          currentBalance -= principalForMonth;
        }

        months++;

        scheduleItems.push({
          month: months,
          startingBalance: startBal,
          interestPaid: interestForMonth,
          principalPaid: actualPrincipal,
          totalPayment: actualPayment,
          endingBalance: currentBalance,
          cumulativeInterest: accumulatedInterest,
        });

        if (months > 1200) break;
      }

      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      let timeText = '';
      if (years > 0) {
        timeText += `${years} year${years > 1 ? 's' : ''}`;
        if (remainingMonths > 0) timeText += `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
      } else {
        timeText = `${months} month${months > 1 ? 's' : ''}`;
      }

      setTimeToPayOff(timeText);
      setCalculatedMonthlyPayment(effectivePayment);
    } else {
      // Mode B: Target Months
      const monthsInput = parseInt(targetMonths.toString(), 10);
      if (isNaN(monthsInput) || monthsInput <= 0) {
        setErrorMessage('Please enter a valid target number of months.');
        setHasCalculated(false);
        return;
      }

      // Amortization Formula for required payment: P = (B * r * (1 + r)^n) / ((1 + r)^n - 1)
      const compoundFactor = Math.pow(1 + monthlyRate, monthsInput);
      const requiredPayment = (balanceInput * monthlyRate * compoundFactor) / (compoundFactor - 1);
      effectivePayment = requiredPayment;

      months = monthsInput;

      for (let m = 1; m <= monthsInput; m++) {
        const startBal = currentBalance;
        const interestForMonth = currentBalance * monthlyRate;
        const principalForMonth = effectivePayment - interestForMonth;

        let actualPrincipal = principalForMonth;
        let actualPayment = effectivePayment;

        if (m === monthsInput || currentBalance < principalForMonth) {
          actualPrincipal = currentBalance;
          actualPayment = currentBalance + interestForMonth;
          accumulatedInterest += interestForMonth;
          currentBalance = 0;
        } else {
          accumulatedInterest += interestForMonth;
          currentBalance -= principalForMonth;
        }

        scheduleItems.push({
          month: m,
          startingBalance: startBal,
          interestPaid: interestForMonth,
          principalPaid: actualPrincipal,
          totalPayment: actualPayment,
          endingBalance: currentBalance,
          cumulativeInterest: accumulatedInterest,
        });
      }

      const years = Math.floor(monthsInput / 12);
      const remainingMonths = monthsInput % 12;
      let timeText = '';
      if (years > 0) {
        timeText += `${years} year${years > 1 ? 's' : ''}`;
        if (remainingMonths > 0) timeText += `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
      } else {
        timeText = `${monthsInput} month${monthsInput > 1 ? 's' : ''}`;
      }

      setTimeToPayOff(timeText);
      setCalculatedMonthlyPayment(requiredPayment);
    }

    const calculatedTotalPaid = balanceInput + accumulatedInterest;
    const princPct = (balanceInput / calculatedTotalPaid) * 100;
    const intPct = (accumulatedInterest / calculatedTotalPaid) * 100;

    setTotalMonths(months);
    setTotalInterest(accumulatedInterest);
    setTotalPaid(calculatedTotalPaid);
    setPrincipalPercentage(parseFloat(princPct.toFixed(1)));
    setInterestPercentage(parseFloat(intPct.toFixed(1)));
    setSchedule(scheduleItems);
    setHasCalculated(true);
  };

  useEffect(() => {
    calculatePayoff();
  }, [mode]);

  const handleExportCSV = () => {
    if (schedule.length === 0) return;
    const headers = ['Month', 'Starting Balance', 'Interest Paid', 'Principal Paid', 'Total Payment', 'Ending Balance', 'Cumulative Interest'];
    const rows = schedule.map(item => [
      item.month,
      item.startingBalance.toFixed(2),
      item.interestPaid.toFixed(2),
      item.principalPaid.toFixed(2),
      item.totalPayment.toFixed(2),
      item.endingBalance.toFixed(2),
      item.cumulativeInterest.toFixed(2),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `credit_card_payoff_schedule.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 text-center mb-5 tracking-tight">
          Credit Card Payoff Calculator
        </h2>

        {/* Dual Input Modes Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6 text-xs sm:text-sm font-bold">
          <button
            type="button"
            onClick={() => setMode('fixed-payment')}
            className={`py-2.5 px-3 rounded-lg text-center transition-all cursor-pointer ${
              mode === 'fixed-payment'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fixed Monthly Payment
          </button>
          <button
            type="button"
            onClick={() => setMode('target-months')}
            className={`py-2.5 px-3 rounded-lg text-center transition-all cursor-pointer ${
              mode === 'target-months'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Target Payoff Time
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Inputs */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="balance" className="block text-xs sm:text-sm font-bold text-slate-700">
              Current Card Balance ($)
            </label>
            <input
              type="number"
              id="balance"
              value={balance || ''}
              onChange={e => setBalance(parseFloat(e.target.value) || 0)}
              placeholder="e.g. 5000"
              min="1"
              step="any"
              className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 rounded-lg text-sm font-semibold text-slate-900 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="apr" className="block text-xs sm:text-sm font-bold text-slate-700">
              Interest Rate (APR %)
            </label>
            <input
              type="number"
              id="apr"
              value={apr || ''}
              onChange={e => setApr(parseFloat(e.target.value) || 0)}
              placeholder="e.g. 21.99"
              min="0.1"
              step="0.01"
              className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 rounded-lg text-sm font-semibold text-slate-900 outline-none transition-all"
            />
          </div>

          {mode === 'fixed-payment' ? (
            <div className="space-y-1.5">
              <label htmlFor="monthlyPayment" className="block text-xs sm:text-sm font-bold text-slate-700">
                Fixed Monthly Payment ($)
              </label>
              <input
                type="number"
                id="monthlyPayment"
                value={monthlyPayment || ''}
                onChange={e => setMonthlyPayment(parseFloat(e.target.value) || 0)}
                placeholder="e.g. 200"
                min="1"
                step="any"
                className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 rounded-lg text-sm font-semibold text-slate-900 outline-none transition-all"
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <label htmlFor="targetMonths" className="block text-xs sm:text-sm font-bold text-slate-700">
                Target Payoff Timeline (Months)
              </label>
              <input
                type="number"
                id="targetMonths"
                value={targetMonths || ''}
                onChange={e => setTargetMonths(parseInt(e.target.value, 10) || 0)}
                placeholder="e.g. 24"
                min="1"
                step="1"
                className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15 rounded-lg text-sm font-semibold text-slate-900 outline-none transition-all"
              />
            </div>
          )}

          <button
            type="button"
            onClick={calculatePayoff}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm sm:text-base rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Calculate Payoff Schedule
          </button>
        </div>

        {/* Results Block */}
        {hasCalculated && (
          <div className="mt-6 pt-5 border-t border-slate-200 space-y-3">
            {mode === 'target-months' && (
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-slate-600">Required Monthly Payment:</span>
                <span className="font-bold text-blue-700 text-base font-mono">
                  ${calculatedMonthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-600">Time to Pay Off:</span>
              <span className="font-bold text-blue-700 text-base font-mono">{timeToPayOff}</span>
            </div>

            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-600">Total Interest Paid:</span>
              <span className="font-bold text-slate-800 font-mono">
                ${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-600">Total Amount Paid:</span>
              <span className="font-bold text-slate-800 font-mono">
                ${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Feature 3: Visual Breakdown Bar */}
            <div className="pt-3 space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span className="text-blue-700">Principal: {principalPercentage}%</span>
                <span className="text-amber-600">Interest: {interestPercentage}%</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                <div
                  style={{ width: `${principalPercentage}%` }}
                  className="bg-blue-600 transition-all duration-300"
                  title={`Principal: ${principalPercentage}%`}
                />
                <div
                  style={{ width: `${interestPercentage}%` }}
                  className="bg-amber-500 transition-all duration-300"
                  title={`Interest: ${interestPercentage}%`}
                />
              </div>
            </div>

            {/* Feature 1: Collapsible Amortization Table Trigger */}
            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowSchedule(!showSchedule)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
              >
                {showSchedule ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>{showSchedule ? 'Hide Amortization Schedule' : 'Show Amortization Schedule'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feature 1: Dynamic Collapsible Amortization Schedule Table */}
      {hasCalculated && showSchedule && schedule.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Month-by-Month Amortization Breakdown
          </h3>
          <div className="overflow-x-auto max-h-80 border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-500 sticky top-0">
                <tr>
                  <th className="px-3 py-2.5">Month #</th>
                  <th className="px-3 py-2.5">Starting Balance</th>
                  <th className="px-3 py-2.5 text-amber-600">Interest Paid</th>
                  <th className="px-3 py-2.5 text-blue-600">Principal Paid</th>
                  <th className="px-3 py-2.5 font-bold text-slate-900">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {schedule.map(row => (
                  <tr key={row.month} className="hover:bg-slate-50/80">
                    <td className="px-3 py-2 font-bold font-sans">Month {row.month}</td>
                    <td className="px-3 py-2">${row.startingBalance.toFixed(2)}</td>
                    <td className="px-3 py-2 text-amber-600">${row.interestPaid.toFixed(2)}</td>
                    <td className="px-3 py-2 text-blue-600">${row.principalPaid.toFixed(2)}</td>
                    <td className="px-3 py-2 font-bold text-slate-900">${row.endingBalance.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
