import React, { useState, useMemo, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { BalanceTransferModule } from './BalanceTransferModule';

interface Debt {
  id: string;
  name: string;
  balance: number | string;
  rate: number | string;
  minPayment: number | string;
}

interface SimulationResult {
  totalMonths: number;
  totalInterest: number;
  firstDebtPayoffMonth: number;
  history: { month: number; balance: number }[];
}

// Simulation logic utility function
function simulatePayoff(initialDebts: Debt[], extraBudget: number | string, strategy: 'snowball' | 'avalanche'): SimulationResult {
  if (!initialDebts || initialDebts.length === 0) {
    return { totalMonths: 0, totalInterest: 0, firstDebtPayoffMonth: 0, history: [] };
  }

  let debts = initialDebts.map(d => ({ ...d, currentBalance: Number(d.balance) || 0 }));
  const baseMinPaymentSum = debts.reduce((sum, d) => sum + (Number(d.minPayment) || 0), 0);
  const totalMonthlyBudget = baseMinPaymentSum + (Number(extraBudget) || 0);

  let totalInterestPaid = 0;
  let month = 0;
  let firstDebtPayoffMonth: number | null = null;
  const history: { month: number; balance: number }[] = [];

  while (debts.some(d => d.currentBalance > 0) && month < 360) {
    month++;

    // 1. Accrue monthly interest
    debts.forEach(d => {
      if (d.currentBalance > 0) {
        const mRate = ((Number(d.rate) || 0) / 100) / 12;
        const interest = d.currentBalance * mRate;
        d.currentBalance += interest;
        totalInterestPaid += interest;
      }
    });

    // 2. Allocate base minimum payments
    let availableBudget = totalMonthlyBudget;
    debts.forEach(d => {
      if (d.currentBalance > 0) {
        const pay = Math.min(d.currentBalance, Number(d.minPayment) || 0);
        d.currentBalance -= pay;
        availableBudget -= pay;
      }
    });

    // 3. Sort active debts according to selected strategy
    let activeDebts = debts.filter(d => d.currentBalance > 0);
    if (strategy === 'snowball') {
      activeDebts.sort((a, b) => a.currentBalance - b.currentBalance);
    } else if (strategy === 'avalanche') {
      activeDebts.sort((a, b) => Number(b.rate) - Number(a.rate));
    }

    // 4. Apply extra rollover payment
    for (let debt of activeDebts) {
      if (availableBudget <= 0) break;
      const extraPay = Math.min(debt.currentBalance, availableBudget);
      debt.currentBalance -= extraPay;
      availableBudget -= extraPay;
    }

    if (firstDebtPayoffMonth === null && debts.filter(d => d.currentBalance > 0).length < initialDebts.length) {
      firstDebtPayoffMonth = month;
    }

    const totalRemainingBalance = debts.reduce((sum, d) => sum + d.currentBalance, 0);
    history.push({ month, balance: Math.max(0, totalRemainingBalance) });
  }

  return {
    totalMonths: month,
    totalInterest: totalInterestPaid,
    firstDebtPayoffMonth: firstDebtPayoffMonth || month,
    history
  };
}

export const DebtSnowballCalculator: React.FC = () => {
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Credit Card A', balance: 3500, rate: 22.9, minPayment: 110 },
    { id: '2', name: 'Medical Bill', balance: 800, rate: 8.0, minPayment: 50 },
    { id: '3', name: 'Personal Loan', balance: 12000, rate: 11.5, minPayment: 320 }
  ]);
  const [extraBudget, setExtraBudget] = useState<number | string>(300);

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Debts Handlers
  const handleDebtChange = (id: string, field: keyof Debt, value: any) => {
    setDebts(prevDebts =>
      prevDebts.map(d => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const addDebt = () => {
    setDebts(prev => [
      ...prev,
      { id: Date.now().toString(), name: 'New Debt', balance: 2000, rate: 15.0, minPayment: 60 }
    ]);
  };

  const removeDebt = (id: string) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  // Re-run simulations only when debts or extra budget change
  const snowball = useMemo(() => simulatePayoff(debts, extraBudget, 'snowball'), [debts, extraBudget]);
  const avalanche = useMemo(() => simulatePayoff(debts, extraBudget, 'avalanche'), [debts, extraBudget]);

  const interestSaved = useMemo(() => Math.max(0, snowball.totalInterest - avalanche.totalInterest), [snowball, avalanche]);

  // Chart lifecycle management hook
  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const maxMonths = Math.max(snowball.history.length, avalanche.history.length);
    const labels = Array.from({ length: maxMonths + 1 }, (_, i) => `M${i}`);

    const snowballData = [snowball.history[0]?.balance || 0, ...snowball.history.map(h => h.balance)];
    const avalancheData = [avalanche.history[0]?.balance || 0, ...avalanche.history.map(h => h.balance)];

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Debt Snowball',
            data: snowballData,
            borderColor: '#0284c7',
            backgroundColor: 'rgba(2, 132, 199, 0.08)',
            fill: true,
            tension: 0.1,
            pointRadius: 0
          },
          {
            label: 'Debt Avalanche',
            data: avalancheData,
            borderColor: '#16a34a',
            backgroundColor: 'rgba(22, 163, 74, 0.08)',
            fill: true,
            tension: 0.1,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { tooltip: { mode: 'index', intersect: false } },
        scales: {
          y: { beginAtZero: true, ticks: { callback: (v: any) => '$' + Number(v).toLocaleString() } }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [snowball, avalanche]);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <h2 style={{ marginTop: 0 }}>Debt Snowball vs. Avalanche Calculator</h2>

        {/* Debt Entry Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Debt Name</th>
              <th style={{ padding: '8px' }}>Balance ($)</th>
              <th style={{ padding: '8px' }}>APR (%)</th>
              <th style={{ padding: '8px' }}>Min. Payment ($)</th>
              <th style={{ padding: '8px', width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {debts.map(debt => (
              <tr key={debt.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px' }}>
                  <input
                    type="text"
                    value={debt.name}
                    onChange={e => handleDebtChange(debt.id, 'name', e.target.value)}
                    style={{ width: '100%', padding: '6px' }}
                  />
                </td>
                <td style={{ padding: '8px' }}>
                  <input
                    type="number"
                    value={debt.balance}
                    onChange={e => handleDebtChange(debt.id, 'balance', e.target.value)}
                    style={{ width: '100%', padding: '6px' }}
                  />
                </td>
                <td style={{ padding: '8px' }}>
                  <input
                    type="number"
                    value={debt.rate}
                    onChange={e => handleDebtChange(debt.id, 'rate', e.target.value)}
                    style={{ width: '100%', padding: '6px' }}
                  />
                </td>
                <td style={{ padding: '8px' }}>
                  <input
                    type="number"
                    value={debt.minPayment}
                    onChange={e => handleDebtChange(debt.id, 'minPayment', e.target.value)}
                    style={{ width: '100%', padding: '6px' }}
                  />
                </td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => removeDebt(debt.id)} style={{ color: '#ef4444', cursor: 'pointer', background: 'none', border: 'none', fontSize: '1rem', fontWeight: 'bold' }}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addDebt} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
          + Add Another Debt
        </button>

        {/* Extra Budget Section */}
        <div style={{ marginTop: '20px', padding: '16px', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong>Extra Monthly Payoff Budget</strong>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Amount paid above total minimum payments</div>
          </div>
          <div>
            $ <input
              type="number"
              value={extraBudget}
              onChange={e => setExtraBudget(e.target.value)}
              style={{ width: '100px', padding: '6px', fontWeight: 'bold' }}
            /> / mo
          </div>
        </div>
      </div>

      {/* Results Comparison Grid */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h3>Strategy Results</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#f0f9ff', border: '2px solid #0284c7', borderRadius: '8px', padding: '16px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#0369a1' }}>Debt Snowball</h4>
            <p><strong>Total Interest:</strong> ${snowball.totalInterest.toFixed(2)}</p>
            <p><strong>Time to Freedom:</strong> {snowball.totalMonths} mos ({(snowball.totalMonths / 12).toFixed(1)} yrs)</p>
            <p><strong>First Win:</strong> Month {snowball.firstDebtPayoffMonth}</p>
          </div>

          <div style={{ background: '#f0fdf4', border: '2px solid #16a34a', borderRadius: '8px', padding: '16px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#15803d' }}>Debt Avalanche</h4>
            <p><strong>Total Interest:</strong> ${avalanche.totalInterest.toFixed(2)}</p>
            <p><strong>Time to Freedom:</strong> {avalanche.totalMonths} mos ({(avalanche.totalMonths / 12).toFixed(1)} yrs)</p>
            <p><strong>Interest Saved vs Snowball:</strong> ${interestSaved.toFixed(2)}</p>
          </div>
        </div>

        {/* Chart Canvas */}
        <div style={{ position: 'relative', height: '300px', marginTop: '24px' }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>

      {/* Balance Transfer & Consolidation Simulator */}
      <BalanceTransferModule
        debts={debts.map(d => ({
          id: d.id,
          name: d.name,
          balance: Number(d.balance) || 0,
          interestRate: Number(d.rate) || 0,
        }))}
        baselineInterest={avalanche.totalInterest}
        snowballHistory={snowball.history}
        avalancheHistory={avalanche.history}
      />
    </div>
  );
};
