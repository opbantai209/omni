import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  TrendingDown,
  Sparkles,
  Download,
  Printer,
  RotateCcw,
  DollarSign,
  Percent,
  Calendar,
  Layers,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Search,
} from 'lucide-react';

export type RepaymentStrategy = 'avalanche' | 'snowball' | 'custom';

export interface DebtItem {
  id: string;
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
  customOrder?: number;
}

export interface MonthDebtScheduleEntry {
  month: number;
  dateStr: string;
  debts: {
    id: string;
    name: string;
    startingBalance: number;
    interestAccrued: number;
    paymentApplied: number;
    endingBalance: number;
    isPaidOffThisMonth: boolean;
  }[];
  totalStartingBalance: number;
  totalInterestAccrued: number;
  totalPaymentApplied: number;
  totalEndingBalance: number;
  activeDebtsCount: number;
}

export interface StrategySimulationResult {
  strategy: RepaymentStrategy;
  name: string;
  totalMonths: number;
  debtFreeDate: string;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
  totalAmountPaid: number;
  isFeasible: boolean;
  warningMessage?: string;
  schedule: MonthDebtScheduleEntry[];
  debtPayoffDates: { [debtId: string]: { month: number; dateStr: string } };
}

const DEFAULT_DEBTS: DebtItem[] = [
  { id: 'debt_1', name: 'Credit Card A (High APR)', balance: 4500, apr: 24.99, minPayment: 130 },
  { id: 'debt_2', name: 'Credit Card B', balance: 2800, apr: 19.5, minPayment: 85 },
  { id: 'debt_3', name: 'Auto Loan', balance: 11000, apr: 6.75, minPayment: 260 },
  { id: 'debt_4', name: 'Personal Medical Loan', balance: 1200, apr: 12.0, minPayment: 60 },
];

export const DebtPayoffCalculator: React.FC = () => {
  const [debts, setDebts] = useState<DebtItem[]>(DEFAULT_DEBTS);
  const [extraPayment, setExtraPayment] = useState<number>(250);
  const [selectedStrategy, setSelectedStrategy] = useState<RepaymentStrategy>('avalanche');

  // Amortization Table UI State
  const [scheduleSearch, setScheduleSearch] = useState<string>('');
  const [schedulePage, setSchedulePage] = useState<number>(1);
  const itemsPerPage = 12;

  // Chart Tooltip Hover State
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Date Formatting Helper
  const getMonthDateStr = (monthOffset: number): string => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthOffset);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Debt CRUD
  const handleAddDebt = () => {
    if (debts.length >= 10) return;
    const newId = `debt_${Date.now()}`;
    const newDebt: DebtItem = {
      id: newId,
      name: `Debt Line #${debts.length + 1}`,
      balance: 3000,
      apr: 18.0,
      minPayment: 90,
      customOrder: debts.length + 1,
    };
    setDebts([...debts, newDebt]);
  };

  const handleRemoveDebt = (id: string) => {
    if (debts.length <= 1) return;
    setDebts(debts.filter(d => d.id !== id));
  };

  const handleUpdateDebt = (id: string, field: keyof DebtItem, value: any) => {
    setDebts(
      debts.map(d => {
        if (d.id !== id) return d;
        return { ...d, [field]: value };
      })
    );
  };

  const handleReset = () => {
    setDebts(DEFAULT_DEBTS);
    setExtraPayment(250);
    setSelectedStrategy('avalanche');
  };

  // Sum of total minimum payments
  const totalMinPayment = useMemo(() => {
    return debts.reduce((sum, d) => sum + (Number(d.minPayment) || 0), 0);
  }, [debts]);

  const totalStartingBalance = useMemo(() => {
    return debts.reduce((sum, d) => sum + (Number(d.balance) || 0), 0);
  }, [debts]);

  const totalMonthlyBudget = totalMinPayment + extraPayment;

  // --- MULTI-DEBT ALGORITHMIC SIMULATION ENGINE ---
  const runSimulation = (strat: RepaymentStrategy): StrategySimulationResult => {
    if (debts.length === 0 || totalStartingBalance <= 0) {
      return {
        strategy: strat,
        name: strat === 'avalanche' ? 'Debt Avalanche' : strat === 'snowball' ? 'Debt Snowball' : 'Custom Priority',
        totalMonths: 0,
        debtFreeDate: getMonthDateStr(0),
        totalInterestPaid: 0,
        totalPrincipalPaid: 0,
        totalAmountPaid: 0,
        isFeasible: true,
        schedule: [],
        debtPayoffDates: {},
      };
    }

    // Clone working state
    let workingDebts = debts.map(d => ({
      id: d.id,
      name: d.name,
      balance: Math.max(0, Number(d.balance) || 0),
      apr: Math.max(0, Number(d.apr) || 0),
      minPayment: Math.max(0, Number(d.minPayment) || 0),
      customOrder: d.customOrder || 0,
    }));

    const schedule: MonthDebtScheduleEntry[] = [];
    const debtPayoffDates: { [debtId: string]: { month: number; dateStr: string } } = {};
    let cumInterestTotal = 0;
    let cumPaidTotal = 0;
    let month = 0;
    const maxMonths = 600; // 50-year safety ceiling

    // Sort order based on strategy
    const getTargetDebt = (currentDebts: typeof workingDebts) => {
      const active = currentDebts.filter(d => d.balance > 0.001);
      if (active.length === 0) return null;

      if (strat === 'avalanche') {
        // Highest APR first; tie breaker: lowest balance
        return [...active].sort((a, b) => b.apr - a.apr || a.balance - b.balance)[0];
      } else if (strat === 'snowball') {
        // Lowest balance first; tie breaker: highest APR
        return [...active].sort((a, b) => a.balance - b.balance || b.apr - a.apr)[0];
      } else {
        // Custom order
        return [...active].sort((a, b) => (a.customOrder || 0) - (b.customOrder || 0))[0];
      }
    };

    while (workingDebts.some(d => d.balance > 0.001) && month < maxMonths) {
      month++;
      const dateStr = getMonthDateStr(month);

      let monthTotalInterest = 0;
      let monthTotalPayment = 0;
      let monthStartTotalBal = 0;
      let monthEndTotalBal = 0;

      // 1. Accrue monthly interest on each active debt
      const debtRecords = workingDebts.map(d => {
        const startBal = d.balance;
        monthStartTotalBal += startBal;

        if (startBal <= 0.001) {
          return {
            id: d.id,
            name: d.name,
            startingBalance: 0,
            interestAccrued: 0,
            paymentApplied: 0,
            endingBalance: 0,
            isPaidOffThisMonth: false,
          };
        }

        // Daily Periodic Rate (DPR) calculation
        const dpr = d.apr / 100 / 365;
        const interestAccrued = startBal * dpr * 30.4375;
        d.balance += interestAccrued;
        cumInterestTotal += interestAccrued;
        monthTotalInterest += interestAccrued;

        return {
          id: d.id,
          name: d.name,
          startingBalance: startBal,
          interestAccrued,
          paymentApplied: 0,
          endingBalance: d.balance,
          isPaidOffThisMonth: false,
        };
      });

      // 2. Pay minimums across all active debts
      let availableExtraPool = extraPayment;

      workingDebts.forEach(d => {
        if (d.balance <= 0.001) return;
        const record = debtRecords.find(r => r.id === d.id)!;

        let payAmount = Math.min(d.minPayment, d.balance);
        d.balance -= payAmount;
        record.paymentApplied += payAmount;
        cumPaidTotal += payAmount;
        monthTotalPayment += payAmount;

        // If min payment exceeded balance, freed leftover returns to extra pool
        if (d.minPayment > payAmount) {
          availableExtraPool += (d.minPayment - payAmount);
        }

        if (d.balance <= 0.001) {
          d.balance = 0;
          record.isPaidOffThisMonth = true;
          if (!debtPayoffDates[d.id]) {
            debtPayoffDates[d.id] = { month, dateStr };
          }
        }
      });

      // 3. Apply available extra payment pool (extra + freed-up minimums from cleared debts)
      // to target debt in priority order (with cascade rollover spillover)
      while (availableExtraPool > 0.01 && workingDebts.some(d => d.balance > 0.001)) {
        const target = getTargetDebt(workingDebts);
        if (!target) break;

        const record = debtRecords.find(r => r.id === target.id)!;
        const paymentToApply = Math.min(availableExtraPool, target.balance);

        target.balance -= paymentToApply;
        record.paymentApplied += paymentToApply;
        availableExtraPool -= paymentToApply;
        cumPaidTotal += paymentToApply;
        monthTotalPayment += paymentToApply;

        if (target.balance <= 0.001) {
          target.balance = 0;
          record.isPaidOffThisMonth = true;
          if (!debtPayoffDates[target.id]) {
            debtPayoffDates[target.id] = { month, dateStr };
          }
        }
      }

      // Update final ending balances for record
      workingDebts.forEach(d => {
        const record = debtRecords.find(r => r.id === d.id)!;
        record.endingBalance = d.balance;
        monthEndTotalBal += d.balance;
      });

      const activeCount = workingDebts.filter(d => d.balance > 0.001).length;

      schedule.push({
        month,
        dateStr,
        debts: debtRecords,
        totalStartingBalance: monthStartTotalBal,
        totalInterestAccrued: monthTotalInterest,
        totalPaymentApplied: monthTotalPayment,
        totalEndingBalance: monthEndTotalBal,
        activeDebtsCount: activeCount,
      });

      if (workingDebts.every(d => d.balance <= 0.001)) break;
    }

    const isFeasible = month < maxMonths;

    return {
      strategy: strat,
      name: strat === 'avalanche' ? 'Debt Avalanche (Highest APR First)' : strat === 'snowball' ? 'Debt Snowball (Lowest Balance First)' : 'Custom Order',
      totalMonths: month,
      debtFreeDate: getMonthDateStr(month),
      totalInterestPaid: cumInterestTotal,
      totalPrincipalPaid: totalStartingBalance,
      totalAmountPaid: cumPaidTotal,
      isFeasible,
      schedule,
      debtPayoffDates,
    };
  };

  // Execute simulations for Avalanche, Snowball, and Custom
  const avalancheResult = useMemo(() => runSimulation('avalanche'), [debts, extraPayment, totalStartingBalance]);
  const snowballResult = useMemo(() => runSimulation('snowball'), [debts, extraPayment, totalStartingBalance]);
  const customResult = useMemo(() => runSimulation('custom'), [debts, extraPayment, totalStartingBalance]);

  const activeResult = useMemo(() => {
    if (selectedStrategy === 'avalanche') return avalancheResult;
    if (selectedStrategy === 'snowball') return snowballResult;
    return customResult;
  }, [selectedStrategy, avalancheResult, snowballResult, customResult]);

  // Head-to-Head Strategy Comparison Metrics
  const comparisonMetrics = useMemo(() => {
    const interestSavedWithAvalanche = Math.max(0, snowballResult.totalInterestPaid - avalancheResult.totalInterestPaid);
    const monthsDiff = snowballResult.totalMonths - avalancheResult.totalMonths;

    return {
      interestSavedWithAvalanche,
      monthsDiff,
    };
  }, [avalancheResult, snowballResult]);

  // Filtered and Paginated Amortization Ledger
  const filteredSchedule = useMemo(() => {
    if (!activeResult.schedule) return [];
    if (!scheduleSearch.trim()) return activeResult.schedule;
    const q = scheduleSearch.toLowerCase().trim();
    return activeResult.schedule.filter(
      r =>
        r.month.toString().includes(q) ||
        r.dateStr.toLowerCase().includes(q) ||
        r.totalEndingBalance.toFixed(2).includes(q)
    );
  }, [activeResult.schedule, scheduleSearch]);

  const totalPages = Math.ceil(filteredSchedule.length / itemsPerPage) || 1;
  const paginatedSchedule = useMemo(() => {
    const start = (schedulePage - 1) * itemsPerPage;
    return filteredSchedule.slice(start, start + itemsPerPage);
  }, [filteredSchedule, schedulePage]);

  // CSV Export
  const handleExportCSV = () => {
    if (!activeResult.schedule || activeResult.schedule.length === 0) return;

    const debtHeaders = debts.map(d => `${d.name} Bal ($)`);
    const headers = [
      'Month #',
      'Date',
      'Total Payment ($)',
      'Total Interest ($)',
      'Total Ending Balance ($)',
      ...debtHeaders,
    ];

    const rows = activeResult.schedule.map(r => {
      const debtBals = debts.map(d => {
        const found = r.debts.find(item => item.id === d.id);
        return found ? found.endingBalance.toFixed(2) : '0.00';
      });

      return [
        r.month,
        r.dateStr,
        r.totalPaymentApplied.toFixed(2),
        r.totalInterestAccrued.toFixed(2),
        r.totalEndingBalance.toFixed(2),
        ...debtBals,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `debt-payoff-${selectedStrategy}-schedule-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // SVG Chart Trajectory Data
  const chartData = useMemo(() => {
    if (!avalancheResult.isFeasible || !snowballResult.isFeasible) return null;

    const maxMonths = Math.max(avalancheResult.totalMonths, snowballResult.totalMonths, 1);
    const maxBalance = Math.max(totalStartingBalance, 1000);

    const width = 600;
    const height = 240;
    const padding = { top: 20, right: 30, bottom: 30, left: 55 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    const getX = (m: number) => padding.left + (m / maxMonths) * innerWidth;
    const getY = (bal: number) => padding.top + innerHeight - (Math.max(0, bal) / maxBalance) * innerHeight;

    const avalanchePoints = [
      { x: getX(0), y: getY(totalStartingBalance), bal: totalStartingBalance, month: 0, date: getMonthDateStr(0) },
      ...avalancheResult.schedule.map(s => ({
        x: getX(s.month),
        y: getY(s.totalEndingBalance),
        bal: s.totalEndingBalance,
        month: s.month,
        date: s.dateStr,
      })),
    ];

    const snowballPoints = [
      { x: getX(0), y: getY(totalStartingBalance), bal: totalStartingBalance, month: 0 },
      ...snowballResult.schedule.map(s => ({
        x: getX(s.month),
        y: getY(s.totalEndingBalance),
        bal: s.totalEndingBalance,
        month: s.month,
      })),
    ];

    const generatePath = (points: { x: number; y: number }[]) => {
      if (points.length === 0) return '';
      return points.reduce(
        (acc, p, i) => (i === 0 ? `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}` : `${acc} L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`),
        ''
      );
    };

    return {
      width,
      height,
      padding,
      innerWidth,
      innerHeight,
      avalanchePoints,
      snowballPoints,
      avalanchePath: generatePath(avalanchePoints),
      snowballPath: generatePath(snowballPoints),
      maxMonths,
      maxBalance,
    };
  }, [avalancheResult, snowballResult, totalStartingBalance]);

  return (
    <div className="w-full space-y-8 print:space-y-4">
      {/* Top Quick Actions & Summary Strip */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Active Debts: <strong className="text-slate-900">{debts.length}</strong> | Total Principal:{' '}
            <strong className="text-emerald-700 font-mono">${totalStartingBalance.toLocaleString()}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddDebt}
            disabled={debts.length >= 10}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Debt Line</span>
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Dynamic Multi-Debt Entry & Global Extra Payment Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Strategy Mode Toggle Tabs */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Repayment Strategy Algorithm</span>
              </label>
            </div>

            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedStrategy('avalanche')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedStrategy === 'avalanche'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Debt Avalanche</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStrategy('snowball')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedStrategy === 'snowball'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5 text-blue-600" />
                <span>Debt Snowball</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              {selectedStrategy === 'avalanche'
                ? '⚡ Avalanche pays off highest interest rate (APR) debts first to save the most total interest dollars.'
                : '❄️ Snowball eliminates lowest balance debts first to deliver fast psychological motivation.'}
            </p>
          </div>

          {/* Global Monthly Extra Debt Payment Slider / Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Extra Monthly Payment Pool ($/mo)
              </label>
              <span className="text-sm font-black font-mono text-emerald-700">
                +${extraPayment.toLocaleString()}/mo
              </span>
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 font-semibold">$</span>
              <input
                type="number"
                min={0}
                max={20000}
                step={25}
                value={extraPayment}
                onChange={e => setExtraPayment(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-8 pr-4 text-slate-900 font-bold text-base focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              />
            </div>

            <input
              type="range"
              min={0}
              max={2500}
              step={25}
              value={extraPayment}
              onChange={e => setExtraPayment(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Combined Minimums: <strong>${totalMinPayment.toLocaleString()}/mo</strong></span>
              <span>Total Monthly Budget: <strong className="text-slate-900">${totalMonthlyBudget.toLocaleString()}/mo</strong></span>
            </div>
          </div>

          {/* Dynamic Multi-Debt Line Entries Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                Your Debts ({debts.length} / 10)
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Rollover: Active
              </span>
            </div>

            <div className="space-y-4">
              {debts.map((debt, index) => (
                <div
                  key={debt.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative transition-all hover:border-slate-300"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={debt.name}
                      onChange={e => handleUpdateDebt(debt.id, 'name', e.target.value)}
                      className="font-bold text-sm text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none px-1 py-0.5"
                    />

                    {debts.length > 1 && (
                      <button
                        onClick={() => handleRemoveDebt(debt.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove debt line"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                        Balance ($)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={1000000}
                        step={100}
                        value={debt.balance}
                        onChange={e =>
                          handleUpdateDebt(debt.id, 'balance', Math.max(0, Number(e.target.value)))
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                        Rate (APR %)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={99}
                        step={0.1}
                        value={debt.apr}
                        onChange={e =>
                          handleUpdateDebt(debt.id, 'apr', Math.max(0, Number(e.target.value)))
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                        Min Pay ($)
                      </label>
                      <input
                        type="number"
                        min={5}
                        max={50000}
                        step={5}
                        value={debt.minPayment}
                        onChange={e =>
                          handleUpdateDebt(debt.id, 'minPayment', Math.max(0, Number(e.target.value)))
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {activeResult.debtPayoffDates[debt.id] && (
                    <div className="text-[11px] font-semibold text-emerald-700 flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span>Estimated Debt-Free:</span>
                      <span className="font-mono">
                        Month {activeResult.debtPayoffDates[debt.id].month} ({activeResult.debtPayoffDates[debt.id].dateStr})
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {debts.length < 10 && (
              <button
                onClick={handleAddDebt}
                className="w-full py-2.5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-500 text-slate-600 hover:text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Debt Line</span>
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Executive Summary Dashboard & Head-to-Head Comparison */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Executive Summary Card */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
            {/* Top decorative glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                  {selectedStrategy === 'avalanche' ? 'Avalanche Summary' : 'Snowball Summary'}
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleExportCSV}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Export multi-debt payoff schedule to CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer print:hidden"
                  title="Print results summary"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Hero Debt-Free Calendar Date */}
            <div className="mt-6 text-center py-2 relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                100% Debt-Free Date
              </span>
              <div className="text-3xl sm:text-5xl font-black text-white mt-1 tracking-tight">
                {activeResult.isFeasible ? activeResult.debtFreeDate : 'Unreachable'}
              </div>
              <div className="text-xs text-slate-400 mt-2 font-mono">
                {activeResult.isFeasible ? (
                  <>
                    <strong className="text-white font-bold">{activeResult.totalMonths} Total Months</strong>{' '}
                    ({(activeResult.totalMonths / 12).toFixed(1)} years across all {debts.length} accounts)
                  </>
                ) : (
                  'Increase extra monthly budget to outpace interest accumulation'
                )}
              </div>
            </div>

            {/* 3 Key Pillars */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800/80 relative z-10 text-center">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Total Interest
                </span>
                <span className="text-base sm:text-lg font-bold text-rose-400 font-mono mt-0.5 block">
                  ${activeResult.totalInterestPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Total Principal
                </span>
                <span className="text-base sm:text-lg font-bold text-slate-200 font-mono mt-0.5 block">
                  ${totalStartingBalance.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Total Out of Pocket
                </span>
                <span className="text-base sm:text-lg font-bold text-white font-mono mt-0.5 block">
                  ${activeResult.totalAmountPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          {/* Strategy Head-to-Head Comparison Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-600" />
                <span>Strategy Head-to-Head Comparison</span>
              </h4>
              <span className="text-xs font-mono text-slate-400">Avalanche vs. Snowball</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              {/* Avalanche Box */}
              <div
                onClick={() => setSelectedStrategy('avalanche')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedStrategy === 'avalanche'
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-900">Debt Avalanche</span>
                  {selectedStrategy === 'avalanche' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mb-2">Highest APR first</div>
                <div className="space-y-1 font-mono">
                  <div className="text-slate-700">Time: <strong>{avalancheResult.totalMonths} mos</strong></div>
                  <div className="text-rose-600">Interest: <strong>${avalancheResult.totalInterestPaid.toFixed(0)}</strong></div>
                </div>
              </div>

              {/* Snowball Box */}
              <div
                onClick={() => setSelectedStrategy('snowball')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedStrategy === 'snowball'
                    ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-blue-900">Debt Snowball</span>
                  {selectedStrategy === 'snowball' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mb-2">Lowest balance first</div>
                <div className="space-y-1 font-mono">
                  <div className="text-slate-700">Time: <strong>{snowballResult.totalMonths} mos</strong></div>
                  <div className="text-rose-600">Interest: <strong>${snowballResult.totalInterestPaid.toFixed(0)}</strong></div>
                </div>
              </div>
            </div>

            {/* Savings Callout */}
            <div className="p-3.5 rounded-2xl bg-emerald-100/60 border border-emerald-200 text-xs font-semibold text-emerald-950 flex items-center justify-between">
              <span>Avalanche Saves:</span>
              <span className="font-mono font-bold text-emerald-800">
                ${comparisonMetrics.interestSavedWithAvalanche.toLocaleString(undefined, { maximumFractionDigits: 0 })} in interest
                {comparisonMetrics.monthsDiff > 0 ? ` & ${comparisonMetrics.monthsDiff} months faster` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive SVG Payoff Trajectory Chart */}
      {chartData && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Multi-Debt Balance Amortization Trajectory
              </h3>
              <p className="text-xs text-slate-500">
                Total aggregate debt balance decay curve over time
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-emerald-600 rounded-full" />
                <span className="text-slate-700">Debt Avalanche</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-blue-500 rounded-full border border-dashed" />
                <span className="text-slate-700">Debt Snowball</span>
              </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartData.width} ${chartData.height}`}
              className="w-full h-64 select-none font-sans"
            >
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
                const yVal = chartData.padding.top + chartData.innerHeight * ratio;
                const labelBal = chartData.maxBalance * (1 - ratio);
                return (
                  <g key={ratio}>
                    <line
                      x1={chartData.padding.left}
                      y1={yVal}
                      x2={chartData.width - chartData.padding.right}
                      y2={yVal}
                      stroke="#E2E8F0"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={chartData.padding.left - 8}
                      y={yVal + 3}
                      textAnchor="end"
                      className="text-[10px] fill-slate-400 font-mono font-medium"
                    >
                      ${(labelBal / 1000).toFixed(1)}k
                    </text>
                  </g>
                );
              })}

              {/* Snowball Line */}
              <path
                d={chartData.snowballPath}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeDasharray="4 3"
                opacity={0.8}
              />

              {/* Avalanche Line */}
              <path
                d={chartData.avalanchePath}
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Hover Nodes */}
              {chartData.avalanchePoints.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredPointIndex === idx ? 6 : 2.5}
                  className="fill-white stroke-emerald-600 stroke-2 cursor-pointer transition-all hover:stroke-emerald-800"
                  onMouseEnter={() => setHoveredPointIndex(idx)}
                  onMouseLeave={() => setHoveredPointIndex(null)}
                />
              ))}
            </svg>
          </div>

          {hoveredPointIndex !== null && chartData.avalanchePoints[hoveredPointIndex] && (
            <div className="p-3 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between font-mono">
              <span>
                Month {chartData.avalanchePoints[hoveredPointIndex].month}:{' '}
                <strong className="text-emerald-400">{chartData.avalanchePoints[hoveredPointIndex].date}</strong>
              </span>
              <span>
                Remaining Total Balance: <strong className="text-white">${chartData.avalanchePoints[hoveredPointIndex].bal.toFixed(2)}</strong>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Interactive Amortization & Rollover Schedule Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Payment Rollover Amortization Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Month-by-month repayment breakdown with automatic rollover allocations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search month, date..."
                value={scheduleSearch}
                onChange={e => {
                  setScheduleSearch(e.target.value);
                  setSchedulePage(1);
                }}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Month #</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total Payment</th>
                <th className="px-4 py-3">Interest Paid</th>
                <th className="px-4 py-3">Active Debts</th>
                <th className="px-4 py-3">Ending Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {paginatedSchedule.map(row => (
                <tr key={row.month} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-slate-900">#{row.month}</td>
                  <td className="px-4 py-2.5 text-slate-700 font-sans">{row.dateStr}</td>
                  <td className="px-4 py-2.5 font-bold text-emerald-700">${row.totalPaymentApplied.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-rose-600">${row.totalInterestAccrued.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-slate-700">{row.activeDebtsCount} remaining</td>
                  <td className="px-4 py-2.5 font-bold text-slate-900">${row.totalEndingBalance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              Showing Page <strong className="text-slate-900">{schedulePage}</strong> of{' '}
              <strong className="text-slate-900">{totalPages}</strong> ({filteredSchedule.length} total months)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={schedulePage <= 1}
                onClick={() => setSchedulePage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50 cursor-pointer font-bold"
              >
                Previous
              </button>
              <button
                disabled={schedulePage >= totalPages}
                onClick={() => setSchedulePage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50 cursor-pointer font-bold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
