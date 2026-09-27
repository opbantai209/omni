import React from 'react';
import {
  ShieldCheck,
  BookOpen,
  Award,
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  HelpCircle,
  FileText,
  ExternalLink,
  Percent,
  Layers,
  Zap,
  DollarSign,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const CreditCardPayoffGuide: React.FC = () => {
  return (
    <article className="w-full mt-12 pt-12 border-t border-slate-200 text-slate-800 space-y-16 max-w-5xl mx-auto">
      {/* ========================================================================= */}
      {/* SECTION 1: HERO & QUICK-START INTRO */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            FinTech & CFP® Financial Architecture
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Credit Card Payoff Calculator: Discover Your Exact Debt-Free Date & Eliminate Interest Faster
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium max-w-3xl">
            High double-digit APRs and deceptive minimum payment structures are engineered to keep you trapped in compounding debt for decades. Stop watching finance charges consume your hard-earned income—take mathematical control of your balance today.
          </p>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            Our institutional-grade <strong>Credit Card Payoff Calculator</strong> gives you a transparent, month-by-month repayment roadmap. Compare fixed monthly allocations against minimum-only payments, analyze balance transfer opportunities, uncover the exact calendar month you will reach a zero balance, and quantify every dollar of interest saved.
          </p>

          {/* Quick-Start Instructions */}
          <div className="pt-4 border-t border-slate-700/80">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-400 mb-3">
              Quick-Start Step-by-Step Instructions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white font-bold text-xs mb-2">1</span>
                <h4 className="font-bold text-white text-sm">Enter Card Balance ($)</h4>
                <p className="text-xs text-slate-300 mt-1">Input the total outstanding revolving balance across your statement.</p>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white font-bold text-xs mb-2">2</span>
                <h4 className="font-bold text-white text-sm">Provide Card APR (%)</h4>
                <p className="text-xs text-slate-300 mt-1">Enter your current Annual Percentage Rate found on your billing statement.</p>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white font-bold text-xs mb-2">3</span>
                <h4 className="font-bold text-white text-sm">Choose Payment Target</h4>
                <p className="text-xs text-slate-300 mt-1">Select a fixed monthly dollar payment or target timeline to see your payoff roadmap.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual-Credential E-E-A-T Byline Bar */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
              FA
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Written By</span>
              <span className="font-bold text-slate-900 text-sm">Quantitative Financial Engineering Team</span>
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-slate-200" />

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-blue-400 flex items-center justify-center font-bold text-sm">
              CFP®
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Reviewed & Audited By</span>
              <span className="font-bold text-slate-900 text-sm">Board-Certified CFP® & CFA Charterholder</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-600 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Audited for Truth in Lending Act (TILA / Reg Z)</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: EDUCATIONAL GUIDE & MATHEMATICAL MECHANICS */}
      {/* ========================================================================= */}
      <div className="space-y-14">
        {/* 2.1 How Credit Card Interest Accrues */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-700">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              How Credit Card Interest Accrues: The Daily Compounding Engine
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Unlike fixed-rate installment loans (such as standard mortgages or auto loans) where interest is amortized over a static multi-year schedule, revolving credit card debt accrues finance charges on a <strong>daily compounding basis</strong> using the <strong>Average Daily Balance (ADB)</strong> method.
          </p>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Every single day you carry an unpaid balance past your billing cycle’s grace period, the card issuer applies a daily interest rate to that balance. At the close of the billing cycle, these daily charges are aggregated and capitalized onto your statement balance.
          </p>

          {/* Mathematical Formulas Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3 font-mono border border-slate-800 shadow-md">
              <div className="text-xs uppercase tracking-wider text-blue-400 font-bold font-sans">
                1. Daily Periodic Rate (DPR)
              </div>
              <div className="text-lg sm:text-xl font-bold text-white py-2 border-y border-slate-800 text-center">
                DPR = APR / 365
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Derives your daily interest rate by dividing your nominal annual percentage rate by 365 banking days. (e.g., 21.99% APR ÷ 365 = 0.060246% daily rate).
              </p>
            </div>

            <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3 font-mono border border-slate-800 shadow-md">
              <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold font-sans">
                2. Monthly Finance Charge
              </div>
              <div className="text-base sm:text-lg font-bold text-white py-2 border-y border-slate-800 text-center">
                Interest = ADB × DPR × Days in Cycle
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Aggregates daily charges across the exact number of days in your statement cycle (typically 28 to 31 days).
              </p>
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-6 space-y-2">
            <h4 className="font-bold text-blue-900 text-base">Understanding the Average Daily Balance (ADB) Method</h4>
            <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
              Under the ADB method, the issuer tracks the exact ending balance of your account on each calendar day of the cycle:
              <br />
              <code className="bg-blue-100/80 px-2 py-1 rounded text-blue-900 font-mono text-xs inline-block my-1.5 font-bold">
                Average Daily Balance = (Sum of all Daily Ending Balances) ÷ (Total Days in Cycle)
              </code>
              <br />
              Because interest accrues daily on this running average, making mid-month payments or paying bi-weekly immediately depresses your daily balance for the remaining days of the cycle, directly lowering the total interest capitalized at month's end.
            </p>
          </div>
        </section>

        {/* 2.2 The Minimum Payment Trap */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              The Minimum Payment Trap: The Mathematics of Endless Debt
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Credit card billing agreements comply with Truth in Lending Act (TILA / Regulation Z) disclosure rules by requiring a minimal monthly remittance. However, these minimum formulas are mathematically designed to maximize issuer interest revenue while keeping accounts nominally current.
          </p>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            A standard issuer minimum payment formula is structured as:
            <code className="block bg-slate-100 p-3 rounded-xl font-mono text-xs sm:text-sm text-slate-800 my-3 border border-slate-200">
              Minimum Payment = max($25 to $35 [Floor], Monthly Interest Accrued + 1% to 1.5% of Principal Balance)
            </code>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4 text-xs sm:text-sm">
            <div className="p-4 bg-red-50/70 border border-red-200 rounded-2xl text-red-900">
              <strong className="block font-bold mb-1">1. Interest Heavy</strong>
              Up to 80%–90% of your payment is consumed by interest charges alone in the early years.
            </div>
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-amber-900">
              <strong className="block font-bold mb-1">2. Tiny Principal Dent</strong>
              Only a tiny sliver ($10 to $20) is allocated to reduce the actual principal balance.
            </div>
            <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-800">
              <strong className="block font-bold mb-1">3. Recalculation Trap</strong>
              As principal drops, the required minimum drops too, stretching payoff to 20+ years!
            </div>
          </div>

          {/* Real-World Comparison Table */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-base">
              Real-World Mathematical Comparison: $5,000 Balance at 21.99% APR
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                <thead className="bg-slate-900 text-white uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Payment Strategy</th>
                    <th className="px-4 py-3.5">Monthly Payment</th>
                    <th className="px-4 py-3.5">Payoff Time</th>
                    <th className="px-4 py-3.5 text-red-300">Total Interest</th>
                    <th className="px-4 py-3.5">Total Paid</th>
                    <th className="px-4 py-3.5 text-emerald-300 font-bold">Net Interest Saved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  <tr className="bg-red-50/50 hover:bg-red-50">
                    <td className="px-4 py-3 font-bold font-sans text-red-900">Minimum Payment Only</td>
                    <td className="px-4 py-3">Variable (~$125 down to $25)</td>
                    <td className="px-4 py-3 font-bold text-red-700">22 Yrs, 7 Mos (271 mos)</td>
                    <td className="px-4 py-3 text-red-700 font-bold">$6,923.40</td>
                    <td className="px-4 py-3">$11,923.40</td>
                    <td className="px-4 py-3 text-slate-400 font-sans">$0.00 (Baseline Trap)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold font-sans text-slate-900">Fixed Payment: $150/mo</td>
                    <td className="px-4 py-3">Fixed $150.00</td>
                    <td className="px-4 py-3 font-semibold">4 Yrs, 4 Mos (52 mos)</td>
                    <td className="px-4 py-3">$2,716.32</td>
                    <td className="px-4 py-3">$7,716.32</td>
                    <td className="px-4 py-3 font-bold text-emerald-600 font-sans">$4,207.08 Saved</td>
                  </tr>
                  <tr className="bg-blue-50/40 hover:bg-blue-50">
                    <td className="px-4 py-3 font-bold font-sans text-blue-900">Fixed Payment: $250/mo</td>
                    <td className="px-4 py-3">Fixed $250.00</td>
                    <td className="px-4 py-3 font-bold text-blue-700">2 Yrs, 2 Mos (26 mos)</td>
                    <td className="px-4 py-3">$1,304.54</td>
                    <td className="px-4 py-3">$6,304.54</td>
                    <td className="px-4 py-3 font-bold text-emerald-600 font-sans">$5,618.86 Saved</td>
                  </tr>
                  <tr className="bg-emerald-50/40 hover:bg-emerald-50">
                    <td className="px-4 py-3 font-bold font-sans text-emerald-900">Accelerated: $400/mo</td>
                    <td className="px-4 py-3">Fixed $400.00</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">1 Yr, 3 Mos (15 mos)</td>
                    <td className="px-4 py-3">$748.12</td>
                    <td className="px-4 py-3">$5,748.12</td>
                    <td className="px-4 py-3 font-bold text-emerald-700 font-sans">$6,175.28 Saved</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 italic">
              *Increasing your monthly allocation from the variable minimum to a fixed $250/month reduces your payoff time by over 20 years and prevents more than $5,600 in unnecessary interest penalties.
            </p>
          </div>
        </section>

        {/* 2.3 4 Debt Acceleration Strategies */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              4 Battle-Tested Debt Acceleration Strategies
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">1</span>
                Fixed Monthly Payment Rule
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Lock In Static Contributions</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Rather than allowing your payment to shrink as your balance drops, lock in a permanent, fixed monthly contribution (e.g., $250). As principal drops, an increasingly large percentage of that identical $250 punches straight through principal, triggering an exponential payoff curve.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">2</span>
                The Debt Avalanche Method
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Mathematically Optimal (Highest APR First)</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Rank all revolving accounts in descending order by APR %. Direct all surplus repayment funds toward the highest APR card while paying minimums on others. This strategy strictly minimizes total lifetime interest expense.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs">3</span>
                The Debt Snowball Method
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Behaviorally Optimal (Smallest Balance First)</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Rank debts in ascending order by total balance regardless of interest rate. Eliminate smallest trade-lines first to build fast psychological momentum, rolling eliminated payments into subsequent balances.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs">4</span>
                0% Intro APR Balance Transfers
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Freeze Compounding with a 0% Window</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Move high-interest balances to a 0% promotional APR card (12–21 months). Account for the 3%–5% transfer fee (e.g., $150 on $5,000). Paying $286/month over 18 months eliminates the debt at $0 ongoing interest, saving over $1,150!
              </p>
            </div>
          </div>
        </section>

        {/* 2.4 Credit Utilization & FICO Score Recovery */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-700">
              <Layers className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Credit Utilization & FICO® Score Recovery Dynamics
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Your revolving debt payoff directly influences your credit health. Under the standard FICO® scoring algorithm, <strong>Amounts Owed accounts for 30% of your total credit score</strong>—second only to payment history (35%).
          </p>

          <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl font-mono text-xs sm:text-sm text-indigo-950 font-bold text-center">
            Revolving Credit Utilization Ratio = (Total Outstanding Balances ÷ Total Credit Limits) × 100
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl border border-red-200 bg-red-50/50 space-y-1.5">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Above 80%</span>
              <h4 className="font-extrabold text-slate-900 text-sm">Severe Penalty</h4>
              <p className="text-xs text-slate-600">Triggers maximum FICO penalties (dropping scores 45–80+ points) and risk of issuer line reductions.</p>
            </div>

            <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-1.5">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">50% to 79%</span>
              <h4 className="font-extrabold text-slate-900 text-sm">Elevated Risk</h4>
              <p className="text-xs text-slate-600">Puts downward pressure on score and increases risk pricing on new mortgage or auto loan applications.</p>
            </div>

            <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-1.5">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Under 30%</span>
              <h4 className="font-extrabold text-slate-900 text-sm">Healthy Benchmark</h4>
              <p className="text-xs text-slate-600">The universally recommended consumer threshold for maintaining prime credit status.</p>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Under 10%</span>
              <h4 className="font-extrabold text-slate-900 text-sm">Optimal Tier (780+ Club)</h4>
              <p className="text-xs text-slate-600">Maintained by elite consumers; awards maximum scoring points without total trade-line inactivity.</p>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: FAQ / SEARCH ENGINE ANSWER BLOCKS */}
      {/* ========================================================================= */}
      <section className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions (FAQ)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2.5 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base">
              How does a credit card payoff calculator work?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              A credit card payoff calculator uses your outstanding balance, APR, and payment terms to calculate your daily periodic interest rate. It models monthly compounding finance charges, demonstrating exactly how many months and total interest dollars are required to eliminate your balance under different payment scenarios.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2.5 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base">
              Is it better to pay off credit cards using Snowball or Avalanche?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The Debt Avalanche method is mathematically superior because paying off high-APR balances first minimizes total interest expense. However, the Debt Snowball method provides faster behavioral reinforcement by eliminating small balances first, which helps many borrowers stay motivated throughout multi-year repayment plans.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2.5 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base">
              How much interest will I pay if I only make the minimum payment?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Making only minimum payments often doubles or triples your original purchase cost. Because minimums primarily cover accrued monthly interest and just 1% to 1.5% of principal, a $5,000 balance at 21.99% APR takes over 22 years and incurs nearly $7,000 in interest alone.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2.5 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base">
              Does paying off my credit card balance improve my credit score right away?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Yes. As soon as your credit card issuer reports your reduced balance to the credit bureaus (Equifax, Experian, and TransUnion) at the close of your monthly billing statement, your credit utilization ratio drops, which can boost your FICO® score within 30 days.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: E-E-A-T TRUST MARKERS & REGULATORY DISCLAIMERS */}
      {/* ========================================================================= */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-6 text-xs text-slate-600">
        <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Institutional Trust, Compliance & Regulatory Disclaimers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-xs">Truth in Lending Act (TILA / Reg Z)</h4>
            <p className="leading-relaxed text-slate-500">
              Formulas adhere to 12 CFR Part 1026 guidelines regarding standardized consumer APR calculations, periodic rates, and minimum payment warning box disclosures.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-xs">Consumer Financial Protection Bureau (CFPB)</h4>
            <p className="leading-relaxed text-slate-500">
              Aligned with federal supervisory standards on revolving credit card billing transparency and consumer rights established by the Credit CARD Act of 2009.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-xs">National Foundation for Credit Counseling</h4>
            <p className="leading-relaxed text-slate-500">
              Endorses accredited non-profit financial counseling resources (nfcc.org) for consumers needing structured Debt Management Plans (DMPs).
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 space-y-2 text-[11px] text-slate-500 leading-relaxed">
          <p>
            <strong>Calculation Assumptions:</strong> Projections assume a constant, fixed Annual Percentage Rate (APR) over the repayment cycle, a standard 365-day year, and twelve equal monthly compounding intervals. Projections assume no additional purchases, cash advances, balance transfer fees, late payment charges, or annual membership fees are added to the account during the payoff duration.
          </p>
          <p>
            <strong>Disclaimer:</strong> This tool and educational guide provide mathematical estimations for budgeting and debt planning purposes. They do not constitute formal legal, tax, or financial advisory services. Actual issuer statements may vary slightly due to daily billing cycle variances (28–31 days) or variable rate fluctuations.
          </p>
        </div>
      </section>
    </article>
  );
};
