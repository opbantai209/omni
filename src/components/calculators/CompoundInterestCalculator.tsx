import React, { useState, useMemo, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  CalculatorInputs,
  calculateCompoundInterest,
  downloadScheduleCSV,
  exportPDFReport
} from '../../utils/compoundInterestEngine';

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

export function CompoundInterestCalculator() {
  // Input State Defaults
  const [inputs, setInputs] = useState<CalculatorInputs>({
    initialPrincipal: 10000,
    additionalContribution: 500,
    contributionFrequency: 'monthly',
    depositTiming: 'beginning',
    annualRate: 8.0,
    compoundingFrequency: 12, // Monthly
    years: 30,
    annualStepUp: 2.0, // 2% annual contribution increase
    inflationRate: 2.5,
    taxRate: 0 // Tax-free / Tax-advantaged default
  });

  const [showMonthlyTable, setShowMonthlyTable] = useState(false);
  const [showRealValueLine, setShowRealValueLine] = useState(true);
  const chartRef = useRef<ChartJS<'line'> | null>(null);

  // Input change handler
  const handleInputChange = (field: keyof CalculatorInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Run calculation engine memoized
  const results = useMemo(() => calculateCompoundInterest(inputs), [inputs]);

  // Format currency helpers
  const fmt = (val: number) =>
    `$${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  // Prepare Chart.js Stacked Area Dataset
  const chartLabels = results.yearlySchedule.map(y => `Year ${y.year}`);
  
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Starting Principal',
        data: results.yearlySchedule.map(() => inputs.initialPrincipal),
        backgroundColor: 'rgba(59, 130, 246, 0.4)', // Blue
        borderColor: '#3b82f6',
        fill: true,
        pointRadius: 0
      },
      {
        label: 'Total Contributions',
        data: results.yearlySchedule.map(y => inputs.initialPrincipal + y.totalContributions),
        backgroundColor: 'rgba(16, 185, 129, 0.4)', // Green
        borderColor: '#10b981',
        fill: true,
        pointRadius: 0
      },
      {
        label: 'Total Interest Earned',
        data: results.yearlySchedule.map(y => y.endingBalance),
        backgroundColor: 'rgba(139, 92, 246, 0.3)', // Purple
        borderColor: '#8b5cf6',
        fill: true,
        pointRadius: 0
      },
      ...(showRealValueLine
        ? [
            {
              label: 'Real Value (Inflation-Adjusted)',
              data: results.yearlySchedule.map(y => y.realEndingBalance),
              backgroundColor: 'transparent',
              borderColor: '#f59e0b', // Amber
              borderDash: [6, 4],
              borderWidth: 2,
              fill: false,
              pointRadius: 0
            }
          ]
        : [])
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${fmt(context.raw)}`
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        ticks: { callback: (val: any) => `$${(val / 1000).toFixed(0)}k` },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-50 min-h-screen text-slate-800 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Compound Interest Calculator
        </h1>
        <p className="text-slate-600 mt-2 text-lg">
          Model long-term wealth accumulation with step-up deposits, compounding intervals, tax drag, and inflation adjustment.
        </p>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Control Panel */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 border-b pb-3">Parameters</h2>

          {/* Initial Principal */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Starting Principal ($)
            </label>
            <input
              type="number"
              value={inputs.initialPrincipal}
              onChange={e => handleInputChange('initialPrincipal', Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Additional Contribution & Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Recurring Deposit ($)
              </label>
              <input
                type="number"
                value={inputs.additionalContribution}
                onChange={e => handleInputChange('additionalContribution', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Frequency</label>
              <select
                value={inputs.contributionFrequency}
                onChange={e => handleInputChange('contributionFrequency', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="monthly">Monthly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
          </div>

          {/* Deposit Timing & Annual Step-Up */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Deposit Timing</label>
              <select
                value={inputs.depositTiming}
                onChange={e => handleInputChange('depositTiming', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="beginning">Beginning (Due)</option>
                <option value="end">End (Ordinary)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Annual Step-Up (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={inputs.annualStepUp}
                onChange={e => handleInputChange('annualStepUp', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Annual Rate & Compounding Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Expected APR (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.annualRate}
                onChange={e => handleInputChange('annualRate', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Compounding</label>
              <select
                value={inputs.compoundingFrequency}
                onChange={e => handleInputChange('compoundingFrequency', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value={365}>Daily (365/yr)</option>
                <option value={12}>Monthly (12/yr)</option>
                <option value={4}>Quarterly (4/yr)</option>
                <option value={2}>Semi-Annually (2/yr)</option>
                <option value={1}>Annually (1/yr)</option>
              </select>
            </div>
          </div>

          {/* Investment Horizon Slider */}
          <div>
            <div className="flex justify-between text-sm font-semibold text-slate-700 mb-1">
              <span>Investment Horizon</span>
              <span className="text-blue-600 font-bold">{inputs.years} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={inputs.years}
              onChange={e => handleInputChange('years', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Inflation & Tax Drag Adjustments */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Inflation Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.inflationRate}
                onChange={e => handleInputChange('inflationRate', Number(e.target.value))}
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Marginal Tax Drag (%)
              </label>
              <input
                type="number"
                step="1"
                value={inputs.taxRate}
                onChange={e => handleInputChange('taxRate', Number(e.target.value))}
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Key Dashboard & Visualizations */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium text-slate-500">Future Portfolio Value</span>
              <div className="text-xl md:text-2xl font-black text-blue-600 mt-1">
                {fmt(results.finalBalance)}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium text-slate-500">Total Out-of-Pocket</span>
              <div className="text-xl md:text-2xl font-bold text-slate-800 mt-1">
                {fmt(results.totalPrincipal + results.totalContributions)}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium text-slate-500">Total Interest Earned</span>
              <div className="text-xl md:text-2xl font-bold text-purple-600 mt-1">
                {fmt(results.totalInterestEarned)}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium text-slate-500">Real Inflation Value</span>
              <div className="text-xl md:text-2xl font-bold text-amber-600 mt-1">
                {fmt(results.finalRealBalance)}
              </div>
            </div>
          </div>

          {/* Tipping Point Badge Alert */}
          {results.tippingPointMonth ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
              <span className="text-xl">🚀</span>
              <div className="text-sm text-emerald-900">
                <strong>Growth Tipping Point Reached:</strong> In{' '}
                <strong>
                  Year {Math.floor((results.tippingPointMonth - 1) / 12) + 1}, Month{' '}
                  {((results.tippingPointMonth - 1) % 12) + 1}
                </strong>
                , your accumulated interest gains officially surpassed your total out-of-pocket deposits!
              </div>
            </div>
          ) : null}

          {/* Main Growth Chart Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Portfolio Accumulation Curve</h3>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRealValueLine}
                  onChange={e => setShowRealValueLine(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Show Inflation Curve
              </label>
            </div>
            <div className="h-80 w-full">
              <Line ref={chartRef} data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Table & Export Section */}
      <section className="mt-10 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Accumulation Schedule</h3>
            <p className="text-sm text-slate-500">
              Breakdown of annual deposits, compounding interest, and inflation-adjusted values.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowMonthlyTable(!showMonthlyTable)}
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 transition"
            >
              {showMonthlyTable ? 'Show Annual View' : 'Show Monthly View'}
            </button>
            <button
              onClick={() => downloadScheduleCSV(results)}
              className="px-4 py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              📥 Export Schedule (CSV)
            </button>
            <button
              onClick={() => exportPDFReport(results, inputs, chartRef.current)}
              className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              📄 Export PDF Report
            </button>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto max-h-96 border rounded-xl">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100 text-slate-800 font-semibold sticky top-0 border-b">
              <tr>
                <th className="p-3">{showMonthlyTable ? 'Month' : 'Year'}</th>
                <th className="p-3">Starting ($)</th>
                <th className="p-3">Deposits ($)</th>
                <th className="p-3">Interest ($)</th>
                <th className="p-3">Ending ($)</th>
                <th className="p-3">Cum. Interest ($)</th>
                <th className="p-3">Real Value ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {showMonthlyTable
                ? results.monthlySchedule.map(m => (
                    <tr key={m.month} className="hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-900">
                        Y{m.year}-M{((m.month - 1) % 12) + 1}
                      </td>
                      <td className="p-3">{fmt(m.startingBalance)}</td>
                      <td className="p-3 text-emerald-600">+{fmt(m.contribution)}</td>
                      <td className="p-3 text-purple-600">+{fmt(m.interestEarned)}</td>
                      <td className="p-3 font-semibold text-slate-900">{fmt(m.endingBalance)}</td>
                      <td className="p-3">{fmt(m.totalInterestEarned)}</td>
                      <td className="p-3 text-amber-600">{fmt(m.realEndingBalance)}</td>
                    </tr>
                  ))
                : results.yearlySchedule.map(y => (
                    <tr key={y.year} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">Year {y.year}</td>
                      <td className="p-3">{fmt(y.startingBalance)}</td>
                      <td className="p-3 text-emerald-600">+{fmt(y.annualContributions)}</td>
                      <td className="p-3 text-purple-600">+{fmt(y.interestEarned)}</td>
                      <td className="p-3 font-semibold text-slate-900">{fmt(y.endingBalance)}</td>
                      <td className="p-3">{fmt(y.totalInterestEarned)}</td>
                      <td className="p-3 text-amber-600">{fmt(y.realEndingBalance)}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default CompoundInterestCalculator;
