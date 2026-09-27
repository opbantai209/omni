import React, { useState, useMemo } from 'react';
import { evaluateBalanceTransfer, evaluateConsolidationLoan } from '../../utils/debtSimulation';
import { ArrowLeftRight, Landmark, CheckSquare, Square, ShieldAlert } from 'lucide-react';
import { PayoffTrajectoryChart } from './PayoffTrajectoryChart';

export interface DebtItem {
  id: string;
  name: string;
  balance: number;
  interestRate?: number;
  nominalApr?: number;
}

export interface BalanceTransferModuleProps {
  debts?: DebtItem[];
  baselineInterest?: number;
  snowballHistory?: { month: number; balance: number }[];
  avalancheHistory?: { month: number; balance: number }[];
}

const roundCurrency = (val: number): number => {
  return Math.round((val + Number.EPSILON) * 100) / 100;
};

export const BalanceTransferModule: React.FC<BalanceTransferModuleProps> = ({
  debts = [
    { id: '1', name: 'Credit Card A', balance: 5000, interestRate: 24.99 },
    { id: '2', name: 'Credit Card B', balance: 3500, interestRate: 19.99 },
    { id: '3', name: 'Store Card', balance: 1500, interestRate: 28.99 },
  ],
  baselineInterest = 2850,
  snowballHistory = [],
  avalancheHistory = [],
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => debts.map(d => d.id));
  const [mode, setMode] = useState<'balance_transfer' | 'consolidation'>('balance_transfer');

  // Balance Transfer Inputs
  const [transferFeePercent, setTransferFeePercent] = useState<number>(3.0);
  const [promoApr, setPromoApr] = useState<number>(0.0);
  const [promoMonths, setPromoMonths] = useState<number>(18);
  const [postPromoApr, setPostPromoApr] = useState<number>(21.99);
  const [transferMonthlyPay, setTransferMonthlyPay] = useState<number>(400);

  // Consolidation Loan Inputs
  const [loanApr, setLoanApr] = useState<number>(9.99);
  const [originationFeePercent, setOriginationFeePercent] = useState<number>(1.0);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(36);

  const selectedDebts = useMemo(
    () => debts.filter(d => selectedIds.includes(d.id)),
    [debts, selectedIds]
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === debts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(debts.map(d => d.id));
    }
  };

  const toggleDebt = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Run Calculations
  const btResult = useMemo(() => {
    if (selectedDebts.length === 0) return null;
    return evaluateBalanceTransfer(selectedDebts, {
      transferFeePercent: Number(transferFeePercent) || 0,
      promoApr: Number(promoApr) || 0,
      promoMonths: Number(promoMonths) || 0,
      postPromoApr: Number(postPromoApr) || 0,
      monthlyPayment: Number(transferMonthlyPay) || 0,
    });
  }, [selectedDebts, transferFeePercent, promoApr, promoMonths, postPromoApr, transferMonthlyPay]);

  const loanResult = useMemo(() => {
    if (selectedDebts.length === 0) return null;
    return evaluateConsolidationLoan(selectedDebts, {
      loanApr: Number(loanApr) || 0,
      originationFeePercent: Number(originationFeePercent) || 0,
      loanTermMonths: Number(loanTermMonths) || 0,
    });
  }, [selectedDebts, loanApr, originationFeePercent, loanTermMonths]);

  const totalSelectedBalance = useMemo(() => {
    return roundCurrency(selectedDebts.reduce((sum, d) => sum + (Number(d.balance) || 0), 0));
  }, [selectedDebts]);

  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-800 shadow-xs mt-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Consolidation & Arbitrage Engine</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Balance Transfer & Consolidation Simulator
          </h3>
        </div>
      </div>

      {/* Debt Selection Checklist */}
      <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-sm font-bold text-slate-900">
            Select Debts to Consolidate / Transfer:
          </span>
          <button
            type="button"
            onClick={toggleSelectAll}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
          >
            {selectedIds.length === debts.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {debts.map(debt => {
            const isSelected = selectedIds.includes(debt.id);
            return (
              <button
                key={debt.id}
                type="button"
                onClick={() => toggleDebt(debt.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
                <span>{debt.name}</span>
                <span className={`font-mono font-bold ${isSelected ? 'text-blue-100' : 'text-slate-900'}`}>
                  ${roundCurrency(Number(debt.balance)).toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-2 text-xs text-slate-500 font-medium">
          Total Selected Balance:{' '}
          <strong className="text-slate-900 font-mono text-sm">
            ${totalSelectedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </strong>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-2 bg-slate-200/80 p-1 rounded-2xl">
        <button
          type="button"
          onClick={() => setMode('balance_transfer')}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            mode === 'balance_transfer'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>0% APR Balance Transfer Card</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('consolidation')}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            mode === 'consolidation'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Fixed Consolidation Loan</span>
        </button>
      </div>

      {/* Balance Transfer Inputs */}
      {mode === 'balance_transfer' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-white p-5 rounded-2xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Transfer Fee (%)</label>
            <input
              type="number"
              step="0.1"
              value={transferFeePercent}
              onChange={e => setTransferFeePercent(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Promo APR (%)</label>
            <input
              type="number"
              step="0.1"
              value={promoApr}
              onChange={e => setPromoApr(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Promo Period (Mos)</label>
            <input
              type="number"
              value={promoMonths}
              onChange={e => setPromoMonths(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Post-Promo APR (%)</label>
            <input
              type="number"
              step="0.1"
              value={postPromoApr}
              onChange={e => setPostPromoApr(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Payment ($)</label>
            <input
              type="number"
              value={transferMonthlyPay}
              onChange={e => setTransferMonthlyPay(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Consolidation Loan Inputs */}
      {mode === 'consolidation' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-2xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Loan APR (%)</label>
            <input
              type="number"
              step="0.1"
              value={loanApr}
              onChange={e => setLoanApr(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Origination Fee (%)</label>
            <input
              type="number"
              step="0.1"
              value={originationFeePercent}
              onChange={e => setOriginationFeePercent(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Term Length (Months)</label>
            <input
              type="number"
              value={loanTermMonths}
              onChange={e => setLoanTermMonths(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Results Projection Boxes */}
      {selectedDebts.length === 0 ? (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Please select at least one debt account above to run the transfer or consolidation simulation.</span>
        </div>
      ) : mode === 'balance_transfer' && btResult ? (
        <div className="bg-white p-6 rounded-2xl border border-sky-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-base font-bold text-sky-900 flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-sky-600" />
              <span>Balance Transfer Projection</span>
            </h4>
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 font-bold">
              {btResult.payoffMonths} Months to Payoff
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 font-medium block">Transferred Balance</span>
              <span className="text-slate-900 font-mono font-bold text-sm sm:text-base">
                ${roundCurrency(btResult.initialPrincipal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 font-medium block">Upfront Fee ({transferFeePercent}%)</span>
              <span className="text-amber-700 font-mono font-bold text-sm sm:text-base">
                ${roundCurrency(btResult.feeAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 font-medium block">Total Interest Paid</span>
              <span className="text-emerald-700 font-mono font-bold text-sm sm:text-base">
                ${roundCurrency(btResult.totalInterest).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
              <span className="text-sky-800 font-medium block">Total Cost</span>
              <span className="text-sky-900 font-mono font-bold text-sm sm:text-base">
                ${roundCurrency(btResult.totalCost).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      ) : mode === 'consolidation' && loanResult ? (
        <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-base font-bold text-emerald-900 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-600" />
              <span>Consolidation Loan Projection</span>
            </h4>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {loanTermMonths} Months Term
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 font-medium block">Total Loan Amount (Incl. Fee)</span>
              <span className="text-slate-900 font-mono font-bold text-sm sm:text-base">
                ${roundCurrency(loanResult.totalLoanAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 font-medium block">Monthly Installment</span>
              <span className="text-blue-700 font-mono font-bold text-sm sm:text-base">
                ${roundCurrency(loanResult.monthlyPayment).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 font-medium block">Total Interest Paid</span>
              <span className="text-emerald-700 font-mono font-bold text-sm sm:text-base">
                ${roundCurrency(loanResult.totalInterest).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-emerald-800 font-medium block">Total Cost</span>
              <span className="text-emerald-900 font-mono font-bold text-sm sm:text-base">
                ${roundCurrency(loanResult.totalCost).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Payoff Trajectory Comparison Chart */}
      {selectedDebts.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-lg font-black text-slate-900">
            Multi-Strategy Payoff Comparison
          </h3>
          <PayoffTrajectoryChart
            snowballHistory={snowballHistory}
            avalancheHistory={avalancheHistory}
            btHistory={mode === 'balance_transfer' && btResult ? btResult.history : []}
            loanHistory={mode === 'consolidation' && loanResult ? loanResult.history : []}
          />
        </div>
      )}
    </div>
  );
};

export default BalanceTransferModule;
