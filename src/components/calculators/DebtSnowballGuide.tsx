import React from 'react';
import {
  Sparkles,
  TrendingDown,
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
} from 'lucide-react';

export const DebtSnowballGuide: React.FC = () => {
  return (
    <div className="w-full mt-12 pt-12 border-t border-slate-200 text-slate-800 space-y-16">
      {/* HEADER */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Comprehensive Strategy & Educational Guide</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Understanding Debt Payoff: Snowball vs. Avalanche
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-4xl leading-relaxed">
          Choosing between the Debt Snowball and Debt Avalanche strategies is the single most critical decision in your debt freedom journey. While both strategies rely on the debt rollover effect—taking the minimum payment from a paid-off debt and adding it to the next target—they prioritize your debts using completely different philosophies.
        </p>
      </div>

      {/* DEBT ROLLOVER EFFECT SCHEMATIC */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
          <Layers className="w-4 h-4" />
          <span>Mechanics</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          The Debt Rollover Effect
        </h3>
        <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3 font-mono text-xs sm:text-sm overflow-x-auto">
          <div className="text-blue-400 font-bold">┌──────────────────────────────────────────────┐</div>
          <div className="text-white">│ Base Minimum Payments Pool                  │</div>
          <div className="text-blue-400 font-bold">└──────────────────────┬───────────────────────┘</div>
          <div className="text-slate-400 pl-4">│</div>
          <div className="text-blue-400 font-bold">┌──────────────────────▼───────────────────────┐</div>
          <div className="text-white">│ + Extra Monthly Budget                       │</div>
          <div className="text-blue-400 font-bold">└──────────────────────┬───────────────────────┘</div>
          <div className="text-slate-400 pl-4">│</div>
          <div className="text-blue-400 font-bold">┌──────────────────────▼───────────────────────┐</div>
          <div className="text-emerald-400">│ Target Debt #1 (Paid Off!)                   │</div>
          <div className="text-blue-400 font-bold">└──────────────────────┬───────────────────────┘</div>
          <div className="text-amber-400 pl-4">│ $ Rolling Over</div>
          <div className="text-blue-400 font-bold">┌──────────────────────▼───────────────────────┐</div>
          <div className="text-white">│ Target Debt #2 (Accelerated)                 │</div>
          <div className="text-blue-400 font-bold">└──────────────────────────────────────────────┘</div>
        </div>
      </section>

      {/* STRATEGY COMPARISON & REAL WORLD EXAMPLE */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
          <Compass className="w-4 h-4" />
          <span>Case Study</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Strategy Comparison: A Worked Real-World Example
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          To see how these two strategies perform in practice, consider a borrower with $16,500 in total debt across three separate accounts, plus an extra $300/month dedicated payoff budget:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-bold">Debt A (Store Card)</strong>
            <div className="text-slate-600">$500 balance | 24.99% APR | $25 min</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-bold">Debt B (Credit Card)</strong>
            <div className="text-slate-600">$4,000 balance | 19.99% APR | $110 min</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-bold">Debt C (Personal Loan)</strong>
            <div className="text-slate-600">$12,000 balance | 6.50% APR | $280 min</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-blue-900">
          <strong>Total Monthly Allocation:</strong> $25 + $110 + $280 + $300 extra = <strong>$715/month</strong>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                <th className="p-3">Parameter</th>
                <th className="p-3">Debt Snowball</th>
                <th className="p-3">Debt Avalanche</th>
                <th className="p-3">Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              <tr>
                <td className="p-3 font-semibold text-slate-900">Payoff Order</td>
                <td className="p-3">Debt A → Debt B → Debt C</td>
                <td className="p-3">Debt A → Debt B → Debt C</td>
                <td className="p-3 text-emerald-700">*Same Order</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">First Milestone</td>
                <td className="p-3">Month 1 (Debt A eliminated)</td>
                <td className="p-3">Month 1 (Debt A eliminated)</td>
                <td className="p-3 text-emerald-700">0 Months</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Total Debt Freedom</td>
                <td className="p-3">26 Months</td>
                <td className="p-3">26 Months</td>
                <td className="p-3 text-emerald-700">0 Months</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Total Interest Paid</td>
                <td className="p-3">~$1,385</td>
                <td className="p-3">~$1,385</td>
                <td className="p-3 text-emerald-700">$0</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 italic">
          *Note: In scenarios where the smallest balance also carries the highest interest rate, both methods align perfectly. However, when high balances carry the highest rates, the strategies diverge dramatically.
        </p>
      </section>

      {/* DIVERGENT SCENARIO */}
      <section className="p-6 sm:p-8 rounded-3xl bg-amber-50/50 border border-amber-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
          <AlertTriangle className="w-4 h-4" />
          <span>Divergent Scenario</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          When High Balance Meets High Interest
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          If Debt C ($12,000) had the 24.99% APR and Debt A ($500) had a 6.50% APR:
        </p>
        <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
          <li><strong>Debt Snowball:</strong> Focuses on Debt A first ($500), delivering a win in Month 1, but allows the 24.99% interest on Debt C to compound rapidly.</li>
          <li><strong>Debt Avalanche:</strong> Focuses on Debt C ($12,000) first. It takes roughly 16 months to eliminate the first debt, but saves over $1,800 in total interest compared to the Snowball method.</li>
        </ul>
      </section>

      {/* BEHAVIORAL PSYCHOLOGY VS MATH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700">
            <Award className="w-4 h-4" />
            <span>Behavioral Psychology</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">The Snowball Case</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Academic research from Harvard Business School and Northwestern University's Kellogg School of Management indicates that winning early wins the game.
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 list-disc list-inside">
            <li>Eliminating smaller balances quickly provides a tangible sense of accomplishment and releases dopamine.</li>
            <li>Fewer open accounts reduce cognitive load and financial stress.</li>
            <li>Borrowers using the Snowball method are statistically more likely to stick with their plan to total completion without relapsing.</li>
          </ul>
        </section>

        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <Percent className="w-4 h-4" />
            <span>Mathematical Efficiency</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">The Avalanche Case</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The Debt Avalanche operates on unyielding financial logic: interest is financial waste. Eliminating high-APR debt first stops capital erosion.
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 list-disc list-inside">
            <li>Every dollar saved in interest directly reduces the total lifespan of your debt burden.</li>
            <li>Best suited for disciplined, analytical individuals who are motivated by long-term spreadsheet performance rather than emotional milestones.</li>
          </ul>
        </section>
      </div>

      {/* THE HYBRID APPROACH */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
          <Sparkles className="w-4 h-4" />
          <span>Hybrid Strategy</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          The Hybrid Approach: The "Snow-Avalanche"
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          If you are torn between emotional momentum and financial logic, implement the Hybrid Method:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <strong className="text-slate-900 block text-base">Phase 1: Quick Wins</strong>
            <p className="text-slate-600">
              Use the Snowball method to eliminate any debt under $1,000 regardless of APR. This quickly reduces your total number of bills from 5 or 6 down to 1 or 2.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <strong className="text-slate-900 block text-base">Phase 2: Financial Efficiency</strong>
            <p className="text-slate-600">
              Once small "nuisance" debts are wiped out, immediately switch to the Avalanche method, directing all monthly rollover funds to the remaining debt with the highest APR.
            </p>
          </div>
        </div>
      </section>

      {/* CRITICAL PITFALLS */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700">
          <AlertTriangle className="w-4 h-4" />
          <span>Risk Mitigation</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Critical Pitfalls to Avoid During Debt Payoff
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
            <strong className="text-slate-900 block font-bold">Closing Accounts Immediately</strong>
            <p className="text-slate-600">
              Closing credit cards after paying them to $0 reduces your overall available credit limit, spiking your credit utilization ratio and lowering your credit score. Keep accounts open with $0 balances unless they carry expensive annual fees.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
            <strong className="text-slate-900 block font-bold">Zero Emergency Savings Buffer</strong>
            <p className="text-slate-600">
              Directing 100% of excess cash toward debt without keeping a $1,000 starter emergency fund forces you to rely on credit cards when unexpected expenses occur, breaking your momentum.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
            <strong className="text-slate-900 block font-bold">Ignoring Variable Interest Rates</strong>
            <p className="text-slate-600">
              Credit card APRs fluctuate with federal benchmark rate adjustments. Audit your account APRs quarterly to ensure your Avalanche prioritization order remains accurate.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
            <strong className="text-slate-900 block font-bold">Falling for the "Minimum Payment Trap"</strong>
            <p className="text-slate-600">
              Minimum payments shrink as your principal decreases. Never reduce your monthly contribution when minimum required payments drop—keep your total budget locked until all debt is gone.
            </p>
          </div>
        </div>
      </section>

      {/* ADVANCED MATHEMATICAL MODELING & ALGORITHMIC MECHANICS */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700">
          <Percent className="w-4 h-4" />
          <span>Advanced Engine Architecture</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Advanced Mathematical Modeling & Algorithmic Mechanics
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          To build an enterprise-grade debt optimization engine, simple fixed-APR compounding is insufficient. Real-world financial modeling requires accounting for variable interest rates, dynamic minimum payment functions, promotional 0% APR step-ups, deferred interest mechanics, and tax-adjusted effective interest rates.
        </p>

        <div className="space-y-6 text-xs sm:text-sm">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-base">1. Dynamic Debt Compounding & Payment Allocation</h4>
            <p className="text-slate-600 leading-relaxed">
              For a set of <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">K</span> debts at month <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">t</span>, the unpaid balance <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">B_{'{i, t}'}</span> for debt <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">i</span> evolves according to the piecewise recursive equation:
            </p>
            <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
              B_{'{i, t}'} = max(0, B_{'{i, t-1}'} + I_{'{i, t}'} - P_{'{i, t}'})
            </div>
            <p className="text-slate-600 leading-relaxed">
              Where accrued interest <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">I_{'{i, t}'}</span> is calculated via monthly periodic compounding:
            </p>
            <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
              I_{'{i, t}'} = B_{'{i, t-1}'} × (r_i(t) / 12)
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-base">2. Deferred Interest vs. Promotional 0% APR</h4>
            <p className="text-slate-600 leading-relaxed">
              Standard 0% APR pauses interest accrual during promotional windows. Deferred interest (cliffs) accumulates interest silently behind the scenes; if any balance remains at promotion expiration, cumulative interest is retroactively applied to the principal.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-base">3. Net Present Value (NPV) & Inflation Discounting</h4>
            <p className="text-slate-600 leading-relaxed">
              To account for purchasing power changes over multi-year horizons, total interest is discounted back to base-year dollars using expected annual inflation rate <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">π</span>:
            </p>
            <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
              NPV_Interest = Σ [ I_{'{t}'} / (1 + π / 12)^t ]
            </div>
          </div>
        </div>
      </section>

      {/* BALANCE TRANSFER ARBITRAGE & CONSOLIDATION INTEGRATION */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
          <TrendingDown className="w-4 h-4" />
          <span>Arbitrage Analysis</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Balance Transfer Arbitrage & Consolidation Integration
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Integrating debt consolidation loans or 0% APR balance transfer offers into a snowball or avalanche model alters the payoff timeline by resetting the baseline interest accretion rate. However, balance transfers incur upfront transaction fees that must be evaluated against projected interest savings.
        </p>

        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
          <h4 className="font-bold text-sm text-amber-400">Balance Transfer Break-Even Equation</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            When transferring a debt balance <span className="font-mono text-white">B₀</span> with active nominal rate <span className="font-mono text-white">r_orig</span> to promotional rate <span className="font-mono text-white">r_promo</span> for <span className="font-mono text-white">M_promo</span> months with transfer fee percentage <span className="font-mono text-white">f_transfer</span> (typically 3%–5%), the Net Financial Arbitrage Gain (<span className="font-mono text-emerald-400">ΔA</span>) is:
          </p>
          <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto">
            ΔA = Σ_{'{t=1}'}^{'{M_promo}'} ( B_t × r_orig / 12 ) - [ (B₀ × f_transfer) + Σ_{'{t=1}'}^{'{M_promo}'} ( B_t × r_promo / 12 ) ]
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-300">
              <strong className="block text-emerald-400 font-bold">Positive ΔA</strong>
              The balance transfer is financially advantageous.
            </div>
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/50 text-rose-300">
              <strong className="block text-rose-400 font-bold">Negative ΔA</strong>
              Upfront balance transfer fees outweigh interest savings over the promo window.
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                <th className="p-3">Scenario Parameter</th>
                <th className="p-3">Organic Avalanche</th>
                <th className="p-3">0% APR Transfer (3% Fee)</th>
                <th className="p-3">Consolidation Loan (Fixed 9.9%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td className="p-3 font-medium text-slate-900">Initial Debt</td>
                <td className="p-3">$10,000 at 24.99% APR</td>
                <td className="p-3">$10,000 at 0% APR (18 mos)</td>
                <td className="p-3">$10,000 at 9.99% APR</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-900">Upfront Fees</td>
                <td className="p-3">$0</td>
                <td className="p-3 text-amber-600 font-semibold">$300 (3%)</td>
                <td className="p-3">$0 (No origination fee)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-900">Monthly Payment</td>
                <td className="p-3">$400</td>
                <td className="p-3">$400</td>
                <td className="p-3">$400</td>
              </tr>
              <tr className="bg-emerald-50/50 font-semibold text-slate-900">
                <td className="p-3">Interest + Fees Paid</td>
                <td className="p-3 text-rose-600">~$2,850</td>
                <td className="p-3 text-emerald-700">$300</td>
                <td className="p-3 text-blue-700">~$920</td>
              </tr>
              <tr className="bg-slate-50 font-semibold text-slate-900">
                <td className="p-3">Time to Freedom</td>
                <td className="p-3">32 Months</td>
                <td className="p-3 text-emerald-700">26 Months</td>
                <td className="p-3 text-blue-700">28 Months</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CREDIT UTILIZATION SCORE TRAJECTORY MODELING */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
          <Award className="w-4 h-4" />
          <span>Credit Score Dynamics</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Credit Utilization Score Trajectory Modeling
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Credit scoring models (such as FICO 8/9 and VantageScore 3.0/4.0) weigh revolving credit utilization as roughly 30% of your total score. Aggregate utilization and individual account utilization are evaluated across key percentage risk bands:
        </p>

        <div className="p-4 rounded-xl bg-slate-900 text-indigo-300 font-mono text-xs overflow-x-auto text-center">
          Revolving Utilization Ratio (U) = Σ B_i,revolving / Σ L_i,limit
        </div>

        {/* UTILIZATION IMPACT TIERS VISUAL SCHEMATIC */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Utilization Impact Tiers on Credit Score
          </h4>
          <div className="space-y-3 font-mono text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-rose-900/80 text-rose-200 font-bold min-w-[90px] text-center">90%+ Tier</span>
              <span className="text-rose-400">────►</span>
              <span className="text-rose-200">Critical Score Penalty (High Default Risk)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-amber-900/80 text-amber-200 font-bold min-w-[90px] text-center">70% Tier</span>
              <span className="text-amber-400">────►</span>
              <span className="text-amber-200">Severe Drag</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-yellow-900/80 text-yellow-200 font-bold min-w-[90px] text-center">50% Tier</span>
              <span className="text-yellow-400">────►</span>
              <span className="text-yellow-200">Moderate Penalty</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-blue-900/80 text-blue-200 font-bold min-w-[90px] text-center">30% Tier</span>
              <span className="text-blue-400">────►</span>
              <span className="text-blue-200">Standard Threshold (Target Benchmark)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-emerald-900/80 text-emerald-200 font-bold min-w-[90px] text-center">&lt;10% Tier</span>
              <span className="text-emerald-400">────►</span>
              <span className="text-emerald-200">Optimal Scoring Range</span>
            </div>
          </div>
        </div>

        {/* SNOWBALL VS AVALANCHE RECOVERY CURVES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
            <strong className="text-blue-900 block font-bold text-base">Debt Snowball Credit Recovery Curve</strong>
            <p className="text-slate-700 leading-relaxed">
              Clears individual account balances to $0 faster. This rapidly drops individual card utilization ratios to 0%, eliminating maxed-out card flags (&gt;90% utilization) earlier in the timeline.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <strong className="text-emerald-900 block font-bold text-base">Debt Avalanche Credit Recovery Curve</strong>
            <p className="text-slate-700 leading-relaxed">
              Targets interest rate rather than balance relative to limit. While aggregate balance drops faster per dollar spent, individual high-utilization accounts may remain above 80% utilization longer, causing a slower initial credit score recovery curve despite greater total interest savings.
            </p>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
          <HelpCircle className="w-4 h-4" />
          <span>FAQ</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Frequently Asked Questions
        </h3>

        <div className="space-y-6 text-xs sm:text-sm">
          <div className="space-y-2">
            <strong className="text-slate-900 block text-base">Should I pay off debt or invest extra cash first?</strong>
            <p className="text-slate-600 leading-relaxed">
              Compare your debt's interest rate against guaranteed investment returns. If your debt APR exceeds 7% (e.g., credit cards or high-interest personal loans), paying it off offers a tax-free, guaranteed return equal to the APR. If your debt is low-interest (e.g., a 3.5% mortgage), investing in tax-advantaged accounts like a 401(k) match or IRA typically yields better long-term returns.
            </p>
          </div>

          <div className="space-y-2">
            <strong className="text-slate-900 block text-base">How does payment rollover work in this calculator?</strong>
            <p className="text-slate-600 leading-relaxed">
              When a debt balance reaches $0, its minimum payment requirement disappears. Our calculator automatically adds that freed-up amount to your "Extra Monthly Budget" pool and applies the combined total directly to the next debt in line according to your selected strategy.
            </p>
          </div>

          <div className="space-y-2">
            <strong className="text-slate-900 block text-base">Will aggressive debt payoff drop my credit score?</strong>
            <p className="text-slate-600 leading-relaxed">
              In the short term, paying off installment loans (like auto or personal loans) may cause a minor temporary dip because it reduces your active credit mix. However, aggressively lowering your revolving credit card balances drops your overall utilization rate, which generally provides a significant boost to your credit score over time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
