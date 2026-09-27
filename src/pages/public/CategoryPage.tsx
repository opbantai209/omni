import React, { useEffect, useState } from 'react';
import { Layers, ArrowRight, Sliders, Filter } from 'lucide-react';
import { Category, Subcategory, Calculator, SiteSettings } from '../../types';
import { getDynamicIcon } from '../../utils/icons';
import { getSubcategoryUrl, getCalculatorUrl } from '../../utils/slug';
import { CalculatorCard } from '../../components/calculator/CalculatorCard';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { EmptyState } from '../../components/common/EmptyState';
import { updateSEO, buildBreadcrumbsSchema } from '../../utils/seo';

interface CategoryPageProps {
  category: Category;
  subcategories: Subcategory[];
  calculators: Calculator[];
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  subcategories,
  calculators,
  settings,
  onNavigate,
}) => {
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('all');

  // Active subcategories under this category
  const activeSubcategories = subcategories.filter(s => s.isActive && s.categoryId === category.id);
  const activeSubcategoryIds = new Set(activeSubcategories.map(s => s.id));

  // Active calculators under this category
  const activeCategoryCalculators = calculators.filter(c => {
    if (!c.isActive) return false;
    if (c.categoryId !== category.id) return false;
    if (c.subcategoryId && !activeSubcategoryIds.has(c.subcategoryId)) return false;
    if (selectedSubcategoryId !== 'all' && c.subcategoryId !== selectedSubcategoryId) return false;
    return true;
  });

  const breadcrumbs = [{ label: category.name, href: `/${category.slug}` }];

  useEffect(() => {
    const pageTitle = category.seoTitle || `${category.name} Calculators & Tools | ${settings.siteName}`;
    const pageDesc = category.seoDescription || category.description || `Browse online calculators and calculation tools in ${category.name}.`;

    updateSEO({
      title: pageTitle,
      description: pageDesc,
      keywords: category.seoKeywords,
      canonicalUrl: window.location.origin + `/${category.slug}`,
      schema: buildBreadcrumbsSchema(breadcrumbs, window.location.origin),
    });
  }, [category, settings]);

  return (
    <div className="w-full px-6 sm:px-10 lg:px-16 py-8 space-y-8 pb-20">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

      {/* Category Hero Banner */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-emerald-600 shrink-0">
            {getDynamicIcon(category.icon, { className: 'w-8 h-8 sm:w-10 sm:h-10' })}
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {category.name} Calculators
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {category.description || `Explore our collection of accurate ${category.name.toLowerCase()} calculators.`}
            </p>
          </div>
        </div>
      </div>

      {/* Subcategories Filter Pills (if active subcategories exist) */}
      {activeSubcategories.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by Subcategory</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedSubcategoryId('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedSubcategoryId === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All {category.name} ({calculators.filter(c => c.isActive && c.categoryId === category.id).length})
            </button>

            {activeSubcategories.map(sub => {
              const count = calculators.filter(
                c => c.isActive && c.categoryId === category.id && c.subcategoryId === sub.id
              ).length;

              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategoryId(sub.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedSubcategoryId === sub.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {getDynamicIcon(sub.icon, { className: 'w-3.5 h-3.5' })}
                  <span>{sub.name}</span>
                  <span
                    className={`text-xs px-1.5 py-0.2 rounded-full ${
                      selectedSubcategoryId === sub.id
                        ? 'bg-emerald-700 text-emerald-100'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Calculators Grid */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Available Calculators ({activeCategoryCalculators.length})
          </h2>
        </div>

        {activeCategoryCalculators.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activeCategoryCalculators.map(calc => {
              const sub = subcategories.find(s => s.id === calc.subcategoryId);
              return (
                <CalculatorCard
                  key={calc.id}
                  calculator={calc}
                  category={category}
                  subcategory={sub}
                  onNavigate={onNavigate}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Sliders}
            title={`No Calculators in ${category.name} Yet`}
            description="Calculators for this category have not been added yet. Log into the Admin Panel to create calculators for this category."
            actionText="Add Calculator in Admin"
            onAction={() => onNavigate('/admin')}
            secondaryText="Browse All Categories"
            secondaryHref="/"
          />
        )}
      </div>
    </div>
  );
};
