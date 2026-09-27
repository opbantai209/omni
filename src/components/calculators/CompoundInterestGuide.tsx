import React from 'react';
import {
  Sparkles,
  TrendingUp,
  Percent,
  CheckCircle2,
  HelpCircle,
  FileText,
  Layers,
  ArrowRight,
  AlertTriangle,
  Award,
  DollarSign,
  Compass,
  Clock,
  ShieldAlert,
  Calculator,
  Zap,
  TrendingDown,
  PieChart,
} from 'lucide-react';

export const CompoundInterestGuide: React.FC = () => {
  return (
    <div className="w-full mt-12 pt-12 border-t border-slate-200 text-slate-800 space-y-16">
      {/* HEADER SECTION */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quantitative Financial Education & Strategy Guide</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          The Mathematics of Compound Interest: Wealth Accumulation & Exponential Growth Strategy
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-4xl leading-relaxed">
          Compound interest is the mathematical engine of long-term financial growth. Unlike simple interest, which calculates returns strictly on the initial principal, compound interest generates earnings on both the accumulated principal and previous interest gains.
        </p>
      </div>

      {/* 1. EXECUTIVE SUMMARY & CORE MECHANICS */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <div className="p-2 rounded-xl bg-blue-600 text-white">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            1. Executive Summary & Core Mechanics
          </h3>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          The primary force driving compound interest is time. Over short horizons, capital growth appears linear. Over multi-decade periods, reinvested earnings generate exponential acceleration—often referred to as the <strong>Snowball Effect</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 font-mono text-xs space-y-2">
            <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Simple Interest (Linear)</div>
            <div className="text-slate-900 font-extrabold text-sm sm:text-base">Growth = Principal × Rate × Time</div>
          </div>
          <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 font-mono text-xs space-y-2">
            <div className="font-bold text-blue-800 uppercase tracking-wider text-[10px]">Compound Interest (Exponential)</div>
            <div className="text-blue-950 font-extrabold text-sm sm:text-base">Growth = Principal × (1 + Rate)<sup>Time</sup></div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-md">
          <h4 className="text-lg font-bold text-blue-400 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            Simple vs. Compound Growth Over 30 Years
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            To illustrate the divergence, consider a <strong>$10,000 initial investment</strong> yielding an <strong>8% annual interest rate</strong> over <strong>30 years</strong>:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Simple Interest Yield</span>
              <div className="text-xl font-bold text-slate-200">$34,000</div>
              <p className="text-[11px] text-slate-400">Generates $800/yr flat. Total interest earned equals $24,000.</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-950/80 border border-blue-500/30 space-y-1">
              <span className="text-xs text-blue-300 font-medium">Monthly Compounding Yield</span>
              <div className="text-xl font-bold text-emerald-400">$109,357</div>
              <p className="text-[11px] text-blue-200">Earns interest on prior gains. Total interest earned equals $75,357 (<strong>3.2× simple yield</strong>).</p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
          <div className="font-bold text-emerald-900 flex items-center gap-2 text-sm sm:text-base">
            <Award className="w-5 h-5 text-emerald-600" />
            The Growth Tipping Point
          </div>
          <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
            The specific milestone in an investment lifecycle where annual compounding interest gains surpass total out-of-pocket contributions. Once a portfolio crosses this threshold, market yield drives faster portfolio expansion than personal savings deposits.
          </p>
        </div>
      </section>

      {/* 2. MATHEMATICAL FOUNDATIONS & DERIVATIONS */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <div className="p-2 rounded-xl bg-purple-600 text-white">
            <Calculator className="w-5 h-5" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            2. Mathematical Foundations & Derivations
          </h3>
        </div>

        {/* Standard Compound Interest */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
          <h4 className="text-base font-bold text-slate-900">Standard Compound Interest Formula</h4>
          <p className="text-xs text-slate-600">
            To compute the future value of a single principal sum compounded at discrete intervals:
          </p>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center font-mono text-base sm:text-lg font-bold text-slate-900 overflow-x-auto">
            A = P × (1 + r / n)<sup>n × t</sup>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 pt-2">
            <div><strong className="text-slate-900">A</strong> = Future Value</div>
            <div><strong className="text-slate-900">P</strong> = Initial Principal</div>
            <div><strong className="text-slate-900">r</strong> = Annual Rate (decimal)</div>
            <div><strong className="text-slate-900">n</strong> = Compounding frequency/yr</div>
            <div><strong className="text-slate-900">t</strong> = Years</div>
          </div>
        </div>

        {/* Annuity Series Formulas */}
        <div className="space-y-4">
          <h4 className="text-base font-bold text-slate-900">Future Value with Regular Periodic Contributions (Annuity Series)</h4>
          <p className="text-xs text-slate-600">
            When adding regular recurring deposits (PMT), the total accumulated value combines the compounded principal with an annuity series.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-700 tracking-wider">Ordinary Annuity (Deposits at END of period)</div>
              <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs sm:text-sm font-bold text-slate-800 text-center overflow-x-auto">
                A = P(1 + r/n)<sup>nt</sup> + PMT × [ ((1 + r/n)<sup>nt</sup> - 1) / (r/n) ]
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-700 tracking-wider">Annuity Due (Deposits at BEGINNING of period)</div>
              <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs sm:text-sm font-bold text-slate-800 text-center overflow-x-auto">
                A = P(1 + r/n)<sup>nt</sup> + PMT × [ ((1 + r/n)<sup>nt</sup> - 1) / (r/n) ] × (1 + r/n)
              </div>
            </div>
          </div>
        </div>

        {/* Rule of 72 Derivation */}
        <div className="p-6 rounded-3xl bg-indigo-50/70 border border-indigo-200 space-y-4">
          <h4 className="text-base font-bold text-slate-900">Mathematical Derivation of the "Rule of 72"</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Rule of 72 is a logarithmic approximation used to estimate the years (t) required to double an investment at a fixed interest rate (r).
          </p>

          <div className="p-4 rounded-2xl bg-white border border-indigo-100 space-y-3 font-mono text-xs text-slate-800">
            <div>1. Set compound growth equation to double principal: <strong className="text-indigo-900">2P = P(1 + r)<sup>t</sup></strong></div>
            <div>2. Divide both sides by P: <strong className="text-indigo-900">2 = (1 + r)<sup>t</sup></strong></div>
            <div>3. Take natural logarithm (ln) of both sides: <strong className="text-indigo-900">ln(2) = t · ln(1 + r)</strong></div>
            <div>4. Solve for doubling time t: <strong className="text-indigo-900">t = ln(2) / ln(1 + r)</strong></div>
            <div>5. Using ln(2) ≈ 0.693147 and Taylor series expansion where ln(1 + r) ≈ r: <strong className="text-indigo-900">t ≈ 0.693 / r</strong></div>
            <div>6. Adjustment for integer factors & market rates (5% to 10%): <strong className="text-indigo-900 text-sm">Doubling Time (Years) ≈ 72 / R</strong></div>
          </div>
        </div>

        {/* Fisher Real Return Equation */}
        <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-3">
          <h4 className="text-base font-bold text-slate-900">Inflation-Adjusted Real Return (The Fisher Equation)</h4>
          <p className="text-xs text-slate-600">
            To measure true purchasing power rather than nominal dollar growth, portfolio yields must account for consumer price index (CPI) inflation using the Fisher Equation:
          </p>
          <div className="p-4 rounded-2xl bg-white border border-amber-200 text-center font-mono text-sm font-bold text-amber-950">
            r<sub>real</sub> = ((1 + r<sub>nominal</sub>) / (1 + i<sub>inflation</sub>)) - 1
          </div>
        </div>
      </section>

      {/* 3. EMPIRICAL CASE STUDIES & COMPARATIVE MODELS */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <div className="p-2 rounded-xl bg-emerald-600 text-white">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            3. Empirical Case Studies & Comparative Models
          </h3>
        </div>

        {/* Case Study 1: Investor A vs B vs C */}
        <div className="space-y-4">
          <h4 className="text-base font-bold text-slate-900">Case Study 1: The Cost of Waiting (Investor A vs. Investor B vs. Investor C)</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            This scenario measures portfolio values at Age 60 under a constant 8% annual return (compounded monthly).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
              <strong className="text-blue-900 block text-sm">Investor A (Early Starter)</strong>
              <p className="text-slate-600">Invests $300/month from age 20 to 30 (10 years), then stops contributing entirely. Out-of-pocket: $36,000.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block text-sm">Investor B (Consistent Saver)</strong>
              <p className="text-slate-600">Starts at age 30 and invests $300/month continuously until age 60 (30 years). Out-of-pocket: $108,000.</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
              <strong className="text-amber-900 block text-sm">Investor C (Late Catch-Up)</strong>
              <p className="text-slate-600">Starts at age 40 and doubles contributions to $600/month until age 60 (20 years). Out-of-pocket: $144,000.</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                <tr>
                  <th className="p-3">Metric</th>
                  <th className="p-3 text-blue-900 bg-blue-50/50">Investor A (Ages 20–30)</th>
                  <th className="p-3">Investor B (Ages 30–60)</th>
                  <th className="p-3">Investor C (Ages 40–60)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                <tr>
                  <td className="p-3 font-semibold font-sans">Monthly Contribution</td>
                  <td className="p-3 bg-blue-50/30">$300</td>
                  <td className="p-3">$300</td>
                  <td className="p-3">$600</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold font-sans">Contribution Horizon</td>
                  <td className="p-3 bg-blue-50/30">10 Years</td>
                  <td className="p-3">30 Years</td>
                  <td className="p-3">20 Years</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold font-sans">Total Cash Invested</td>
                  <td className="p-3 bg-blue-50/30">$36,000</td>
                  <td className="p-3">$108,000</td>
                  <td className="p-3">$144,000</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold font-sans">Portfolio Value at Age 30</td>
                  <td className="p-3 bg-blue-50/30">$54,884</td>
                  <td className="p-3">$0</td>
                  <td className="p-3">$0</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold font-sans">Portfolio Value at Age 40</td>
                  <td className="p-3 bg-blue-50/30">$119,005</td>
                  <td className="p-3">$54,884</td>
                  <td className="p-3">$0</td>
                </tr>
                <tr className="bg-emerald-50/60 font-bold text-emerald-950">
                  <td className="p-3 font-sans">Portfolio Value at Age 60</td>
                  <td className="p-3 text-blue-950 bg-blue-100/60">$600,190</td>
                  <td className="p-3">$447,108</td>
                  <td className="p-3">$353,412</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold font-sans">Net Gain (Interest Earned)</td>
                  <td className="p-3 bg-blue-50/30 text-emerald-700 font-bold">$564,190</td>
                  <td className="p-3 text-emerald-700 font-bold">$339,108</td>
                  <td className="p-3 text-emerald-700 font-bold">$209,412</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 font-medium">
            <strong>Key Insight:</strong> Investor A invested 66% less money than Investor B and 75% less money than Investor C, yet ended up with the largest fortune ($600,190) because their money had 40 full years to compound uninterrupted.
          </div>
        </div>

        {/* Case Study 2: Compounding Frequencies */}
        <div className="space-y-4">
          <h4 className="text-base font-bold text-slate-900">Case Study 2: Impact of Compounding Frequencies</h4>
          <p className="text-xs text-slate-600">
            Comparison of a $100,000 initial balance yielding an 8% APR over 20 years across different compounding cycles:
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                <tr>
                  <th className="p-3">Compounding Interval</th>
                  <th className="p-3">Frequency (n)</th>
                  <th className="p-3">Formula / Mechanics</th>
                  <th className="p-3">Final Balance (20 Yrs)</th>
                  <th className="p-3">Effective Yield (APY)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                <tr>
                  <td className="p-3 font-sans font-semibold">Annual</td>
                  <td className="p-3">1</td>
                  <td className="p-3">$100,000(1.08)<sup>20</sup></td>
                  <td className="p-3 font-bold">$466,095.71</td>
                  <td className="p-3 text-blue-600">8.000%</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-semibold">Semi-Annual</td>
                  <td className="p-3">2</td>
                  <td className="p-3">$100,000(1.04)<sup>40</sup></td>
                  <td className="p-3 font-bold">$480,102.06</td>
                  <td className="p-3 text-blue-600">8.160%</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-semibold">Quarterly</td>
                  <td className="p-3">4</td>
                  <td className="p-3">$100,000(1.02)<sup>80</sup></td>
                  <td className="p-3 font-bold">$487,543.92</td>
                  <td className="p-3 text-blue-600">8.243%</td>
                </tr>
                <tr className="bg-blue-50/40">
                  <td className="p-3 font-sans font-semibold text-blue-900">Monthly</td>
                  <td className="p-3 font-bold text-blue-900">12</td>
                  <td className="p-3">$100,000(1 + 0.08/12)<sup>240</sup></td>
                  <td className="p-3 font-bold text-blue-900">$492,680.28</td>
                  <td className="p-3 text-blue-600 font-bold">8.300%</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-semibold">Daily</td>
                  <td className="p-3">365</td>
                  <td className="p-3">$100,000(1 + 0.08/365)<sup>7300</sup></td>
                  <td className="p-3 font-bold">$495,216.38</td>
                  <td className="p-3 text-blue-600">8.328%</td>
                </tr>
                <tr className="bg-slate-100/60 font-bold">
                  <td className="p-3 font-sans">Continuous</td>
                  <td className="p-3">∞</td>
                  <td className="p-3">$100,000 · e<sup>(0.08 × 20)</sup></td>
                  <td className="p-3 text-purple-900">$495,303.24</td>
                  <td className="p-3 text-purple-600">8.329%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. FINANCIAL DRAG FACTORS: FEE EROSION, TAXES & INFLATION */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <div className="p-2 rounded-xl bg-red-600 text-white">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            4. Financial Drag Factors: Fee Erosion, Taxes & Inflation
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fee Drag */}
          <div className="p-6 rounded-3xl bg-red-50/70 border border-red-200 space-y-3">
            <h4 className="text-base font-bold text-red-950 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              1. Fee Drag Erosion
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              A seemingly small 1% fee significantly erodes compound growth over extended time horizons.
            </p>
            <div className="p-3 bg-white rounded-xl border border-red-200 text-xs font-mono space-y-1">
              <div>$100,000 for 30 yrs @ 8% gross:</div>
              <div className="text-emerald-700">0.05% Fee: $992,305</div>
              <div className="text-red-700">1.00% Fee: $761,225</div>
              <div className="text-red-900 font-bold pt-1 border-t">Wealth Lost: $231,080 (-23.2%)</div>
            </div>
          </div>

          {/* Tax Drag */}
          <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-3">
            <h4 className="text-base font-bold text-amber-950 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-amber-600" />
              2. Tax Drag Structural Impact
            </h4>
            <div className="text-xs text-slate-600 space-y-1">
              <div><strong>Taxable:</strong> Dividends/gains taxed annually.</div>
              <div><strong>Tax-Deferred (401k/IRA):</strong> Tax-free growth, taxed upon withdrawal.</div>
              <div><strong>Roth IRA:</strong> Post-tax dollars, 100% TAX-FREE growth & withdrawals.</div>
            </div>
            <p className="text-xs text-amber-900 font-medium pt-1">
              Over 30 yrs at 8% gross, $10k grows to $100,627 in a Roth IRA vs. $57,435 in a taxable account losing 2% to dividend/capital gains drag.
            </p>
          </div>

          {/* Inflation Sensitivity */}
          <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 space-y-3">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-600" />
              3. Inflation Sensitivity
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nominal portfolio growth does not equate to real purchasing power growth. At a 2.5% CPI baseline:
            </p>
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-1">
              <div>$1,000,000 in 20 yrs = <strong>$610,271 real value</strong></div>
              <div>$1,000,000 in 30 yrs = <strong>$476,743 real value</strong></div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STRATEGY IMPLEMENTATION & EXECUTION MECHANICS */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <div className="p-2 rounded-xl bg-blue-600 text-white">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            5. Strategy Implementation & Execution Mechanics
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-blue-50/80 border border-blue-200 space-y-3">
            <h4 className="text-base font-bold text-blue-950">1. Annual Contribution Escalation (Step-Up Method)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Increasing monthly contributions in tandem with annual wage increases accelerates compound progress:
            </p>
            <div className="p-3 bg-white rounded-xl font-mono text-xs text-blue-900 font-bold border border-blue-200 text-center">
              Contribution<sub>Year N</sub> = Base Deposit × (1 + S)<sup>N - 1</sup>
            </div>
            <p className="text-xs text-blue-900">
              Stepping up a $500/month investment by 3% every year over 25 years increases total contributions by 43%, while boosting final portfolio value by <strong>over 65%</strong>.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-indigo-50/80 border border-indigo-200 space-y-3">
            <h4 className="text-base font-bold text-indigo-950">2. Dollar-Cost Averaging (DCA) vs. Lump-Sum</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Lump-Sum Investing:</strong> Deploying all available capital immediately maximizes time in the market, outperforming DCA approximately 66% of the time over multi-decade spans due to positive market drift.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Dollar-Cost Averaging:</strong> Splitting capital into recurring fixed deposits mitigates sequence-of-returns risk and prevents behavioral missteps during drawdowns.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            6. Frequently Asked Questions (FAQ)
          </h3>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
            <h4 className="text-sm font-bold text-slate-900">What is a realistic rate of return to assume for long-term planning?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              For multi-decade planning based on historical broad-market equity performance (e.g., the S&P 500 from 1926 to present), a 9% to 10% nominal rate or a 6.5% to 7% inflation-adjusted real rate serves as a baseline assumption for all-equity portfolios. Conservative or blended asset allocations (such as 60/40 stocks/bonds) typically range between 5% and 7% nominal.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
            <h4 className="text-sm font-bold text-slate-900">What is the difference between APR and APY?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>APR (Annual Percentage Rate):</strong> The stated simple annual interest rate without taking compounding periods into account.
              <br />
              <strong>APY (Annual Percentage Yield):</strong> The actual effective annual yield including compounding effects, calculated as: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">APY = (1 + r/n)<sup>n</sup> - 1</code>.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
            <h4 className="text-sm font-bold text-slate-900">How do Dividend Reinvestment Plans (DRIP) affect compound returns?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              DRIP automatically uses cash dividends paid by stock holdings or index funds to buy additional fractional shares. Reinvesting dividend income increases the total underlying share count, ensuring that future dividend distributions apply to a progressively larger base of shares.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompoundInterestGuide;
