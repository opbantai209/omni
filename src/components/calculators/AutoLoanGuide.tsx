import React from 'react';
import {
  Car,
  DollarSign,
  TrendingDown,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  Percent,
  Calculator,
  BookOpen,
  Award,
  AlertTriangle,
  FileCheck,
  Bot,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AutoLoanGuide: React.FC = () => {
  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-white text-slate-800 font-sans">
      {/* Header Banner */}
      <header className="border-b border-slate-200 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700">
          <BookOpen className="w-3.5 h-3.5" /> Quantitative Auto Financing Master Guide
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          The Definitive Auto Financing & Loan Calculation Master Guide
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Auto financing is one of the most significant financial commitments a consumer makes. Navigating dealership finance offices, interest rate structures, tax implications, and depreciation schedules requires an exact understanding of loan mechanics. This comprehensive master guide breaks down the mathematics, structural variables, decision frameworks, and long-term financial impacts of auto loans.
        </p>
      </header>

      {/* 1. The Mathematical Engine of Auto Loan Amortization */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5">
          <Calculator className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-extrabold text-slate-900">
            1. The Mathematical Engine of Auto Loan Amortization
          </h2>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          An auto loan is a structured, installment-based debt instrument secured by the underlying motor vehicle. Understanding how every dollar of your monthly payment is allocated between interest charges and principal reduction is critical to avoiding predatory loan structures.
        </p>

        {/* Amortization Formula Card */}
        <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-lg border border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-blue-400">The Standard Amortization Formula</h3>
            <span className="text-3xs font-mono uppercase bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded border border-blue-700">
              Simple Interest Amortization
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Auto loans operate on a simple interest amortized schedule where interest accrues daily or monthly on the remaining unpaid principal balance. The fixed periodic payment P required to amortize a loan principal balance PV over n periods at a periodic interest rate r is derived from the standard present value equation:
          </p>

          <div className="p-4 bg-slate-800/90 rounded-2xl font-mono text-center text-lg sm:text-xl text-emerald-400 font-bold overflow-x-auto border border-slate-700">
            {"P = PV \\cdot \\frac{r(1 + r)^n}{(1 + r)^n - 1}"}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-300 pt-3 border-t border-slate-800">
            <div><strong className="text-white">P:</strong> Periodic Payment Amount</div>
            <div><strong className="text-white">PV:</strong> Present Value (Net Financed Principal)</div>
            <div><strong className="text-white">r:</strong> Periodic Rate (APR / Periods per Year)</div>
            <div><strong className="text-white">n:</strong> Total Payments (Years × Periods/Yr)</div>
          </div>
        </div>

        {/* Worked Example */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs text-slate-700">
          <h4 className="text-sm font-bold text-slate-900">Step-by-Step Worked Example:</h4>
          <p>For a financed balance of <strong>$30,000</strong> at an APR of <strong>6.0%</strong> over a <strong>60-month term</strong>:</p>
          <div className="font-mono bg-white p-4 rounded-xl border border-slate-200 text-slate-800 space-y-1 overflow-x-auto text-2xs sm:text-xs">
            <div>PV = $30,000</div>
            <div>r = 0.06 / 12 = 0.005</div>
            <div>n = 60</div>
            <div className="text-blue-600 font-bold pt-1">
              P = 30,000 × [0.005(1 + 0.005)⁶⁰] / [(1 + 0.005)⁶⁰ - 1] = 30,000 × [0.00674425 / 0.34885] = $579.98/month
            </div>
          </div>
        </div>

        {/* Daily Simple Interest Accrual Mechanics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Daily Simple Interest Accrual Mechanics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Most auto lenders utilize a Simple Interest Daily Basis methodology. Interest is calculated based on the exact unpaid principal on each day of the payment cycle:
            </p>
            <div className="p-3 bg-white border border-slate-200 rounded-xl font-mono text-xs text-purple-700 font-semibold">
              {"Daily Interest = Unpaid Principal \\cdot (APR / 365)"}
            </div>
            <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
              <li>Daily interest is calculated for the exact number of days elapsed since the last payment.</li>
              <li>Accrued daily interest is paid first; the remaining payment reduces principal.</li>
              <li>Late payments shift more of your installment to daily interest, extending full amortization.</li>
            </ul>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">APR vs. APY (Effective Annual Rate)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              While nominal APR reflects the non-compounded annual cost, the Effective Annual Rate (EAR) captures the true compounded financial impact across m periods:
            </p>
            <div className="p-3 bg-white border border-slate-200 rounded-xl font-mono text-xs text-emerald-700 font-semibold">
              {"EAR = (1 + APR / m)^m - 1"}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              For a 6.0% APR compounded monthly (m = 12):
              <br />
              <strong className="text-slate-900">{"EAR = (1 + 0.06/12)¹² - 1 = 6.167%"}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* 2. Structural Loan Variables & Upfront Costs */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5">
          <DollarSign className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-extrabold text-slate-900">
            2. Structural Loan Variables & Upfront Costs
          </h2>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Determining your Net Financed Principal requires mapping every cost line item between the vehicle's sticker price and the final loan contract.
        </p>

        {/* Itemized Principal Waterfall */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 font-mono text-xs text-slate-800">
          <h3 className="font-bold text-slate-900 font-sans text-sm mb-2">Net Financed Principal Calculation Waterfall:</h3>
          <div className="space-y-1">
            <div className="text-emerald-700">+ Agreed Vehicle Sales Price</div>
            <div className="text-blue-600">- Down Payment (Cash / Rebates)</div>
            <div className="text-blue-600">- Net Trade-In Equity (Trade-In Allowance - Loan Owed)</div>
            <div className="text-emerald-700">- State Trade-In Tax Savings (where applicable)</div>
            <div className="text-purple-700">+ State & Local Sales Tax</div>
            <div className="text-purple-700">+ Dealer Documentation & Registration Fees</div>
            <div className="border-t border-slate-300 pt-2 font-bold text-slate-900 text-sm">
              = Net Financed Principal (Base Loan Amount)
            </div>
          </div>
        </div>

        {/* The 20/4/10 Rule */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> The 20/4/10 Rule of Auto Financing
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-emerald-900">
            <div className="bg-white/80 p-4 rounded-xl border border-emerald-200/60 space-y-1">
              <span className="text-base font-black text-emerald-700 block">20% Down Payment</span>
              <p>Put down at least 20% in cash + trade equity to offset immediate Year 1 vehicle depreciation.</p>
            </div>
            <div className="bg-white/80 p-4 rounded-xl border border-emerald-200/60 space-y-1">
              <span className="text-base font-black text-emerald-700 block">4-Year Maximum Term</span>
              <p>Cap financing terms at 48 months (4 years) to minimize interest drag and avoid negative equity.</p>
            </div>
            <div className="bg-white/80 p-4 rounded-xl border border-emerald-200/60 space-y-1">
              <span className="text-base font-black text-emerald-700 block">10% Gross Income Limit</span>
              <p>Total monthly transport costs (loan + insurance + fuel + maintenance) ≤ 10% of gross monthly income.</p>
            </div>
          </div>
        </div>

        {/* Trade-In Mechanics & Negative Equity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 text-sm">Trade-In Mechanics: Positive vs. Negative Equity</h4>
            <p className="text-slate-600 leading-relaxed">
              Your trade-in vehicle acts as a cash offset only if its market value exceeds any outstanding debt tied to it:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-700">
              <li><strong>Positive Equity:</strong> Trade Allowance &gt; Loan Payoff. Directly lowers purchase price.</li>
              <li><strong>Negative Equity ("Underwater"):</strong> Trade Allowance &lt; Loan Payoff. Deficit must be paid cash or rolled in.</li>
            </ul>
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl space-y-1 mt-2">
              <strong className="block text-amber-950 font-bold">Financial Danger of Rolling Over Negative Debt:</strong>
              <p className="text-3xs text-amber-800 leading-relaxed">
                Owing $12,000 on a car worth $9,000 leaves $3,000 negative equity. Rolling this into a $30,000 new vehicle results in financing $33,000+ on a $30,000 asset, severely compounding depreciation risk.
              </p>
            </div>
          </div>

          {/* State Trade-In Tax Credit Mechanics */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 text-sm">State Trade-In Tax Credit Mechanics</h4>
            <p className="text-slate-600 leading-relaxed">
              In 42 states, trading in a vehicle reduces the taxable price base:
              <br />
              <strong className="text-slate-900">{"Taxable Base = max(0, Vehicle Purchase Price - Trade-In Allowance)"}</strong>
            </p>

            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-2.5">Variable</th>
                    <th className="py-2 px-2.5">Without Tax Credit</th>
                    <th className="py-2 px-2.5">With Tax Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-2xs">
                  <tr>
                    <td className="py-1.5 px-2.5 font-semibold">Vehicle Price</td>
                    <td className="py-1.5 px-2.5">$35,000</td>
                    <td className="py-1.5 px-2.5">$35,000</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2.5 font-semibold">Trade Allowance</td>
                    <td className="py-1.5 px-2.5">$10,000</td>
                    <td className="py-1.5 px-2.5">$10,000</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2.5 font-bold text-slate-900">Taxable Amount</td>
                    <td className="py-1.5 px-2.5">$35,000</td>
                    <td className="py-1.5 px-2.5 text-emerald-600 font-bold">$25,000</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2.5 font-semibold">Sales Tax (7%)</td>
                    <td className="py-1.5 px-2.5">$2,450</td>
                    <td className="py-1.5 px-2.5 text-emerald-600 font-bold">$1,750</td>
                  </tr>
                  <tr className="bg-emerald-50 font-bold text-emerald-900">
                    <td className="py-1.5 px-2.5">Tax Savings</td>
                    <td className="py-1.5 px-2.5">$0</td>
                    <td className="py-1.5 px-2.5">$700 Cash Saved</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Advanced Financing Decision Frameworks */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <h2 className="text-2xl font-extrabold text-slate-900">
            3. Advanced Financing Decision Frameworks
          </h2>
        </div>

        {/* 0% Promotional APR vs. Cash Back Rebate */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-900">
            0% Promotional APR vs. Cash Back Rebates Scenario Matrix
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Car manufacturers frequently offer buyers a choice between promotional financing (e.g., 0% or 0.9% APR) OR an upfront cash back rebate (e.g., $3,000 off MSRP) paired with standard market interest rates.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-blue-200 rounded-xl space-y-2">
              <span className="font-bold text-blue-600 uppercase text-3xs tracking-wider block">OPTION A: 0.0% Promotional APR</span>
              <ul className="space-y-1 text-slate-700 text-xs">
                <li>Financed Amount: <strong>$36,000 - $4,000 = $32,000</strong></li>
                <li>Monthly Payment: <strong>$32,000 / 60 = $533.33/mo</strong></li>
                <li>Total Interest Paid: <strong>$0.00</strong></li>
                <li className="text-sm font-black text-slate-900 pt-1 border-t border-slate-100">
                  Total Outlay: $32,000.00
                </li>
              </ul>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-slate-500 uppercase text-3xs tracking-wider block">OPTION B: $3,000 Cash Rebate + 6.5% Market APR</span>
              <ul className="space-y-1 text-slate-700 text-xs">
                <li>Financed Amount: <strong>$36,000 - $3,000 - $4,000 = $29,000</strong></li>
                <li>Monthly Payment: <strong>$567.81/mo</strong></li>
                <li>Total Interest Paid: <strong>$5,068.60</strong></li>
                <li className="text-sm font-black text-slate-900 pt-1 border-t border-slate-100">
                  Total Outlay: $34,068.60
                </li>
              </ul>
            </div>
          </div>

          <div className="p-3 bg-slate-900 text-white rounded-xl font-bold text-xs text-amber-400">
            NET DECISION: Option A (0.0% APR) saves $2,068.60 overall compared to Option B.
          </div>
        </div>

        {/* Accelerated Bi-Weekly vs. Monthly Payments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Accelerated Bi-Weekly vs. Monthly Payment Schedules</h3>
            <p className="text-slate-600 leading-relaxed">
              Standard monthly schedules have 12 payments per year. Accelerated bi-weekly structures charge half of your standard monthly payment every two weeks (26 half-payments = 13 full payments per year).
            </p>
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 text-2xs">
              <div className="font-bold text-slate-900">$30,000 Loan at 7.0% APR over 60 Months:</div>
              <div>Standard Monthly: $594.04/mo ($7,128.48/yr)</div>
              <div>Accelerated Bi-Weekly: $297.02 every 2 wks ($7,722.52/yr)</div>
              <div className="text-emerald-700 font-bold pt-1">
                Result: Paid off in 53.5 months (6.5 months early) saving $660.30 in interest!
              </div>
            </div>
          </div>

          {/* Extra Principal Payment Strategies */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Extra Principal Payment Impact ($30k Loan / 60 Mo / 6.5% APR)</h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-2">Structure</th>
                    <th className="py-2 px-2">Monthly</th>
                    <th className="py-2 px-2">Payoff</th>
                    <th className="py-2 px-2">Total Interest</th>
                    <th className="py-2 px-2">Savings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-2xs">
                  <tr>
                    <td className="py-1.5 px-2">Standard Minimum</td>
                    <td className="py-1.5 px-2">$586.98</td>
                    <td className="py-1.5 px-2">60 Mo</td>
                    <td className="py-1.5 px-2">$5,218.80</td>
                    <td className="py-1.5 px-2">$0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2">+ $50 Extra/Mo</td>
                    <td className="py-1.5 px-2">$636.98</td>
                    <td className="py-1.5 px-2">54 Mo</td>
                    <td className="py-1.5 px-2">$4,682.10</td>
                    <td className="py-1.5 px-2 text-emerald-600 font-bold">$536.70</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2">+ $100 Extra/Mo</td>
                    <td className="py-1.5 px-2">$686.98</td>
                    <td className="py-1.5 px-2">49 Mo</td>
                    <td className="py-1.5 px-2">$4,228.40</td>
                    <td className="py-1.5 px-2 text-emerald-600 font-bold">$990.40</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2">+ $200 Extra/Mo</td>
                    <td className="py-1.5 px-2">$786.98</td>
                    <td className="py-1.5 px-2">42 Mo</td>
                    <td className="py-1.5 px-2">$3,514.20</td>
                    <td className="py-1.5 px-2 text-emerald-600 font-bold">$1,704.60</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Total Cost of Ownership (TCO) & Depreciation Curves */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5">
          <TrendingDown className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-extrabold text-slate-900">
            4. Total Cost of Ownership (TCO) & Depreciation Curves
          </h2>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Focusing solely on monthly payment figures obscures the true economic cost of vehicle ownership. Vehicle depreciation represents the single largest invisible expense associated with automobile purchases.
        </p>

        {/* Depreciation Decay Model */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
          <h3 className="text-sm font-bold text-slate-900">Depreciation Model Dynamics</h3>
          <p className="text-slate-600 leading-relaxed">
            New vehicles follow a non-linear exponential decay curve: Year 1 drops 15%–25% immediately upon delivery, Years 2–5 depreciate 10%–15% annually, leaving Year 5 residual value at ~35%–50% MSRP.
          </p>

          <div className="p-4 bg-white border border-slate-200 rounded-xl font-mono text-center text-sm text-blue-700 font-bold overflow-x-auto">
            {"V(t) = V_0 \\cdot (1 - d_1) \\cdot \\prod_{i=2}^t (1 - d_i)"}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <h4 className="font-bold text-amber-950 text-xs">When GAP Insurance is Mandatory:</h4>
              <ul className="list-disc pl-4 text-3xs text-amber-800 space-y-0.5">
                <li>Down payment was less than 20%.</li>
                <li>Financing term is 60 months or longer.</li>
                <li>Negative trade equity was rolled into new balance.</li>
                <li>Vehicle depreciates at above-average rates (luxury/EVs).</li>
              </ul>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <h4 className="font-bold text-emerald-950 text-xs">When GAP Insurance is Unnecessary:</h4>
              <ul className="list-disc pl-4 text-3xs text-emerald-800 space-y-0.5">
                <li>Down payment was 20% or greater in cash.</li>
                <li>Financing term is short (36 to 48 months).</li>
                <li>Loan-to-Value (LTV) ratio stays consistently below 80%.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5-Year TCO Comprehensive Outlay Breakdown Table */}
        <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800">
          <h3 className="text-base font-bold text-blue-400">
            5-Year Total Cost of Ownership (TCO) Comprehensive Breakdown
          </h3>
          <p className="text-xs text-slate-300">
            Comprehensive economic commitment for a $35,000 new sedan financed over 60 months at 6.0% APR ($5,000 down):
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800 text-white font-bold border-b border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Expense Category</th>
                  <th className="py-2.5 px-3">5-Year Itemized Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-2xs">
                <tr>
                  <td className="py-1.5 px-3">Principal Financed ($30,000 after $5k Down)</td>
                  <td className="py-1.5 px-3 font-semibold text-white">$30,000.00</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3">Down Payment Cash Outlay</td>
                  <td className="py-1.5 px-3 font-semibold text-white">$5,000.00</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3">Total Financing Interest Accrued (6.0% APR)</td>
                  <td className="py-1.5 px-3 text-purple-400">$4,819.60</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3">State Sales Tax (7%) & Registration Fees</td>
                  <td className="py-1.5 px-3 text-blue-300">$3,050.00</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3">Auto Insurance Premiums ($1,500/yr avg)</td>
                  <td className="py-1.5 px-3 text-amber-300">$7,500.00</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3">Fuel Costs ($3.50/gal @ 28 MPG avg)</td>
                  <td className="py-1.5 px-3 text-amber-300">$7,500.00</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-3">Routine Maintenance, Tires, Brakes & Repairs</td>
                  <td className="py-1.5 px-3 text-amber-300">$4,200.00</td>
                </tr>
                <tr className="bg-slate-800/80 font-bold text-white text-xs">
                  <td className="py-2 px-3">Gross 5-Year Cash Outflow</td>
                  <td className="py-2 px-3 text-emerald-400">$62,069.60</td>
                </tr>
                <tr className="text-red-400">
                  <td className="py-1.5 px-3">Less Estimated Year-5 Vehicle Resale Value (42% MSRP)</td>
                  <td className="py-1.5 px-3">-$14,700.00</td>
                </tr>
                <tr className="bg-blue-950 font-extrabold text-amber-400 text-sm">
                  <td className="py-2.5 px-3">NET 5-YEAR TRUE COST OF OWNERSHIP</td>
                  <td className="py-2.5 px-3">$47,369.60</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. Strategic Loan Decision Matrices & FAQs */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5">
          <Award className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-extrabold text-slate-900">
            5. Strategic Loan Decision Matrices & FAQs
          </h2>
        </div>

        {/* Term Length Comparison Matrix */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900">Term Length Comparison Matrix</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Loan Term</th>
                  <th className="py-3 px-3">Monthly Level</th>
                  <th className="py-3 px-3">Interest Expense</th>
                  <th className="py-3 px-3">Depreciation Risk</th>
                  <th className="py-3 px-3">Recommended Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-2xs">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900">36 Months</td>
                  <td className="py-2.5 px-3 text-slate-800">Highest</td>
                  <td className="py-2.5 px-3 text-emerald-600 font-bold">Lowest</td>
                  <td className="py-2.5 px-3 text-emerald-600 font-bold">Minimal</td>
                  <td className="py-2.5 px-3">High cash flow, seeking lowest overall car cost.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900">48 Months</td>
                  <td className="py-2.5 px-3 text-slate-800">Moderately High</td>
                  <td className="py-2.5 px-3 text-emerald-600 font-bold">Low</td>
                  <td className="py-2.5 px-3 text-emerald-600 font-bold">Low</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-800">Standard benchmark, balanced cash flow & equity building.</td>
                </tr>
                <tr className="bg-blue-50/40">
                  <td className="py-2.5 px-3 font-bold text-slate-900">60 Months</td>
                  <td className="py-2.5 px-3 text-slate-800">Balanced</td>
                  <td className="py-2.5 px-3 text-amber-600 font-semibold">Moderate</td>
                  <td className="py-2.5 px-3 text-amber-600 font-semibold">Moderate</td>
                  <td className="py-2.5 px-3">Maximum prudent term for standard retail buyers.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900">72 Months</td>
                  <td className="py-2.5 px-3 text-slate-800">Low</td>
                  <td className="py-2.5 px-3 text-red-600 font-bold">High</td>
                  <td className="py-2.5 px-3 text-red-600 font-bold">High</td>
                  <td className="py-2.5 px-3">Requires mandatory GAP insurance; higher default risk.</td>
                </tr>
                <tr className="bg-red-50/20">
                  <td className="py-2.5 px-3 font-bold text-slate-900">84 Months</td>
                  <td className="py-2.5 px-3 text-slate-800">Lowest</td>
                  <td className="py-2.5 px-3 text-red-600 font-extrabold">Extreme</td>
                  <td className="py-2.5 px-3 text-red-600 font-extrabold">Severe</td>
                  <td className="py-2.5 px-3 text-red-700 font-bold">Not recommended; severe risk of compound negative equity.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Credit Tier Benchmarks */}
        <div className="space-y-3 pt-4">
          <h3 className="text-base font-bold text-slate-900">Credit Tier APR Benchmarks</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Credit Tier</th>
                  <th className="py-3 px-3">FICO Score Range</th>
                  <th className="py-3 px-3">New Car APR</th>
                  <th className="py-3 px-3">Used Car APR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-2xs">
                <tr>
                  <td className="py-2 px-3 font-bold text-emerald-700">Super Prime</td>
                  <td className="py-2 px-3 font-semibold">781 - 850</td>
                  <td className="py-2 px-3 text-emerald-600 font-bold">4.5% - 5.5%</td>
                  <td className="py-2 px-3 text-emerald-600 font-bold">6.0% - 7.0%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-blue-700">Prime</td>
                  <td className="py-2 px-3 font-semibold">661 - 780</td>
                  <td className="py-2 px-3 font-semibold">5.5% - 7.0%</td>
                  <td className="py-2 px-3 font-semibold">7.0% - 9.0%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-amber-700">Non-Prime</td>
                  <td className="py-2 px-3 font-semibold">601 - 660</td>
                  <td className="py-2 px-3 text-amber-600 font-semibold">8.5% - 11.5%</td>
                  <td className="py-2 px-3 text-amber-600 font-semibold">11.5% - 14.0%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold text-orange-700">Subprime</td>
                  <td className="py-2 px-3 font-semibold">501 - 600</td>
                  <td className="py-2 px-3 text-orange-600 font-semibold">12.0% - 16.0%</td>
                  <td className="py-2 px-3 text-orange-600 font-semibold">16.0% - 20.0%</td>
                </tr>
                <tr className="bg-red-50/20">
                  <td className="py-2 px-3 font-bold text-red-700">Deep Subprime</td>
                  <td className="py-2 px-3 font-semibold">300 - 500</td>
                  <td className="py-2 px-3 text-red-600 font-bold">16.0% - 22.0%+</td>
                  <td className="py-2 px-3 text-red-600 font-bold">20.0% - 28.0%+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical Auto Financing FAQs */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" /> Frequently Asked Questions (Technical Auto Financing)
          </h3>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm">
                Q1: Should I finance my auto loan through a credit union or dealership financing?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Credit unions are non-profit cooperatives that typically offer lower standard APRs (often 1.0% to 2.5% below commercial bank rates). Dealerships act as intermediaries that mark up wholesale lender rates ("dealer reserve"). However, dealerships occasionally offer manufacturer captive financing (e.g., 0% or 1.9% APR via Toyota Financial Services, Ford Credit) that credit unions cannot match. Always obtain credit union pre-approval prior to entering a dealership to establish a firm baseline interest rate.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm">
                Q2: What is a loan prepayment penalty, and how can I detect it?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                A prepayment penalty charges fees if you pay off the loan balance prior to maturity. While illegal on consumer auto loans in most jurisdictions, some subprime lenders utilize "precomputed interest" structures instead of simple interest accrual. Under precomputed interest, interest is locked in at contract signing; paying off early yields minimal interest savings. Ensure your contract explicitly specifies <strong>"Simple Interest Amortization" with No Prepayment Penalty</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm">
                Q3: How does refinancing an auto loan work, and when does it make sense?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Refinancing involves paying off an existing auto loan with a new loan featuring lower APR or altered duration. It makes economic sense when your credit score has improved significantly (e.g., jumping from 620 to 740), market interest rates have dropped, or you originally accepted dealer financing without shopping around. Avoid refinancing late in your loan lifecycle (e.g., Year 4 of a 5-year loan) as most interest charges have already been paid upfront due to amortization curve mechanics.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm">
                Q4: Is it better to put money down or invest the cash elsewhere?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                This decision depends on the spread between your auto loan interest rate and your net after-tax investment return. If your auto loan APR is 3.5% and low-risk market investments yield 6.0% after taxes, mathematically you maximize net worth by minimizing your down payment and investing cash flow. Conversely, if your auto loan APR is 7.5%, paying a larger down payment yields a guaranteed 7.5% risk-free return by avoiding interest charges—far outperforming most standard investments.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm">
                Q5: How do bi-weekly payments differ from standard monthly payments made twice a month?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                "Semi-monthly" payments mean paying twice a month (24 payments per year), which totals exactly 12 standard monthly payments. "Bi-weekly" payments occur every two weeks (26 payments per year), resulting in 13 full monthly payments annually. The extra full payment generated by bi-weekly structures goes entirely toward principal reduction, significantly reducing overall interest costs and loan duration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded AI System Prompt Callout */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500 text-white rounded-xl">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xs uppercase tracking-wider text-indigo-400 font-mono font-bold block">
              AI Financing Engine Active
            </span>
            <h3 className="text-lg sm:text-xl font-black">
              System Prompt: Expert Auto Loan & Financing Advisor Engine
            </h3>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The interactive <strong>AI Financing Advisor</strong> tab in the calculator above is pre-loaded with this quantitative prompt specification. It evaluates your loan inputs step-by-step, enforces 20/4/10 rule compliance, compares 0% APR vs cash rebates, generates alternative term matrices, and provides dealership negotiation tactics.
        </p>
      </section>
    </article>
  );
};
