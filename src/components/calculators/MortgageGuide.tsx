import React from 'react';
import {
  Home,
  DollarSign,
  TrendingDown,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  Percent,
  Calculator,
  BookOpen,
  Award,
  FileCheck,
  Bot,
} from 'lucide-react';

export const MortgageGuide: React.FC = () => {
  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-white text-slate-800 font-sans">
      {/* Header Banner */}
      <header className="border-b border-slate-200 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-blue-700">
          <BookOpen className="w-3.5 h-3.5" /> Comprehensive Mortgage Guide
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          The Quantitative Guide to Home Buying, Mortgage Amortization & PITI Mechanics
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Master the mathematical structures of residential mortgages: compound schedules, Private Mortgage Insurance (PMI) cancellation thresholds, property tax escrows, debt-to-income limits, and accelerated equity payoff strategies.
        </p>
      </header>

      {/* 1. Executive Summary */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5">
          <Award className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-extrabold text-slate-900">1. Executive Summary & Core Rules</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="p-2 bg-blue-600 text-white rounded-xl w-fit">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Compound Amortization Mechanics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standard mortgages utilize a compound interest amortized schedule where initial payments are heavily weighted towards interest. Front-loading extra payments during the first 10 years yields the greatest compound savings.
            </p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="p-2 bg-amber-500 text-white rounded-xl w-fit">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">The PMI Threshold Rule</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Putting down less than 20% triggers Private Mortgage Insurance (PMI), adding an extra monthly fee. PMI is required until your outstanding loan principal drops below 80% Loan-to-Value (LTV).
            </p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="p-2 bg-emerald-600 text-white rounded-xl w-fit">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">The 28/36 Debt Limit Guide</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lenders enforce strict affordability guidelines: housing costs (PITI + HOA) should remain under 28% of gross monthly income, while total debts (housing + consumer loans) must remain under 36% of gross income.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Mathematical Foundations */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5">
          <Calculator className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-extrabold text-slate-900">2. Mathematical Foundations & Amortization Derivations</h2>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          The monthly mortgage Principal & Interest (P&I) payment $M$ is derived from the standard present value equation of an annuity, where a principal balance $PV$ is amortized over $n$ compounding periods:
        </p>

        {/* Math equation */}
        <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-blue-400">Monthly P&I Amortization Equation</h3>
          <div className="p-4 bg-slate-800 rounded-xl font-mono text-center text-base sm:text-lg text-emerald-400 overflow-x-auto">
            {"M = P \\cdot \\frac{r(1 + r)^n}{(1 + r)^n - 1}"}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
            <div><strong className="text-white">M:</strong> Monthly Payment ($)</div>
            <div><strong className="text-white">P:</strong> Financed Principal ($)</div>
            <div><strong className="text-white">r:</strong> Monthly Rate (APR / 12 / 100)</div>
            <div><strong className="text-white">n:</strong> Total Payments (Years * 12)</div>
          </div>
        </div>

        {/* Breakdown of PITI components */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-slate-900">PITI + HOA Comprehensive Equation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your true housing budget is comprised of five main monthly cost variables, commonly aggregated as PITI:
          </p>
          <div className="p-4 bg-white border border-slate-200 rounded-xl font-mono text-center text-sm sm:text-base text-blue-700 overflow-x-auto">
            {"Total Monthly Outlay = Principal & Interest + Property Taxes + Homeowner's Insurance + PMI + HOA"}
          </div>
        </div>
      </section>

      {/* 3. Accelerated Equity Payoff */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5">
          <FileCheck className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-extrabold text-slate-900">3. Accelerated Payoff & Compound Savings</h2>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Adding relatively minor extra principal payments consistently over the life of your mortgage yields massive interest savings and pays off the debt years ahead of schedule.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 border border-slate-200 bg-slate-50 rounded-2xl space-y-2">
            <span className="font-bold text-blue-600 uppercase tracking-wider text-2xs block">Strategic Action 1: One Extra Payment per Year</span>
            <p className="text-slate-700">
              Making just one extra principal payment annually (or adding 1/12th of your payment to your monthly payment) shaves roughly <strong>4 to 5 years</strong> off a traditional 30-year term and reduces lifetime interest costs by up to 15%.
            </p>
          </div>

          <div className="p-5 border border-emerald-200 bg-emerald-50/40 rounded-2xl space-y-2">
            <span className="font-bold text-emerald-700 uppercase tracking-wider text-2xs block">Strategic Action 2: Early Principal Front-Loading</span>
            <p className="text-slate-700">
              Because mortgage interest is heavily frontloaded in the first third of the amortization timeline, paying an extra $100 per month starting in Year 1 does significantly more financial heavy lifting than starting the same plan in Year 15.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section className="space-y-6 border-t border-slate-200 pt-8">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-extrabold text-slate-900">4. Frequently Asked Questions (FAQ)</h2>
        </div>

        <div className="space-y-4 text-sm text-slate-700">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">How does Private Mortgage Insurance (PMI) work, and when is it cancelled?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              PMI is required if you purchase a home with a down payment under 20%. PMI protects the lender, not you, in the event of default. By federal law, lenders must cancel PMI once standard amortization payments reduce the remaining principal balance to <strong>78% LTV</strong> of the original purchase price. You can request early removal at <strong>80% LTV</strong> with an updated professional appraisal.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">What are Seller Credits, and how can they buy down my interest rate?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Seller credits are financial concessions paid by the seller at closing. Buyers can negotiate seller credits to buy down their interest rate—either temporarily (e.g., a 2-1 temporary buy-down) or permanently by purchasing discount points. A seller credit buy-down often saves you more on your monthly housing payment than an equivalent list price reduction.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-base">What is the difference between fixed-rate and adjustable-rate mortgages (ARMs)?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fixed-rate mortgages maintain the exact same interest rate and base P&I payment for the entire life of the loan. Adjustable-rate mortgages (ARMs) offer a lower introductory rate for an initial period (e.g., 5, 7, or 10 years), after which the rate adjusts periodically based on current index benchmarks. ARMs can be risky but are effective if you plan to resell or refinance before the rate adjustment window opens.
            </p>
          </div>
        </div>
      </section>

      {/* AI Assistant Call to Action */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500 rounded-xl text-white">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xs uppercase tracking-wider text-indigo-400 font-mono font-bold block">
              AI Underwriting Integration
            </span>
            <h3 className="text-lg sm:text-xl font-black">
              System Prompt: Expert Homebuying & Mortgage Specialist Engine
            </h3>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Use the <strong>AI Homebuying Advisor</strong> tab in the calculator panel above to consult our elite mortgage specialist. It dynamically audits your debt-to-income ratios, outlines custom PMI cancellation trajectories, models seller credit negotiations, and outlines permanent interest rate buy-down programs.
        </p>
      </section>
    </article>
  );
};
export default MortgageGuide;
