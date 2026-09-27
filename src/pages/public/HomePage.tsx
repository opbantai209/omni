import React, { useEffect } from 'react';
import {
  Search,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Globe,
  Sliders,
  Layers,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';
import { Category, Subcategory, Calculator, SiteSettings } from '../../types';
import { getDynamicIcon } from '../../utils/icons';
import { getCategoryUrl, getCalculatorUrl } from '../../utils/slug';
import { CalculatorCard } from '../../components/calculator/CalculatorCard';
import { EmptyState } from '../../components/common/EmptyState';
import { updateSEO } from '../../utils/seo';

interface HomePageProps {
  categories: Category[];
  subcategories: Subcategory[];
  calculators: Calculator[];
  settings: SiteSettings;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  categories,
  subcategories,
  calculators,
  settings,
  onNavigate,
  onOpenSearch,
}) => {
  const activeCategories = categories.filter(c => c.isActive);
  const activeCategoryIds = new Set(activeCategories.map(c => c.id));
  const activeSubcategories = subcategories.filter(s => s.isActive && activeCategoryIds.has(s.categoryId));
  const activeSubcategoryIds = new Set(activeSubcategories.map(s => s.id));

  const activeCalculators = calculators.filter(c => {
    if (!c.isActive) return false;
    if (!activeCategoryIds.has(c.categoryId)) return false;
    if (c.subcategoryId && !activeSubcategoryIds.has(c.subcategoryId)) return false;
    return true;
  });

  const featuredCalculators = activeCalculators.filter(c => c.isFeatured);
  const popularCalculators = activeCalculators.filter(c => c.isPopular);

  useEffect(() => {
    updateSEO({
      title: `${settings.siteName} | Accurate Online Calculators & Tools`,
      description: settings.metaDescription,
      canonicalUrl: window.location.origin + '/',
      ogType: 'website',
    });
  }, [settings]);

  return (
    <div className="w-full space-y-16 sm:space-y-20 pb-20">
      {/* 1. Full-Width Clean White Hero Section (Fiverr Inspired) */}
      <section className="w-full bg-gradient-to-b from-slate-50/80 via-white to-white border-b border-slate-200/70 pt-12 sm:pt-18 pb-16 sm:pb-24 px-6 sm:px-10 lg:px-16">
        <div className="w-full max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Instant & Accurate Global Calculation Engine</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Find the right <span className="text-emerald-600">calculation tool</span> for any problem
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            {settings.tagline || 'Access dynamic, reliable, and verified calculation tools across finance, health, math, and everyday utility.'}
          </p>

          {/* Hero Search Bar */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div
              onClick={onOpenSearch}
              className="w-full flex items-center bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500 shadow-lg shadow-slate-200/50 p-2.5 sm:p-3 transition-all cursor-pointer group"
            >
              <Search className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 ml-2 mr-3 shrink-0 transition-colors" />
              <span className="text-slate-400 text-sm sm:text-base font-medium flex-1 text-left">
                Search calculators (e.g., loan, salary, percentage, mortgage)...
              </span>
              <button
                type="button"
                className="px-5 py-2.5 sm:py-3 bg-emerald-600 group-hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors shrink-0 shadow-sm shadow-emerald-600/20"
              >
                Search
              </button>
            </div>
          </div>

          {/* Quick Popular Calculator Launch Pills (dynamic) */}
          {popularCalculators.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-semibold">
              <span className="text-slate-400">Popular:</span>
              {popularCalculators.slice(0, 5).map(calc => {
                const cat = categories.find(c => c.id === calc.categoryId);
                const sub = calc.subcategoryId ? subcategories.find(s => s.id === calc.subcategoryId) : undefined;
                const path = cat && sub ? `/${cat.slug}/${sub.slug}/${calc.slug}` : cat ? `/${cat.slug}/${calc.slug}` : `/${calc.slug}`;
                return (
                  <button
                    key={calc.id}
                    onClick={() => onNavigate(path)}
                    className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 text-slate-700 transition-all cursor-pointer font-bold flex items-center gap-1.5"
                  >
                    <span>{calc.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Live Platform Stats Strip */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>{activeCalculators.length} Calculators Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>{activeCategories.length} Category</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Compounding Models</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Section (Full-Width) */}
      <section className="w-full px-6 sm:px-10 lg:px-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Browse calculators organized by specific disciplines and topics
            </p>
          </div>

          {activeCategories.length > 0 && (
            <span className="text-xs font-semibold text-slate-400">
              {activeCategories.length} active {activeCategories.length === 1 ? 'category' : 'categories'}
            </span>
          )}
        </div>

        {activeCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activeCategories.map(cat => {
              const catSubcategories = activeSubcategories.filter(s => s.categoryId === cat.id);
              const catCalculatorsCount = activeCalculators.filter(c => c.categoryId === cat.id).length;
              const url = getCategoryUrl(cat.slug);

              return (
                <div
                  key={cat.id}
                  onClick={() => onNavigate(url)}
                  className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500 p-6 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-950/5 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-700 text-emerald-600 flex items-center justify-center mb-4 transition-colors">
                      {getDynamicIcon(cat.icon, { className: 'w-6 h-6' })}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {cat.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {cat.description || 'Explore calculators and calculation tools in this category.'}
                    </p>

                    {/* Subcategories preview */}
                    {catSubcategories.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {catSubcategories.slice(0, 3).map(sub => (
                          <span
                            key={sub.id}
                            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600"
                          >
                            {sub.name}
                          </span>
                        ))}
                        {catSubcategories.length > 3 && (
                          <span className="text-[11px] text-slate-400 font-medium self-center">
                            +{catSubcategories.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400">{catCalculatorsCount} tools</span>
                    <span className="text-emerald-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Layers}
            title="No Categories Available Yet"
            description="The platform is freshly deployed and ready for setup. Log into the Admin Panel to create your first category and calculators."
            actionText="Go to Admin Panel"
            onAction={() => onNavigate('/admin')}
          />
        )}
      </section>

      {/* 3. Featured Calculators Section (if any featured exist) */}
      {featuredCalculators.length > 0 && (
        <section className="w-full px-6 sm:px-10 lg:px-16 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Featured Calculation Tools
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredCalculators.map(calc => {
              const cat = categories.find(c => c.id === calc.categoryId);
              const sub = subcategories.find(s => s.id === calc.subcategoryId);
              return (
                <CalculatorCard
                  key={calc.id}
                  calculator={calc}
                  category={cat}
                  subcategory={sub}
                  onNavigate={onNavigate}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Popular Calculators Section (if any popular exist) */}
      {popularCalculators.length > 0 && (
        <section className="w-full px-6 sm:px-10 lg:px-16 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Most Popular Calculators
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularCalculators.map(calc => {
              const cat = categories.find(c => c.id === calc.categoryId);
              const sub = subcategories.find(s => s.id === calc.subcategoryId);
              return (
                <CalculatorCard
                  key={calc.id}
                  calculator={calc}
                  category={cat}
                  subcategory={sub}
                  onNavigate={onNavigate}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* 5. All Active Calculators Directory (if calculators exist) */}
      {activeCalculators.length > 0 && (
        <section className="w-full px-6 sm:px-10 lg:px-16 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                All Calculators Directory
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Browse our complete collection of active tools
              </p>
            </div>
            <button
              onClick={onOpenSearch}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Search All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activeCalculators.map(calc => {
              const cat = categories.find(c => c.id === calc.categoryId);
              const sub = subcategories.find(s => s.id === calc.subcategoryId);
              return (
                <CalculatorCard
                  key={calc.id}
                  calculator={calc}
                  category={cat}
                  subcategory={sub}
                  onNavigate={onNavigate}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Why Global Calculator Platform (Value Proposition) */}
      <section className="w-full px-6 sm:px-10 lg:px-16 pt-8">
        <div className="w-full bg-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Why Choose Our Platform
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Engineered for speed, accuracy, and clarity.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Every calculator is powered by dynamic mathematical rules with real-time recalculation, interactive step breakdown, and instant formatting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-10 pt-10 border-t border-slate-800 relative z-10">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">Instant Results</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Calculations execute in real-time as you adjust sliders, change quantities, or type numbers.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">Verified Formulas</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Formulas are defined and validated by administrators with custom variables, units, and conditions.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">Global & Responsive</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Works seamlessly on smartphones, tablets, laptops, and ultra-wide desktops.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
