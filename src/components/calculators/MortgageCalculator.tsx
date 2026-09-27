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
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Home,
  DollarSign,
  Percent,
  Download,
  Share2,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  Calculator,
  Check,
  Sliders,
  Bot,
  Send,
  User,
  Loader2,
  RefreshCw,
  Lightbulb,
  Building,
  Coins,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  MortgageInputs,
  calculateMortgage,
  downloadMortgageCSV,
} from '../../utils/mortgageEngine';
import { askMortgageAdvisor, ChatMessage } from '../../services/geminiMortgageAdvisor';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

export const MortgageCalculator: React.FC = () => {
  const chartRef = useRef<ChartJS<'line'> | null>(null);

  // Active View Tab State
  const [activeTab, setActiveTab] = useState<'breakdown' | 'schedule' | 'terms' | 'advisor'>('breakdown');

  // Input States
  const [homePrice, setHomePrice] = useState<number>(450000);
  const [downPaymentValue, setDownPaymentValue] = useState<number>(20);
  const [downPaymentType, setDownPaymentType] = useState<'amount' | 'percentage'>('percentage');
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [propertyTaxRate, setPropertyTaxRate] = useState<number>(1.2);
  const [homeInsurance, setHomeInsurance] = useState<number>(1500);
  const [pmiRate, setPmiRate] = useState<number>(0.85);
  const [hoaFees, setHoaFees] = useState<number>(150);

  // Payment Acceleration / Extra Payment
  const [extraPaymentMonthly, setExtraPaymentMonthly] = useState<number>(0);
  const [extraPaymentAnnual, setExtraPaymentAnnual] = useState<number>(0);
  const [extraPaymentOneTime, setExtraPaymentOneTime] = useState<number>(0);
  const [extraPaymentOneTimeMonth, setExtraPaymentOneTimeMonth] = useState<number>(1);

  // UI States
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
        if (params.has('price')) setHomePrice(Number(params.get('price')));
        if (params.has('dp')) setDownPaymentValue(Number(params.get('dp')));
        if (params.has('dpType')) setDownPaymentType(params.get('dpType') as 'amount' | 'percentage');
        if (params.has('term')) setLoanTermYears(Number(params.get('term')));
        if (params.has('apr')) setInterestRate(Number(params.get('apr')));
        if (params.has('tax')) setPropertyTaxRate(Number(params.get('tax')));
        if (params.has('ins')) setHomeInsurance(Number(params.get('ins')));
        if (params.has('pmi')) setPmiRate(Number(params.get('pmi')));
        if (params.has('hoa')) setHoaFees(Number(params.get('hoa')));
      }
    } catch {
      // ignore
    }
  }, []);

  const copyPermalink = () => {
    const params = new URLSearchParams();
    params.set('price', homePrice.toString());
    params.set('dp', downPaymentValue.toString());
    params.set('dpType', downPaymentType);
    params.set('term', loanTermYears.toString());
    params.set('apr', interestRate.toString());
    params.set('tax', propertyTaxRate.toString());
    params.set('ins', homeInsurance.toString());
    params.set('pmi', pmiRate.toString());
    params.set('hoa', hoaFees.toString());

    const baseUrl = window.location.href.split('#')[0];
    const fullUrl = `${baseUrl}#mortgage?${params.toString()}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const inputs: MortgageInputs = useMemo(
    () => ({
      homePrice,
      downPaymentValue,
      downPaymentType,
      loanTermYears,
      interestRate,
      propertyTaxRate,
      homeInsurance,
      pmiRate,
      hoaFees,
      extraPaymentMonthly,
      extraPaymentAnnual,
      extraPaymentOneTime,
      extraPaymentOneTimeMonth,
    }),
    [
      homePrice,
      downPaymentValue,
      downPaymentType,
      loanTermYears,
      interestRate,
      propertyTaxRate,
      homeInsurance,
      pmiRate,
      hoaFees,
      extraPaymentMonthly,
      extraPaymentAnnual,
      extraPaymentOneTime,
      extraPaymentOneTimeMonth,
    ]
  );

  const results = useMemo(() => calculateMortgage(inputs), [inputs]);

  const fmtCurrency = (val: number) =>
    `$${Math.round(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const handleSendAiMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || chatInput;
    if (!promptToSend.trim() || isAiLoading) return;

    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', text: promptToSend }];
    setChatHistory(newHistory);
    if (!customPrompt) setChatInput('');
    setIsAiLoading(true);

    const response = await askMortgageAdvisor(newHistory.slice(0, -1), promptToSend, inputs, results);
    setChatHistory([...newHistory, { role: 'model', text: response }]);
    setIsAiLoading(false);
  };

  const generateFullAnalysis = () => {
    handleSendAiMessage(
      'Please analyze my mortgage scenario: provide 1. Mortgage Payment & Principal Breakdown, 2. DTI & Housing Affordability Audit, 3. PMI Cancellation Schedule & LTV warnings, 4. Acceleration Options Matrix, and 5. Homebuying Negotiation Tactics.'
    );
  };

  // Pie chart datasets for monthly payment breakdown (PITI + HOA)
  const pieData = {
    labels: ['P&I', 'Property Tax', 'Home Insurance', 'PMI', 'HOA Fee'],
    datasets: [
      {
        data: [
          results.basePrincipalAndInterest,
          results.monthlyPropertyTax,
          results.monthlyHomeInsurance,
          results.initialMonthlyPmi,
          results.monthlyHoa,
        ],
        backgroundColor: ['#2563eb', '#ef4444', '#10b981', '#f59e0b', '#6366f1'],
        borderWidth: 0,
      },
    ],
  };

  const lineChartData = {
    labels: results.monthlySchedule.map((s) => `Yr ${Math.ceil(s.period / 12)}`),
    datasets: [
      {
        label: 'Loan Balance',
        data: results.monthlySchedule.map((s) => s.endingBalance),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        borderWidth: 2.5,
        fill: true,
        pointRadius: 0,
      },
      {
        label: 'Cumulative Interest Paid',
        data: results.monthlySchedule.map((s) => s.totalInterestPaid),
        borderColor: '#a855f7',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Top Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Advanced Mortgage Calculator & Homebuying Advisor
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Calculate PITI, PMI thresholds, HOA offsets, accelerated payoffs & consult AI underwriters
              </p>
            </div>
          </div>
        </div>

        {/* Share & Download actions */}
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
            onClick={() => downloadMortgageCSV(results)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
          >
            <Download className="w-3.5 h-3.5" /> Export Amortization CSV
          </button>
        </div>
      </div>

      {/* Mode navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('breakdown')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap ${
            activeTab === 'breakdown'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building className="w-4 h-4" /> Monthly Payment Breakdown
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap ${
            activeTab === 'schedule'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calculator className="w-4 h-4 text-purple-500" /> Amortization Schedule
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap ${
            activeTab === 'terms'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Coins className="w-4 h-4 text-emerald-500" /> Compare Term Durations
        </button>
        <button
          onClick={() => setActiveTab('advisor')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-lg border-b-2 transition whitespace-nowrap ${
            activeTab === 'advisor'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <Bot className="w-4 h-4 text-indigo-600" /> AI Homebuying Advisor
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Input Sidebar Column */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" /> Home Purchase Parameters
            </h2>
            <span className="text-xs text-slate-400">Live Updating</span>
          </div>

          {/* Home Price Input & Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
              <label htmlFor="mort-calc-home-price">Home Purchase Price</label>
              <span className="text-blue-600 font-extrabold">{fmtCurrency(homePrice)}</span>
            </div>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="mort-calc-home-price"
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(Math.max(0, Number(e.target.value)))}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              aria-label="Home purchase price slider"
              type="range"
              min="50000"
              max="2000000"
              step="10000"
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Down Payment Option with $ / % Toggle */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
              <label htmlFor="mort-calc-down-payment">Down Payment</label>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">
                  {fmtCurrency(results.downPaymentAmount)}
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
                id="mort-calc-down-payment"
                type="number"
                value={downPaymentValue}
                onChange={(e) => setDownPaymentValue(Math.max(0, Number(e.target.value)))}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Interest Rate & Term selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="mort-calc-interest-rate" className="text-xs font-semibold text-slate-700">Interest Rate (APR %)</label>
              <input
                id="mort-calc-interest-rate"
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="mort-calc-loan-term" className="text-xs font-semibold text-slate-700">Loan Term</label>
              <select
                id="mort-calc-loan-term"
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                <option value={30}>30 Years</option>
                <option value={20}>20 Years</option>
                <option value={15}>15 Years</option>
                <option value={10}>10 Years</option>
              </select>
            </div>
          </div>

          {/* Property Taxes, Home Insurance, PMI, HOA */}
          <div className="border-t border-slate-100 pt-4 space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Taxes, Insurance & Escrow Fees</span>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="mort-calc-tax-rate" className="text-xs font-semibold text-slate-700">Property Tax Rate (%)</label>
                <input
                  id="mort-calc-tax-rate"
                  type="number"
                  step="0.01"
                  value={propertyTaxRate}
                  onChange={(e) => setPropertyTaxRate(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="mort-calc-home-ins" className="text-xs font-semibold text-slate-700">Home Insurance ($/yr)</label>
                <input
                  id="mort-calc-home-ins"
                  type="number"
                  value={homeInsurance}
                  onChange={(e) => setHomeInsurance(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="mort-calc-pmi" className="text-xs font-semibold text-slate-700">PMI Rate (%)</label>
                <input
                  id="mort-calc-pmi"
                  type="number"
                  step="0.01"
                  value={pmiRate}
                  onChange={(e) => setPmiRate(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="mort-calc-hoa" className="text-xs font-semibold text-slate-700">HOA Fees ($/mo)</label>
                <input
                  id="mort-calc-hoa"
                  type="number"
                  value={hoaFees}
                  onChange={(e) => setHoaFees(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {/* Extra Payment Plan Accelerator */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-emerald-600" /> Payoff Accelerator Plan
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label htmlFor="mort-calc-extra-mo" className="text-2xs font-semibold text-slate-600">Extra Monthly ($)</label>
                <input
                  id="mort-calc-extra-mo"
                  type="number"
                  value={extraPaymentMonthly}
                  onChange={(e) => setExtraPaymentMonthly(Math.max(0, Number(e.target.value)))}
                  className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="mort-calc-extra-yr" className="text-2xs font-semibold text-slate-600">Extra Annual ($)</label>
                <input
                  id="mort-calc-extra-yr"
                  type="number"
                  value={extraPaymentAnnual}
                  onChange={(e) => setExtraPaymentAnnual(Math.max(0, Number(e.target.value)))}
                  className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Tab Content Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: Payment PITI Breakdown */}
          {activeTab === 'breakdown' && (
            <div className="space-y-6">
              {/* Main Metric Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-600 text-white rounded-2xl p-5 shadow-sm space-y-1">
                  <span className="text-xs text-blue-100 font-medium block">Total Monthly PITI</span>
                  <p className="text-3xl font-black tracking-tight">
                    {fmtCurrency(results.totalInitialMonthlyPayment)}
                  </p>
                  <p className="text-3xs text-blue-200">Includes HOA, PMI & Taxes</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                  <span className="text-xs text-slate-500 font-medium block">Loan Amount</span>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {fmtCurrency(results.loanAmount)}
                  </p>
                  <p className="text-3xs text-slate-400">Net Financed Principal</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                  <span className="text-xs text-slate-500 font-medium block">Total Interest Paid</span>
                  <p className="text-2xl font-extrabold text-purple-600">
                    {fmtCurrency(results.totalInterestPaid)}
                  </p>
                  <p className="text-3xs text-slate-400">With accelerator plan</p>
                </div>
              </div>

              {/* PMI required warning if down payment < 20% */}
              {results.initialMonthlyPmi > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-amber-900">
                      Private Mortgage Insurance (PMI) Active: {fmtCurrency(results.initialMonthlyPmi)}/mo
                    </p>
                    <p className="text-amber-700 leading-relaxed">
                      Your down payment is less than 20% of the home price. PMI is required until your outstanding principal balance is paid down to 80% LTV. Consider increasing your down payment by {fmtCurrency(homePrice * 0.2 - results.downPaymentAmount)} to eliminate this fee.
                    </p>
                  </div>
                </div>
              )}

              {/* Acceleration Plan Savings callout */}
              {(results.interestSavings > 0 || results.timeSavingsMonths > 0) && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-emerald-900">
                      Accelerator Plan Savings: Shaves {(results.timeSavingsMonths / 12).toFixed(1)} Years Off!
                    </p>
                    <p className="text-emerald-700 leading-relaxed">
                      Your extra payments save you <strong>{fmtCurrency(results.interestSavings)}</strong> in total compound interest and pay off your mortgage <strong>{results.timeSavingsMonths} months</strong> early!
                    </p>
                  </div>
                </div>
              )}

              {/* Pie Chart & Detailed Cost Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <div className="sm:col-span-5 flex flex-col justify-center items-center">
                  <span className="text-sm font-bold text-slate-900 mb-4 block">Housing Expense Split</span>
                  <div className="w-40 h-40">
                    <Doughnut data={pieData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                  </div>
                </div>

                <div className="sm:col-span-7 space-y-3.5 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 text-sm block">PITI + HOA Component Breakdown</span>

                  <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-blue-600 block"></span>
                      <span>Principal & Interest (P&I)</span>
                    </div>
                    <span className="font-bold text-slate-900">{fmtCurrency(results.basePrincipalAndInterest)}/mo</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-red-500 block"></span>
                      <span>Monthly Property Tax</span>
                    </div>
                    <span className="font-bold text-slate-900">{fmtCurrency(results.monthlyPropertyTax)}/mo</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-emerald-500 block"></span>
                      <span>Monthly Home Insurance</span>
                    </div>
                    <span className="font-bold text-slate-900">{fmtCurrency(results.monthlyHomeInsurance)}/mo</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-amber-500 block"></span>
                      <span>Private Mortgage Insurance (PMI)</span>
                    </div>
                    <span className="font-bold text-slate-900">{fmtCurrency(results.initialMonthlyPmi)}/mo</span>
                  </div>

                  <div className="flex justify-between items-center pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-indigo-500 block"></span>
                      <span>Monthly HOA Fees</span>
                    </div>
                    <span className="font-bold text-slate-900">{fmtCurrency(results.monthlyHoa)}/mo</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Line Chart */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900">Mortgage Balance vs. Cumulative Interest Paid</h3>
                  <span className="text-xs text-slate-400">30-Year Lifespan Amortization</span>
                </div>
                <div className="h-64">
                  <Line ref={chartRef} data={lineChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { ticks: { maxTicksLimit: 10 } } } }} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Amortization Schedule */}
          {activeTab === 'schedule' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Amortization Schedule Ledger</h3>
                  <p className="text-2xs text-slate-500">Track principal reduction and cumulative taxes, insurance, and interest paid</p>
                </div>
                <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs self-start">
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

              <div className="overflow-x-auto max-h-112 overflow-y-auto scrollbar-thin border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="sticky top-0 bg-slate-50 font-bold text-slate-950 border-b border-slate-200 z-10">
                    <tr>
                      <th className="py-2.5 px-3">{scheduleView === 'yearly' ? 'Year' : 'Period'}</th>
                      <th className="py-2.5 px-3">Starting ($)</th>
                      <th className="py-2.5 px-3">Principal ($)</th>
                      <th className="py-2.5 px-3">Interest ($)</th>
                      <th className="py-2.5 px-3">PMI ($)</th>
                      <th className="py-2.5 px-3">Tax & Ins ($)</th>
                      <th className="py-2.5 px-3">Ending ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {scheduleView === 'yearly'
                      ? results.yearlySchedule.map((row) => (
                          <tr key={row.year} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-bold text-slate-950">Year {row.year}</td>
                            <td className="py-2 px-3">{fmtCurrency(row.startingBalance)}</td>
                            <td className="py-2 px-3 text-emerald-600 font-semibold">{fmtCurrency(row.principalPaid)}</td>
                            <td className="py-2 px-3 text-purple-600">{fmtCurrency(row.interestPaid)}</td>
                            <td className="py-2 px-3 text-amber-600">{fmtCurrency(row.pmiPaid)}</td>
                            <td className="py-2 px-3 text-slate-500">{fmtCurrency(row.propertyTaxPaid + row.insurancePaid)}</td>
                            <td className="py-2 px-3 font-bold text-slate-900">{fmtCurrency(row.endingBalance)}</td>
                          </tr>
                        ))
                      : results.monthlySchedule.slice(0, 120).map((row) => (
                          <tr key={row.period} className="hover:bg-slate-50">
                            <td className="py-1.5 px-3 font-semibold text-slate-800">Mo {row.period}</td>
                            <td className="py-1.5 px-3">{fmtCurrency(row.startingBalance)}</td>
                            <td className="py-1.5 px-3 text-emerald-600">{fmtCurrency(row.principalPaid + row.extraPaid)}</td>
                            <td className="py-1.5 px-3 text-purple-600">{fmtCurrency(row.interestPaid)}</td>
                            <td className="py-1.5 px-3 text-amber-600">{fmtCurrency(row.pmiPaid)}</td>
                            <td className="py-1.5 px-3 text-slate-500">{fmtCurrency(row.propertyTaxPaid + row.insurancePaid)}</td>
                            <td className="py-1.5 px-3 font-bold text-slate-900">{fmtCurrency(row.endingBalance)}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Compare Term Options */}
          {activeTab === 'terms' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Term Comparison Analysis</h3>
                <p className="text-2xs text-slate-500">Compare monthly payment sizes against total compounding interest costs over different mortgage terms</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.termComparisons.map((tc) => (
                  <div
                    key={tc.termYears}
                    className={`p-4 rounded-xl border-2 space-y-2 ${
                      tc.termYears === loanTermYears ? 'border-blue-600 bg-blue-50/20' : 'border-slate-100 bg-slate-50/40'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900">{tc.termYears} Year Fixed Mortgage</span>
                      {tc.termYears === loanTermYears && (
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-3xs font-extrabold rounded-full">Active</span>
                      )}
                    </div>
                    <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                      <div className="flex justify-between">
                        <span>Monthly P&I:</span>
                        <span className="font-bold text-slate-900">{fmtCurrency(tc.monthlyP_I)}/mo</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Interest Paid:</span>
                        <span className="font-semibold text-purple-600">{fmtCurrency(tc.totalInterest)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200/40 pt-1.5">
                        <span>Total Cost:</span>
                        <span>{fmtCurrency(tc.totalCost)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AI Advisor Assistant */}
          {activeTab === 'advisor' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Expert Homebuying & Mortgage Advisor
                    </h3>
                    <p className="text-xs text-slate-500">
                      Powered by Gemini AI • Escrow, Underwriting, and seller credits negotiation strategy
                    </p>
                  </div>
                </div>

                <button
                  onClick={generateFullAnalysis}
                  disabled={isAiLoading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition disabled:opacity-50"
                >
                  {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate Full Advisory Audit
                </button>
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="space-y-2">
                <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Lightbulb className="w-3 h-3 text-amber-500" /> Quick Advisor Prompts:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Audit my debt-to-income (DTI) requirements',
                    'When can I remove PMI from this loan?',
                    'Evaluate seller-paid rate buy-downs vs price drops',
                    'Strategic negotiation playbook for closing costs',
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

              {/* Chat Log History */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-80 max-h-112 overflow-y-auto space-y-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Bot className="w-10 h-10 text-indigo-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-700">
                      Consult the AI Mortgage Advisor
                    </p>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Click <strong>"Generate Full Advisory Audit"</strong> or pick a quick question to review affordability, tax offsets, escrow strategies, or negotiate rate-locks.
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
                      Formulating underwriting analysis & rate-lock strategies...
                    </span>
                  </div>
                )}
              </div>

              {/* Input Chat Bar */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                  placeholder="Ask the AI Advisor anything about mortgages, loan options, or negotiations..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
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
                    title="Clear session"
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
export default MortgageCalculator;
