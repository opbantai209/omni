import React from 'react';
import {
  ShieldCheck,
  TrendingDown,
  Percent,
  DollarSign,
  AlertTriangle,
  HelpCircle,
  FileText,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Scale,
} from 'lucide-react';

export const PersonalLoanGuide: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 space-y-12 text-slate-800">
      {/* SECTION 1: Comprehensive Alternatives Comparison Matrix */}
      <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Scale className="w-3.5 h-3.5" /> Financing Strategy
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            1. Comprehensive Alternatives Comparison Matrix
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Choosing a personal loan depends on how it compares to alternative financing methods. Use this breakdown to evaluate cost, risk, and speed across funding sources:
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500 text-xs">
              <tr>
                <th className="px-4 py-3.5">Financing Option</th>
                <th className="px-4 py-3.5">Asset Security</th>
                <th className="px-4 py-3.5">Typical APR Range</th>
                <th className="px-4 py-3.5">Funding Speed</th>
                <th className="px-4 py-3.5">Impact on Credit</th>
                <th className="px-4 py-3.5">Best Used For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-blue-50/40 hover:bg-blue-50/70 font-medium">
                <td className="px-4 py-3 font-bold text-blue-700">Personal Loan</td>
                <td className="px-4 py-3">Unsecured (None)</td>
                <td className="px-4 py-3 font-mono font-bold text-slate-900">6.99% – 35.99%</td>
                <td className="px-4 py-3">1 – 3 Business Days</td>
                <td className="px-4 py-3 text-xs">Hard inquiry; drops utilization</td>
                <td className="px-4 py-3 text-xs">Debt consolidation, fixed expenses</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-slate-900">HELOC / Home Equity Loan</td>
                <td className="px-4 py-3 text-amber-700 font-semibold">Secured (Home)</td>
                <td className="px-4 py-3 font-mono font-bold text-slate-900">7.50% – 12.00%</td>
                <td className="px-4 py-3">2 – 6 Weeks</td>
                <td className="px-4 py-3 text-xs">Hard inquiry; collateral risk</td>
                <td className="px-4 py-3 text-xs">Large home renovations ($30k+)</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-slate-900">0% Intro Credit Card</td>
                <td className="px-4 py-3">Unsecured (None)</td>
                <td className="px-4 py-3 font-mono font-bold text-emerald-700">0% (12–21 mos)</td>
                <td className="px-4 py-3">Instant to 7 Days</td>
                <td className="px-4 py-3 text-xs">High short-term utilization</td>
                <td className="px-4 py-3 text-xs">Payoffs under $10,000 in &lt;18 mos</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-slate-900">401(k) Loan</td>
                <td className="px-4 py-3 text-slate-600">Borrowing Own Funds</td>
                <td className="px-4 py-3 font-mono font-bold text-slate-900">Prime Rate + 1%</td>
                <td className="px-4 py-3">3 – 5 Business Days</td>
                <td className="px-4 py-3 text-xs text-emerald-700 font-semibold">Zero credit report impact</td>
                <td className="px-4 py-3 text-xs">Emergency liquidity; stable employment</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-slate-900">Peer-to-Peer (P2P) Loan</td>
                <td className="px-4 py-3">Unsecured (None)</td>
                <td className="px-4 py-3 font-mono font-bold text-slate-900">8.00% – 35.00%</td>
                <td className="px-4 py-3">3 – 7 Business Days</td>
                <td className="px-4 py-3 text-xs">Hard inquiry</td>
                <td className="px-4 py-3 text-xs">Niche borrowing profile / fair credit</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 2: Debt-to-Income (DTI) Qualification Engine */}
      <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Percent className="w-3.5 h-3.5" /> Underwriting Guidelines
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            2. Debt-to-Income (DTI) Qualification Engine
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Lenders evaluate your credit score to determine your interest rate, but they use your <strong>Debt-to-Income (DTI) Ratio</strong> to determine the maximum amount you can borrow.
          </p>
        </div>

        {/* Formula */}
        <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">How Lenders Calculate Your DTI Ratio:</h3>
          <div className="text-center py-3 px-4 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-base font-bold text-slate-800 overflow-x-auto">
            DTI Ratio (%) = ( Total Monthly Recurring Debt Obligations / Gross Monthly Pre-Tax Income ) × 100
          </div>
        </div>

        {/* What Counts vs Excluded */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
            <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> What Counts in Monthly Debt Obligations
            </h4>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              <li>Minimum payments on all credit cards</li>
              <li>Auto loan payments</li>
              <li>Mortgages, rent, or real estate liabilities</li>
              <li>Existing student loans or personal loans</li>
              <li>Court-ordered child support or alimony</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-500" /> What is Excluded from DTI
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Living expenses such as groceries, utilities, cell phone bills, health insurance, transportation costs, and discretionary subscription expenses are excluded from institutional DTI underwriting calculations.
            </p>
          </div>
        </div>

        {/* Lender DTI Benchmark Tiers */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">Lender DTI Threshold Benchmark Tiers</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">&lt; 35%: Prime Tier</div>
              <div className="text-xs text-emerald-900 font-medium mt-1">
                Optimal / Low Risk: Qualifies for peak loan limits ($50k–$100k) and lowest APR tiers.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
              <div className="text-xs font-bold text-blue-800 uppercase tracking-wider">36% – 43%: Approved</div>
              <div className="text-xs text-blue-900 font-medium mt-1">
                Standard Acceptable Risk: Approved by most online lenders and banks with credit 670+.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">44% – 50%: High Risk</div>
              <div className="text-xs text-amber-900 font-medium mt-1">
                Subprime Tier: Requires manual underwriting, large liquid reserves, or a co-signer.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200">
              <div className="text-xs font-bold text-red-800 uppercase tracking-wider">&gt; 50%: Declined</div>
              <div className="text-xs text-red-900 font-medium mt-1">
                Automatic Rejection: Underwriting rules prohibit approval due to debt service strain.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Mathematical Proof: Credit Card Consolidation Case Study */}
      <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <TrendingDown className="w-3.5 h-3.5" /> Real-World Analytics
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            3. Mathematical Proof: Credit Card Consolidation Case Study
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Below is an analytical case study showing how replacing three high-interest credit cards with a single fixed personal loan alters cash flow and total finance charges.
          </p>
        </div>

        {/* Baseline Scenario */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm space-y-1.5">
          <div className="font-bold text-slate-900">The Baseline Scenario (3 High-Interest Cards):</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600 pt-1">
            <div>• Card A: $10,000 balance @ 24.99% APR (Min: $280)</div>
            <div>• Card B: $8,000 balance @ 22.99% APR (Min: $210)</div>
            <div>• Card C: $7,000 balance @ 19.99% APR (Min: $175)</div>
          </div>
          <div className="font-semibold text-slate-800 pt-2 border-t border-slate-200/60">
            Total Revolving Debt: $25,000 | Combined Minimum Payment: $665/mo | Weighted Average APR: 22.95%
          </div>
        </div>

        {/* Side-by-side Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500 text-xs">
              <tr>
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3 text-red-700">Minimum Payments Only</th>
                <th className="px-4 py-3 text-blue-700">Consolidated 3-Yr Personal Loan</th>
                <th className="px-4 py-3 text-emerald-700">Consolidated 5-Yr Personal Loan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr>
                <td className="px-4 py-3 font-sans font-semibold">New Loan APR</td>
                <td className="px-4 py-3 text-red-600">22.95% (Average)</td>
                <td className="px-4 py-3 text-blue-700 font-bold">10.50% Fixed</td>
                <td className="px-4 py-3 text-emerald-700 font-bold">11.50% Fixed</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-semibold">Monthly Payment</td>
                <td className="px-4 py-3">$665 (Declining)</td>
                <td className="px-4 py-3 font-bold text-slate-900">$812.55</td>
                <td className="px-4 py-3 font-bold text-emerald-700">$549.83</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-semibold">Payoff Duration</td>
                <td className="px-4 py-3 text-red-700 font-bold">21 Yrs, 8 Mos</td>
                <td className="px-4 py-3 font-bold text-slate-900">3 Years (36 mos)</td>
                <td className="px-4 py-3 font-bold text-slate-900">5 Years (60 mos)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-semibold">Total Interest Charges</td>
                <td className="px-4 py-3 text-red-700 font-bold">$29,842.10</td>
                <td className="px-4 py-3 font-bold text-blue-700">$4,251.80</td>
                <td className="px-4 py-3 font-bold text-emerald-700">$7,989.80</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-semibold">Total Out-of-Pocket Cost</td>
                <td className="px-4 py-3 text-red-700 font-bold">$54,842.10</td>
                <td className="px-4 py-3 font-bold">$29,251.80</td>
                <td className="px-4 py-3 font-bold">$32,989.80</td>
              </tr>
              <tr className="bg-emerald-50/50">
                <td className="px-4 py-3 font-sans font-bold text-emerald-900">Net Savings vs Minimums</td>
                <td className="px-4 py-3 font-bold text-slate-400">$0.00 (Baseline)</td>
                <td className="px-4 py-3 font-bold text-emerald-700">$25,590.30 Saved</td>
                <td className="px-4 py-3 font-bold text-emerald-700">$21,852.30 Saved</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
          <strong>Key Takeaway:</strong> Switching to a 5-year personal loan reduces the monthly payment by $115.17 while saving <strong>$21,852.30</strong> in total interest. Selecting a 3-year term increases the monthly outlay by $147.55 but delivers over <strong>$25,500 in total savings</strong> and eliminates debt in just 36 months.
        </div>
      </section>

      {/* SECTION 4: Hidden Fees & Fine Print Disclosure Matrix */}
      <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">
            <AlertTriangle className="w-3.5 h-3.5" /> Fine Print Audits
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            4. Hidden Fees & Fine Print Disclosure Matrix
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            When analyzing personal loan offers, look beyond headline interest rates. The total cost of borrowing depends on fee structures hidden in loan agreements:
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 text-white font-mono text-xs sm:text-sm text-center">
          Total Borrowing Cost = Principal + Total Amortized Interest + Origination Fee + Administrative Fees
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">1. Origination Fees</h4>
            <div className="text-xs font-semibold text-blue-600">Range: 1.00% to 8.00% of loan</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Subtracted upfront from proceeds before disbursement. On a $20,000 loan with a 5% ($1,000) fee, you receive $19,000 but repay interest on the full $20,000.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">2. Prepayment Penalties</h4>
            <div className="text-xs font-semibold text-emerald-600">Industry Standard: $0</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Leading online lenders charge $0 for early payoff. Watch out for subprime lenders that enforce a 2% remaining principal penalty for early closure.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">3. Autopay APR Discounts</h4>
            <div className="text-xs font-semibold text-purple-600">Discount: 0.25% to 0.50%</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Most lenders reduce your APR by 0.25% to 0.50% if you enroll in automated monthly ACH withdrawals from your primary checking account.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: Expanded Long-Tail FAQ Engine */}
      <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" /> Borrower FAQ
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            5. Expanded Long-Tail FAQ Engine
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Direct, expert answers to key regulatory, tax, and qualification questions regarding personal loans.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">Are personal loan proceeds considered taxable income by the IRS?</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No. Personal loan proceeds are not taxable income because they represent borrowed funds that you are contractually obligated to repay. However, if a lender forgives or cancels a portion of your principal balance (e.g., through debt settlement), the canceled amount is classified as taxable debt cancellation income (Form 1099-C).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">What is the difference between a secured and unsecured personal loan?</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              An unsecured personal loan requires no collateral and is granted based on your creditworthiness and income. A secured personal loan requires you to pledge an asset—such as a savings account, CD, or vehicle—as collateral. Secured loans carry lower APRs and higher approval rates for fair-credit borrowers, but defaulting allows the lender to seize the asset.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">How quickly can I receive funds after personal loan approval?</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Funding timelines vary by institution. Many FinTech lenders offer same-day or next-business-day direct deposit upon document verification. Traditional brick-and-mortar banks and credit unions typically take 2 to 5 business days to clear funds.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">Can I get a lower APR on a personal loan by adding a co-signer?</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Yes. Adding a co-signer or co-borrower with an excellent credit score (740+) and strong income reduces lender risk. This can lower your interest rate, increase your maximum approved loan amount, and help clear stringent DTI limits.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">How does taking out a personal loan affect my credit mix?</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              FICO® and VantageScore algorithms reward consumers who responsibly manage multiple credit types (revolving vs. installment debt). Adding a personal loan diversifies your credit mix—which accounts for 10% of your FICO Score—and can boost your credit profile over time as you build on-time payment history.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">Can I refinance an existing personal loan if interest rates drop?</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Yes. Personal loan refinancing involves taking out a new loan—ideally with a lower APR, better terms, or zero fees—to pay off your current personal loan. There are no statutory limits on how often or when you can refinance an unsecured personal loan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
