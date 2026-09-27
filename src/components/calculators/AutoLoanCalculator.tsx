import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import {
  Car,
  DollarSign,
  Percent,
  Download,
  FileText,
  Share2,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  Calculator,
  Check,
  CheckCircle2,
  Sliders,
  Bot,
  Send,
  User,
  Loader2,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import {
  AutoLoanInputs,
  calculateAutoLoan,
  calculate0PercentVsRebate,
  downloadAutoLoanCSV,
} from '../../utils/autoLoanEngine';
import { askAutoLoanAdvisor, ChatMessage } from '../../services/geminiAutoLoanAdvisor';

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

export const AutoLoanCalculator: React.FC = () => {
  const chartRef = useRef<ChartJS<'line'> | null>(null);

  // Active View Tab State
  const [activeTab, setActiveTab] = useState<'main' | 'rebate' | 'tco' | 'terms' | 'advisor'>('main');

  // Input States
  const [vehiclePrice, setVehiclePrice] = useState<number>(35000);
  const [downPaymentValue, setDownPaymentValue] = useState<number>(5000);
  const [downPaymentType, setDownPaymentType] = useState<'amount' | 'percentage'>('amount');
  const [tradeInValue, setTradeInValue] = useState<number>(6000);
  const [tradeInOwed, setTradeInOwed] = useState<number>(2000);
  const [applyTradeInTaxCredit, setApplyTradeInTaxCredit] = useState<boolean>(true);
  const [annualRate, setAnnualRate] = useState<number>(5.9);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(60);
  const [salesTaxRate, setSalesTaxRate] = useState<number>(7.0);
  const [dealerFees, setDealerFees] = useState<number>(600);
  const [financeFees, setFinanceFees] = useState<boolean>(true);
  const [paymentFrequency, setPaymentFrequency] = useState<'monthly' | 'biweekly'>('monthly');
  const [extraPayment, setExtraPayment] = useState<number>(0);

  // Secondary Mode States
  const [rebateAmount, setRebateAmount] = useState<number>(2500);
  const [standardApr, setStandardApr] = useState<number>(6.5);
  const [annualInsurance, setAnnualInsurance] = useState<number>(1800);
  const [annualMaintenance, setAnnualMaintenance] = useState<number>(1200);

  // UI Table View mode
  const [scheduleView, setScheduleView] = useState<'monthly' | 'yearly'>('yearly');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // AI Advisor Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Parse state from URL hash query string on load
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash.includes('?')) {
        const queryStr = hash.split('?')[1];
        const params = new URLSearchParams(queryStr);
        if (params.has('price')) setVehiclePrice(Number(params.get('price')));
        if (params.has('dp')) setDownPaymentValue(Number(params.get('dp')));
        if (params.has('dpType')) setDownPaymentType(params.get('dpType') as 'amount' | 'percentage');
        if (params.has('tradeVal')) setTradeInValue(Number(params.get('tradeVal')));
        if (params.has('tradeOwed')) setTradeInOwed(Number(params.get('tradeOwed')));
        if (params.has('apr')) setAnnualRate(Number(params.get('apr')));
        if (params.has('term')) setLoanTermMonths(Number(params.get('term')));
        if (params.has('tax')) setSalesTaxRate(Number(params.get('tax')));
        if (params.has('fees')) setDealerFees(Number(params.get('fees')));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const copyPermalink = () => {
    const params = new URLSearchParams();
    params.set('price', vehiclePrice.toString());
    params.set('dp', downPaymentValue.toString());
    params.set('dpType', downPaymentType);
    params.set('tradeVal', tradeInValue.toString());
    params.set('tradeOwed', tradeInOwed.toString());
    params.set('apr', annualRate.toString());
    params.set('term', loanTermMonths.toString());
    params.set('tax', salesTaxRate.toString());
    params.set('fees', dealerFees.toString());

    const baseUrl = window.location.href.split('#')[0];
    const fullUrl = `${baseUrl}#autoloan?${params.toString()}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Inputs object for calculation
  const inputs: AutoLoanInputs = useMemo(
    () => ({
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
      extraPayment,
      annualInsurance,
      annualMaintenance,
    }),
    [
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
      extraPayment,
      annualInsurance,
      annualMaintenance,
    ]
  );

  const results = useMemo(() => calculateAutoLoan(inputs), [inputs]);

  const rebateComparison = useMemo(
    () =>
      calculate0PercentVsRebate({
        vehiclePrice,
        downPayment:
          downPaymentType === 'percentage'
            ? (vehiclePrice * downPaymentValue) / 100
            : downPaymentValue,
        termMonths: loanTermMonths,
        promotionalApr: 0,
        standardApr,
        rebateAmount,
      }),
    [vehiclePrice, downPaymentType, downPaymentValue, loanTermMonths, standardApr, rebateAmount]
  );

  const fmtCurrency = (val: number) =>
    `$${Math.round(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  // AI Advisor Call
  const handleSendAiMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || chatInput;
    if (!promptToSend.trim() || isAiLoading) return;

    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', text: promptToSend }];
    setChatHistory(newHistory);
    if (!customPrompt) setChatInput('');
    setIsAiLoading(true);

    const response = await askAutoLoanAdvisor(newHistory.slice(0, -1), promptToSend, inputs, results);
    setChatHistory([...newHistory, { role: 'model', text: response }]);
    setIsAiLoading(false);
  };

  const generateFullAnalysis = () => {
    handleSendAiMessage(
      'Please analyze my complete auto loan scenario according to your Expert Advisor guidelines: include 1. Loan Summary & Principal Breakdown, 2. Monthly Payment & Amortization Mechanics, 3. Total Cost Analysis, 4. Alternative Term Matrix, and 5. Expert Recommendations & Dealership Negotiation Strategy.'
    );
  };

  // Chart Configuration
  const chartLabels = results.monthlySchedule.map((r) => `Mo ${r.month}`);
  const loanBalanceData = results.monthlySchedule.map((r) => r.endingBalance);
  const cumInterestData = results.monthlySchedule.map((r) => r.totalInterestPaid);
  const vehicleValueData = results.monthlySchedule.map((r) => r.vehicleValue);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Remaining Loan Balance',
        data: loanBalanceData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2.5,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'Cumulative Interest Paid',
        data: cumInterestData,
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderWidth: 2,
        borderDash: [4, 4],
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'Estimated Vehicle Market Value',
        data: vehicleValueData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        borderWidth: 2.5,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          font: { size: 11 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += fmtCurrency(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => `$${value / 1000}k`,
        },
        grid: {
          color: '#f1f5f9',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 12,
        },
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Auto Loan Calculator & Expert Advisor
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Calculate payments, trade-in equity, depreciation, underwater zones & AI Dealership Negotiation
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={copyPermalink}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Copy scenario permalink"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            {copiedLink ? 'Link Copied!' : 'Share Scenario'}
          </button>
          <button
            onClick={() => downloadAutoLoanCSV(results)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('main')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap ${
            activeTab === 'main'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4" /> Loan Payment & Amortization
        </button>
        <button
          onClick={() => setActiveTab('rebate')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap ${
            activeTab === 'rebate'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" /> 0% APR vs Cash Rebate
        </button>
        <button
          onClick={() => setActiveTab('tco')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap ${
            activeTab === 'tco'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <TrendingDown className="w-4 h-4 text-emerald-500" /> 5-Year True Ownership Cost (TCO)
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap ${
            activeTab === 'terms'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calculator className="w-4 h-4 text-purple-500" /> Side-by-Side Term Options
        </button>
        <button
          onClick={() => setActiveTab('advisor')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-lg border-b-2 transition whitespace-nowrap ${
            activeTab === 'advisor'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <Bot className="w-4 h-4 text-indigo-600" /> AI Financing Advisor
        </button>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Control Panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" /> Vehicle & Financing Inputs
            </h2>
            <span className="text-xs text-slate-400">Live Updating</span>
          </div>

          {/* Vehicle Purchase Price */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
              <label htmlFor="auto-calc-vehicle-price">Vehicle Purchase Price</label>
              <span className="text-blue-600 font-bold">{fmtCurrency(vehiclePrice)}</span>
            </div>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="auto-calc-vehicle-price"
                type="number"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(Math.max(0, Number(e.target.value)))}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              aria-label="Vehicle Purchase Price slider"
              type="range"
              min="5000"
              max="120000"
              step="500"
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Down Payment with $ / % Toggle */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
              <label htmlFor="auto-calc-down-payment">Down Payment</label>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">
                  {fmtCurrency(
                    downPaymentType === 'percentage'
                      ? (vehiclePrice * downPaymentValue) / 100
                      : downPaymentValue
                  )}
                </span>
                <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
                  <button
                    onClick={() => setDownPaymentType('amount')}
                    className={`px-2 py-0.5 rounded-md font-medium transition ${
                      downPaymentType === 'amount' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'
                    }`}
                  >
                    $
                  </button>
                  <button
                    onClick={() => setDownPaymentType('percentage')}
                    className={`px-2 py-0.5 rounded-md font-medium transition ${
                      downPaymentType === 'percentage' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'
                    }`}
                  >
                    %
                  </button>
                </div>
              </div>
            </div>
            <div className="relative">
              {downPaymentType === 'amount' ? (
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              ) : (
                <Percent className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              )}
              <input
                id="auto-calc-down-payment"
                type="number"
                value={downPaymentValue}
                onChange={(e) => setDownPaymentValue(Math.max(0, Number(e.target.value)))}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Trade-in Value & Outstanding Debt */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="auto-calc-trade-in-val" className="text-xs font-semibold text-slate-700">Trade-In Allowance ($)</label>
              <input
                id="auto-calc-trade-in-val"
                type="number"
                value={tradeInValue}
                onChange={(e) => setTradeInValue(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="auto-calc-trade-in-owed" className="text-xs font-semibold text-slate-700">Trade-In Owed ($)</label>
              <input
                id="auto-calc-trade-in-owed"
                type="number"
                value={tradeInOwed}
                onChange={(e) => setTradeInOwed(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className={`p-2.5 rounded-xl text-xs flex justify-between items-center ${
            results.netTradeInEquity >= 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
          }`}>
            <span>Net Trade Equity:</span>
            <span className="font-bold">
              {results.netTradeInEquity >= 0 ? `+${fmtCurrency(results.netTradeInEquity)}` : `-${fmtCurrency(Math.abs(results.netTradeInEquity))} (Negative Equity)`}
            </span>
          </div>

          {/* Interest Rate (APR %) & Loan Term */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="auto-calc-interest-rate" className="text-xs font-semibold text-slate-700">Interest Rate (APR %)</label>
              <input
                id="auto-calc-interest-rate"
                type="number"
                step="0.1"
                value={annualRate}
                onChange={(e) => setAnnualRate(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="auto-calc-loan-term" className="text-xs font-semibold text-slate-700">Loan Term (Months)</label>
              <select
                id="auto-calc-loan-term"
                value={loanTermMonths}
                onChange={(e) => setLoanTermMonths(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                <option value={24}>24 Months (2 Yrs)</option>
                <option value={36}>36 Months (3 Yrs)</option>
                <option value={48}>48 Months (4 Yrs)</option>
                <option value={60}>60 Months (5 Yrs)</option>
                <option value={72}>72 Months (6 Yrs)</option>
                <option value={84}>84 Months (7 Yrs)</option>
              </select>
            </div>
          </div>

          {/* Sales Tax & Dealer Fees Controls */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label htmlFor="auto-calc-sales-tax-rate" className="text-xs font-semibold text-slate-700">Sales Tax Rate (%)</label>
              <input
                id="auto-calc-sales-tax-rate"
                type="number"
                step="0.1"
                value={salesTaxRate}
                onChange={(e) => setSalesTaxRate(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="auto-calc-fees" className="text-xs font-semibold text-slate-700">Dealer Fees ($)</label>
              <input
                id="auto-calc-fees"
                type="number"
                value={dealerFees}
                onChange={(e) => setDealerFees(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Checkbox Toggles */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={applyTradeInTaxCredit}
                onChange={(e) => setApplyTradeInTaxCredit(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span>Apply Trade-In Tax Credit (Deduct trade allowance before tax)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={financeFees}
                onChange={(e) => setFinanceFees(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span>Finance Fees into Loan Principal (vs Cash Upfront)</span>
            </label>
          </div>

          {/* Payment Schedule & Acceleration */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
              <span>Payment Acceleration</span>
              <span className="text-blue-600">Frequency & Extra</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="auto-calc-pay-freq" className="text-2xs font-semibold text-slate-500">Frequency</label>
                <select
                  id="auto-calc-pay-freq"
                  value={paymentFrequency}
                  onChange={(e) => setPaymentFrequency(e.target.value as 'monthly' | 'biweekly')}
                  className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none"
                >
                  <option value="monthly">Monthly (12/yr)</option>
                  <option value="biweekly">Bi-Weekly (26/yr)</option>
                </select>
              </div>

              <div>
                <label htmlFor="auto-calc-extra-pmt" className="text-2xs font-semibold text-slate-500">Extra Payment ($)</label>
                <input
                  id="auto-calc-extra-pmt"
                  type="number"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(Math.max(0, Number(e.target.value)))}
                  className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Outputs & Visualizations */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: Main Loan & Amortization */}
          {activeTab === 'main' && (
            <div className="space-y-6">
              {/* Executive Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-blue-600 text-white rounded-2xl p-4 shadow-sm space-y-1">
                  <span className="text-xs text-blue-100 font-medium block">Regular Payment</span>
                  <p className="text-2xl font-extrabold tracking-tight">
                    {fmtCurrency(results.regularPayment)}
                  </p>
                  <p className="text-3xs text-blue-200">
                    {paymentFrequency === 'biweekly' ? 'Bi-weekly payment' : 'Monthly payment'}
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
                  <span className="text-xs text-slate-500 font-medium block">Financed Principal</span>
                  <p className="text-xl font-bold text-slate-900">
                    {fmtCurrency(results.netFinancedPrincipal)}
                  </p>
                  <p className="text-3xs text-slate-400">Net Financed</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
                  <span className="text-xs text-slate-500 font-medium block">Total Interest</span>
                  <p className="text-xl font-bold text-purple-600">
                    {fmtCurrency(results.totalInterestPaid)}
                  </p>
                  <p className="text-3xs text-slate-400">Over {loanTermMonths} months</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
                  <span className="text-xs text-slate-500 font-medium block">Total Out-of-Pocket</span>
                  <p className="text-xl font-bold text-emerald-600">
                    {fmtCurrency(results.totalOutofPocket)}
                  </p>
                  <p className="text-3xs text-slate-400">Incl. cash upfront</p>
                </div>
              </div>

              {/* Negative Equity Alert Callout */}
              {results.underwaterMonthsCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-amber-900">
                      Negative Equity ("Underwater") Warning: ~{results.underwaterMonthsCount} Months
                    </p>
                    <p className="text-amber-700 leading-relaxed">
                      Due to initial depreciation, your loan balance exceeds estimated vehicle value for the first{' '}
                      <strong>{results.underwaterMonthsCount} months</strong>. Consider GAP insurance or increasing your down payment.
                    </p>
                  </div>
                </div>
              )}

              {/* Dynamic Chart */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900">Loan Balance vs. Vehicle Market Value</h3>
                  <span className="text-xs text-slate-400">Depreciation Overlay</span>
                </div>
                <div className="h-72">
                  <Line ref={chartRef} data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* Amortization Schedule Table */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Amortization Schedule</h3>
                  <div className="flex items-center gap-2">
                    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
                      <button
                        onClick={() => setScheduleView('yearly')}
                        className={`px-3 py-1 rounded-md font-semibold transition ${
                          scheduleView === 'yearly' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'
                        }`}
                      >
                        Annual
                      </button>
                      <button
                        onClick={() => setScheduleView('monthly')}
                        className={`px-3 py-1 rounded-md font-semibold transition ${
                          scheduleView === 'monthly' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'
                        }`}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto max-h-80 overflow-y-auto scrollbar-thin">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="sticky top-0 bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">{scheduleView === 'yearly' ? 'Year' : 'Period'}</th>
                        <th className="py-2.5 px-3">Starting ($)</th>
                        <th className="py-2.5 px-3">Payment ($)</th>
                        <th className="py-2.5 px-3">Principal ($)</th>
                        <th className="py-2.5 px-3">Interest ($)</th>
                        <th className="py-2.5 px-3">Ending ($)</th>
                        <th className="py-2.5 px-3">Car Value ($)</th>
                        <th className="py-2.5 px-3">Equity ($)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {scheduleView === 'yearly'
                        ? results.yearlySchedule.map((row) => (
                            <tr key={row.year} className="hover:bg-slate-50 transition">
                              <td className="py-2 px-3 font-bold text-slate-900">Year {row.year}</td>
                              <td className="py-2 px-3">{fmtCurrency(row.startingBalance)}</td>
                              <td className="py-2 px-3 font-semibold">{fmtCurrency(row.totalPayments)}</td>
                              <td className="py-2 px-3 text-emerald-600">{fmtCurrency(row.principalPaid)}</td>
                              <td className="py-2 px-3 text-purple-600">{fmtCurrency(row.interestPaid)}</td>
                              <td className="py-2 px-3 font-bold text-slate-900">{fmtCurrency(row.endingBalance)}</td>
                              <td className="py-2 px-3 text-blue-600">{fmtCurrency(row.vehicleValue)}</td>
                              <td className={`py-2 px-3 font-bold ${row.equity < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                {row.equity >= 0 ? `+${fmtCurrency(row.equity)}` : `-${fmtCurrency(Math.abs(row.equity))}`}
                              </td>
                            </tr>
                          ))
                        : results.monthlySchedule.map((row) => (
                            <tr key={row.period} className="hover:bg-slate-50 transition">
                              <td className="py-1.5 px-3 font-semibold text-slate-900">P{row.period} (M{row.month})</td>
                              <td className="py-1.5 px-3">{fmtCurrency(row.startingBalance)}</td>
                              <td className="py-1.5 px-3 font-semibold">{fmtCurrency(row.payment)}</td>
                              <td className="py-1.5 px-3 text-emerald-600">{fmtCurrency(row.principalPaid)}</td>
                              <td className="py-1.5 px-3 text-purple-600">{fmtCurrency(row.interestPaid)}</td>
                              <td className="py-1.5 px-3 font-bold text-slate-900">{fmtCurrency(row.endingBalance)}</td>
                              <td className="py-1.5 px-3 text-blue-600">{fmtCurrency(row.vehicleValue)}</td>
                              <td className={`py-1.5 px-3 font-bold ${row.isUnderwater ? 'text-red-600' : 'text-emerald-600'}`}>
                                {row.equity >= 0 ? `+${fmtCurrency(row.equity)}` : `-${fmtCurrency(Math.abs(row.equity))}`}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 0% APR vs Cash Rebate */}
          {activeTab === 'rebate' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" /> 0% APR vs. Cash Back Rebate Calculator
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Compare promotional 0% interest against taking a cash rebate and financing at standard market rates.
                </p>
              </div>

              {/* Interactive Rebate Controls */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label htmlFor="auto-calc-rebate-amt" className="text-xs font-semibold text-slate-700 block mb-1">
                    Manufacturer Cash Rebate ($)
                  </label>
                  <input
                    id="auto-calc-rebate-amt"
                    type="number"
                    value={rebateAmount}
                    onChange={(e) => setRebateAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label htmlFor="auto-calc-std-apr" className="text-xs font-semibold text-slate-700 block mb-1">
                    Standard Market Rate (% APR)
                  </label>
                  <input
                    id="auto-calc-std-apr"
                    type="number"
                    step="0.1"
                    value={standardApr}
                    onChange={(e) => setStandardApr(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900"
                  />
                </div>
              </div>

              {/* Side-by-Side Comparison Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option A: Promo */}
                <div className={`p-5 rounded-2xl border-2 space-y-3 transition ${
                  rebateComparison.recommendedOption === 'promo'
                    ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                    : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Option A</span>
                    {rebateComparison.recommendedOption === 'promo' && (
                      <span className="px-2 py-0.5 bg-blue-600 text-white font-bold text-3xs rounded-full">
                        RECOMMENDED WINNER
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">0% Promotional APR</h4>
                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200/60 pt-3">
                    <div className="flex justify-between">
                      <span>Financed Amount:</span>
                      <span className="font-semibold">{fmtCurrency(rebateComparison.promoOption.financedAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Rate:</span>
                      <span className="font-semibold text-emerald-600">0.0% APR</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Payment:</span>
                      <span className="font-bold text-slate-900">{fmtCurrency(rebateComparison.promoOption.monthlyPayment)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200/60 pt-2">
                      <span>Total Cost:</span>
                      <span>{fmtCurrency(rebateComparison.promoOption.totalCost)}</span>
                    </div>
                  </div>
                </div>

                {/* Option B: Rebate */}
                <div className={`p-5 rounded-2xl border-2 space-y-3 transition ${
                  rebateComparison.recommendedOption === 'rebate'
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-sm'
                    : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Option B</span>
                    {rebateComparison.recommendedOption === 'rebate' && (
                      <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold text-3xs rounded-full">
                        RECOMMENDED WINNER
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{fmtCurrency(rebateAmount)} Cash Rebate</h4>
                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200/60 pt-3">
                    <div className="flex justify-between">
                      <span>Reduced Financed Amount:</span>
                      <span className="font-semibold">{fmtCurrency(rebateComparison.rebateOption.financedAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Rate:</span>
                      <span className="font-semibold text-purple-600">{standardApr}% APR</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Payment:</span>
                      <span className="font-bold text-slate-900">{fmtCurrency(rebateComparison.rebateOption.monthlyPayment)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200/60 pt-2">
                      <span>Total Cost:</span>
                      <span>{fmtCurrency(rebateComparison.rebateOption.totalCost)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation Callout */}
              <div className="p-4 bg-slate-900 text-white rounded-xl text-xs space-y-1">
                <p className="font-bold text-amber-400">
                  Savings Winner:{' '}
                  {rebateComparison.recommendedOption === 'promo'
                    ? `0% APR saves you ${fmtCurrency(rebateComparison.savings)} overall!`
                    : `Cash Rebate saves you ${fmtCurrency(rebateComparison.savings)} overall!`}
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Focus on cumulative overall outlay (Principal + Interest) rather than individual monthly payment size when evaluating dealership promotional financing.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Total Cost of Ownership (TCO) */}
          {activeTab === 'tco' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-emerald-500" /> 5-Year True Cost of Ownership (TCO)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Models operating expenses including insurance, routine maintenance, fuel, and depreciation beyond monthly principal & interest.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label htmlFor="auto-calc-annual-ins" className="text-xs font-semibold text-slate-700 block mb-1">Est. Annual Insurance ($)</label>
                  <input
                    id="auto-calc-annual-ins"
                    type="number"
                    value={annualInsurance}
                    onChange={(e) => setAnnualInsurance(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold"
                  />
                </div>
                <div>
                  <label htmlFor="auto-calc-annual-maint" className="text-xs font-semibold text-slate-700 block mb-1">Est. Annual Maintenance ($)</label>
                  <input
                    id="auto-calc-annual-maint"
                    type="number"
                    value={annualMaintenance}
                    onChange={(e) => setAnnualMaintenance(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>

              {/* TCO Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs text-slate-500 font-semibold block">5-Year TCO Summary</span>
                  <div className="text-2xl font-black text-slate-900">
                    {fmtCurrency(results.totalOutofPocket + (annualInsurance + annualMaintenance) * 5)}
                  </div>
                  <p className="text-xs text-slate-600">
                    Averages <strong>{fmtCurrency((results.totalOutofPocket + (annualInsurance + annualMaintenance) * 5) / 60)}/month</strong> true cost
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span>5-Year Loan Outlay:</span>
                    <span className="font-bold">{fmtCurrency(results.totalLoanCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>5-Year Insurance:</span>
                    <span className="font-bold">{fmtCurrency(annualInsurance * 5)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>5-Year Maintenance:</span>
                    <span className="font-bold">{fmtCurrency(annualMaintenance * 5)}</span>
                  </div>
                  <div className="flex justify-between text-red-600 border-t border-slate-200 pt-1">
                    <span>Upfront Cash Required:</span>
                    <span className="font-bold">{fmtCurrency(results.upfrontCashNeeded)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Side-by-Side Term Options */}
          {activeTab === 'terms' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-purple-500" /> Side-by-Side Term Options Matrix
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evaluate monthly payment vs total interest drag across 36, 48, 60, 72, and 84-month terms simultaneously.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3">Term</th>
                      <th className="py-3 px-3">Monthly Payment</th>
                      <th className="py-3 px-3">Total Interest</th>
                      <th className="py-3 px-3">Total Cost</th>
                      <th className="py-3 px-3">Underwater Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.termComparisons.map((opt) => (
                      <tr
                        key={opt.termMonths}
                        className={`hover:bg-slate-50 transition ${
                          opt.termMonths === loanTermMonths ? 'bg-blue-50/50 font-bold' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-extrabold text-slate-900">
                          {opt.termMonths} Months ({opt.termMonths / 12} Yrs)
                        </td>
                        <td className="py-3 px-3 text-blue-600 font-bold">{fmtCurrency(opt.monthlyPayment)}</td>
                        <td className="py-3 px-3 text-purple-600">{fmtCurrency(opt.totalInterest)}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{fmtCurrency(opt.totalCost)}</td>
                        <td className="py-3 px-3">
                          {opt.underwaterMonths > 0 ? (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md font-bold text-3xs">
                              {opt.underwaterMonths} months underwater
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold text-3xs">
                              0 months (Safe)
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: AI Financing Advisor Assistant */}
          {activeTab === 'advisor' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Expert Auto Loan & Financing Advisor
                    </h3>
                    <p className="text-xs text-slate-500">
                      Powered by Gemini AI Engine • Amortization, 20/4/10 Rule & Negotiation Assistant
                    </p>
                  </div>
                </div>

                <button
                  onClick={generateFullAnalysis}
                  disabled={isAiLoading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition disabled:opacity-50"
                >
                  {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate Full Advisory Breakdown
                </button>
              </div>

              {/* Preset Quick Question Chips */}
              <div className="space-y-2">
                <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Lightbulb className="w-3 h-3 text-amber-500" /> Quick Advisory Prompts:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Check my 20/4/10 rule compliance',
                    'Evaluate 0% APR vs $3,000 Cash Rebate',
                    'How do I avoid being underwater on this loan?',
                    'How to negotiate dealer doc fees and warranty markups?',
                    'What interest rate should I target for my credit score?',
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSendAiMessage(chip)}
                      disabled={isAiLoading}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition border border-indigo-100 text-left"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Message History Display */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-80 max-h-112 overflow-y-auto space-y-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Bot className="w-10 h-10 text-indigo-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-700">
                      No advisory session started yet.
                    </p>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Click <strong>"Generate Full Advisory Breakdown"</strong> or select a prompt above to consult the Expert Auto Financing Advisor using your live calculator state.
                    </p>
                  </div>
                ) : (
                  chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.role === 'model' && (
                        <div className="p-2 bg-indigo-600 text-white rounded-xl h-fit shrink-0">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}
                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed max-w-xl whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-none font-medium'
                            : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-tl-none space-y-2'
                        }`}
                      >
                        {msg.text}
                      </div>
                      {msg.role === 'user' && (
                        <div className="p-2 bg-slate-300 text-slate-700 rounded-xl h-fit shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))
                )}

                {isAiLoading && (
                  <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl w-fit">
                    <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                    <span className="text-xs text-indigo-700 font-semibold">
                      Analysing amortization math & dealership strategy...
                    </span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                  placeholder="Ask the AI Financing Advisor anything about your car loan, APR, or dealership offer..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleSendAiMessage()}
                  disabled={isAiLoading || !chatInput.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
                {chatHistory.length > 0 && (
                  <button
                    onClick={() => setChatHistory([])}
                    className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-medium transition"
                    title="Clear advisory chat"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
