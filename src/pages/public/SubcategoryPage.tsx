import React, { useEffect } from 'react';
import { Layers, Sliders } from 'lucide-react';
import { Category, Subcategory, Calculator, SiteSettings } from '../../types';
import { getDynamicIcon } from '../../utils/icons';
import { getCategoryUrl } from '../../utils/slug';
import { CalculatorCard } from '../../components/calculator/CalculatorCard';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { EmptyState } from '../../components/common/EmptyState';
import { updateSEO, buildBreadcrumbsSchema } from '../../utils/seo';

import { CreditCardPayoffCalculator } from '../../components/calculators/CreditCardPayoffCalculator';
import { CreditCardPayoffGuide } from '../../components/calculators/CreditCardPayoffGuide';
import { DebtPayoffCalculator } from '../../components/calculators/DebtPayoffCalculator';
import { DebtPayoffGuide } from '../../components/calculators/DebtPayoffGuide';

interface SubcategoryPageProps {
  category: Category;
  subcategory: Subcategory;
  calculators: Calculator[];
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const SubcategoryPage: React.FC<SubcategoryPageProps> = ({
  category,
  subcategory,
  calculators,
  settings,
  onNavigate,
}) => {
  const isCreditCardPayoff = subcategory.slug === 'credit-card-payoff-calculator';
  const isDebtPayoff = subcategory.slug === 'debt-payoff-calculator';

  // Active calculators in this subcategory
  const activeSubCalculators = calculators.filter(
    c => c.isActive && c.categoryId === category.id && c.subcategoryId === subcategory.id
  );

  const breadcrumbs = [
    { label: category.name, href: getCategoryUrl(category.slug) },
    { label: subcategory.name, href: `/${category.slug}/${subcategory.slug}` },
  ];

  useEffect(() => {
    const pageTitle =
      subcategory.seoTitle ||
      `${subcategory.name} | Accurate Financial Calculation Tools`;
    const pageDesc =
      subcategory.seoDescription ||
      subcategory.description ||
      `Online calculation tools for ${subcategory.name} under ${category.name}.`;

    updateSEO({
      title: pageTitle,
      description: pageDesc,
      keywords: subcategory.seoKeywords,
      canonicalUrl: `${window.location.origin}/${category.slug}/${subcategory.slug}`,
      schema: buildBreadcrumbsSchema(breadcrumbs, window.location.origin),
    });
  }, [category, subcategory, settings]);

  return (
    <div className="w-full px-6 sm:px-10 lg:px-16 py-8 space-y-8 pb-20">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

      {/* Hero Banner */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-emerald-600 shrink-0">
            {getDynamicIcon(subcategory.icon || category.icon, { className: 'w-7 h-7 sm:w-8 sm:h-8' })}
          </div>

          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                {category.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {subcategory.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {subcategory.description || `Interactive financial calculation tool for ${subcategory.name}.`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Tool if specialized calculator */}
      {isCreditCardPayoff ? (
        <div className="space-y-6">
          <CreditCardPayoffCalculator />
          <CreditCardPayoffGuide />
        </div>
      ) : isDebtPayoff ? (
        <div className="space-y-6">
          <DebtPayoffCalculator />
          <DebtPayoffGuide />
        </div>
      ) : (
        /* Calculators List for standard subcategories */
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Calculators ({activeSubCalculators.length})
            </h2>
          </div>

          {activeSubCalculators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {activeSubCalculators.map(calc => (
                <CalculatorCard
                  key={calc.id}
                  calculator={calc}
                  category={category}
                  subcategory={subcategory}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Sliders}
              title={`No Calculators in ${subcategory.name} Yet`}
              description="Calculators for this subcategory have not been added yet. Log into the Admin Panel to create calculators."
              actionText="Add Calculator in Admin"
              onAction={() => onNavigate('/admin')}
              secondaryText={`View All ${category.name} Tools`}
              secondaryHref={getCategoryUrl(category.slug)}
            />
          )}
        </div>
      )}
    </div>
  );
};
