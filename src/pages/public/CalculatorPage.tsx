import React, { useEffect } from 'react';
import { Eye, Sparkles, TrendingUp } from 'lucide-react';
import { Category, Subcategory, Calculator, SiteSettings } from '../../types';
import { getDynamicIcon } from '../../utils/icons';
import { getCategoryUrl, getSubcategoryUrl, getCalculatorUrl } from '../../utils/slug';
import { CalculatorRunner } from '../../components/calculator/CalculatorRunner';
import { CalculatorCard } from '../../components/calculator/CalculatorCard';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { updateSEO, buildBreadcrumbsSchema, buildCalculatorSchema } from '../../utils/seo';
import { CreditCardPayoffCalculator } from '../../components/calculators/CreditCardPayoffCalculator';
import { CreditCardPayoffGuide } from '../../components/calculators/CreditCardPayoffGuide';
import { DebtPayoffCalculator } from '../../components/calculators/DebtPayoffCalculator';
import { DebtPayoffGuide } from '../../components/calculators/DebtPayoffGuide';
import { PersonalLoanCalculator } from '../../components/calculators/PersonalLoanCalculator';
import { PersonalLoanGuide } from '../../components/calculators/PersonalLoanGuide';
import { DebtSnowballCalculator } from '../../components/calculators/DebtSnowballCalculator';
import { DebtSnowballGuide } from '../../components/calculators/DebtSnowballGuide';
import { CompoundInterestCalculator } from '../../components/calculators/CompoundInterestCalculator';
import { CompoundInterestGuide } from '../../components/calculators/CompoundInterestGuide';
import { AutoLoanCalculator } from '../../components/calculators/AutoLoanCalculator';
import { AutoLoanGuide } from '../../components/calculators/AutoLoanGuide';
import { MortgageCalculator } from '../../components/calculators/MortgageCalculator';
import { MortgageGuide } from '../../components/calculators/MortgageGuide';

interface CalculatorPageProps {
  calculator: Calculator;
  category: Category;
  subcategory?: Subcategory;
  allCalculators: Calculator[];
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({
  calculator,
  category,
  subcategory,
  allCalculators,
  settings,
  onNavigate,
}) => {
  const breadcrumbs = [
    { label: category.name, href: getCategoryUrl(category.slug) },
    ...(subcategory
      ? [{ label: subcategory.name, href: getSubcategoryUrl(category.slug, subcategory.slug) }]
      : []),
    { label: calculator.name },
  ];

  // Related calculators in the same category/subcategory
  const relatedCalculators = allCalculators
    .filter(
      c =>
        c.isActive &&
        c.id !== calculator.id &&
        (c.subcategoryId === calculator.subcategoryId || c.categoryId === category.id)
    )
    .slice(0, 4);

  useEffect(() => {
    const pageTitle =
      calculator.seoTitle || `${calculator.name} | Free Online Calculator | ${settings.siteName}`;
    const pageDesc =
      calculator.seoDescription ||
      calculator.shortDescription ||
      `Use our free ${calculator.name} to calculate instant results online.`;

    const calcUrl = getCalculatorUrl(category.slug, subcategory?.slug, calculator.slug);

    updateSEO({
      title: pageTitle,
      description: pageDesc,
      keywords: calculator.seoKeywords,
      canonicalUrl: window.location.origin + calcUrl,
      schema: {
        '@context': 'https://schema.org',
        '@graph': [
          buildBreadcrumbsSchema(breadcrumbs, window.location.origin),
          buildCalculatorSchema(calculator, category, window.location.origin),
        ],
      },
    });
  }, [calculator, category, subcategory, settings]);

  return (
    <div className="w-full px-6 sm:px-10 lg:px-16 py-8 space-y-8 pb-20">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

      {/* Header Section */}
      <div className="space-y-4 max-w-4xl">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={getCategoryUrl(category.slug)}
            onClick={e => {
              e.preventDefault();
              onNavigate(getCategoryUrl(category.slug));
            }}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
          >
            {category.name}
          </a>

          {subcategory && (
            <a
              href={getSubcategoryUrl(category.slug, subcategory.slug)}
              onClick={e => {
                e.preventDefault();
                onNavigate(getSubcategoryUrl(category.slug, subcategory.slug));
              }}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              {subcategory.name}
            </a>
          )}

          {calculator.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-800 border border-emerald-200">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}

          {calculator.isPopular && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100/80 text-amber-800 border border-amber-200">
              <TrendingUp className="w-3 h-3" />
              Popular
            </span>
          )}

          <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
            <Eye className="w-3.5 h-3.5" />
            <span>{calculator.viewCount || 0} uses</span>
          </span>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/20">
            {getDynamicIcon(calculator.icon, { className: 'w-7 h-7' })}
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {calculator.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
              {calculator.shortDescription || 'Instant online calculation tool.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Calculator Engine */}
      {calculator.slug?.toLowerCase().trim() === 'credit-card-payoff-calculator' || calculator.id === 'calc_credit_card_payoff' ? (
        <>
          <CreditCardPayoffCalculator />
          <CreditCardPayoffGuide />
        </>
      ) : calculator.slug?.toLowerCase().trim() === 'debt-payoff-calculator' || calculator.id === 'calc_debt_payoff' ? (
        <>
          <DebtPayoffCalculator />
          <DebtPayoffGuide />
        </>
      ) : calculator.slug?.toLowerCase().trim() === 'debt-snowball-vs-avalanche-calculator' || calculator.id === 'calc_debt_snowball_avalanche' ? (
        <>
          <DebtSnowballCalculator />
          <DebtSnowballGuide />
        </>
      ) : calculator.slug?.toLowerCase().trim() === 'personal-loan-calculator' || calculator.id === 'calc_personal_loan' ? (
        <>
          <PersonalLoanCalculator />
          <PersonalLoanGuide />
        </>
      ) : calculator.slug?.toLowerCase().trim() === 'compound-interest-calculator' || calculator.id === 'calc_compound_interest' ? (
        <>
          <CompoundInterestCalculator />
          <CompoundInterestGuide />
        </>
      ) : calculator.slug?.toLowerCase().trim() === 'auto-loan-calculator' || calculator.id === 'calc_auto_loan' ? (
        <>
          <AutoLoanCalculator />
          <AutoLoanGuide />
        </>
      ) : calculator.slug?.toLowerCase().trim() === 'mortgage-calculator' || calculator.id === 'calc_mortgage' ? (
        <>
          <MortgageCalculator />
          <MortgageGuide />
        </>
      ) : (
        <CalculatorRunner calculator={calculator} currencySymbol={settings.currencySymbol} />
      )}

      {/* Related Calculators (if any exist) */}
      {relatedCalculators.length > 0 && (
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Related Calculators in {category.name}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedCalculators.map(relCalc => (
              <CalculatorCard
                key={relCalc.id}
                calculator={relCalc}
                category={category}
                subcategory={subcategory}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
