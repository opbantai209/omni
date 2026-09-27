import React, { useState, useEffect } from 'react';
import { Search, Filter, Sliders, Layers } from 'lucide-react';
import { Category, Subcategory, Calculator, SiteSettings } from '../../types';
import { CalculatorCard } from '../../components/calculator/CalculatorCard';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { EmptyState } from '../../components/common/EmptyState';
import { updateSEO } from '../../utils/seo';

interface SearchPageProps {
  initialQuery?: string;
  categories: Category[];
  subcategories: Subcategory[];
  calculators: Calculator[];
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialQuery = '',
  categories,
  subcategories,
  calculators,
  settings,
  onNavigate,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'name' | 'popular'>('relevance');

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    updateSEO({
      title: query ? `Search: "${query}" | ${settings.siteName}` : `Search Calculators | ${settings.siteName}`,
      description: `Search through our collection of online calculators and tools.`,
    });
  }, [query, settings]);

  const activeCategories = categories.filter(c => c.isActive);
  const activeCategoryIds = new Set(activeCategories.map(c => c.id));
  const activeSubcategories = subcategories.filter(s => s.isActive && activeCategoryIds.has(s.categoryId));
  const activeSubcategoryIds = new Set(activeSubcategories.map(s => s.id));

  // Filter and sort calculators
  const filteredCalculators = calculators.filter(c => {
    if (!c.isActive) return false;
    if (!activeCategoryIds.has(c.categoryId)) return false;
    if (c.subcategoryId && !activeSubcategoryIds.has(c.subcategoryId)) return false;

    if (selectedCategoryId !== 'all' && c.categoryId !== selectedCategoryId) {
      return false;
    }

    if (!query.trim()) return true;

    const q = query.toLowerCase().trim();
    const matchName = c.name.toLowerCase().includes(q);
    const matchDesc = c.shortDescription?.toLowerCase().includes(q);
    const matchKeywords = c.seoKeywords?.some(k => k.toLowerCase().includes(q));
    const matchSlug = c.slug.toLowerCase().includes(q);

    return matchName || matchDesc || matchKeywords || matchSlug;
  });

  filteredCalculators.sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'popular') {
      return (b.viewCount || 0) - (a.viewCount || 0);
    }
    return a.displayOrder - b.displayOrder;
  });

  return (
    <div className="w-full px-6 sm:px-10 lg:px-16 py-8 space-y-8 pb-20">
      <Breadcrumbs items={[{ label: 'Search' }]} onNavigate={onNavigate} />

      {/* Search Header */}
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Search Calculators
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Find calculation tools by keyword, formula name, or category.
        </p>

        {/* Big Search Input */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type calculator name or keywords..."
            className="w-full rounded-2xl border-2 border-slate-200 bg-white py-3.5 pl-12 pr-4 text-base text-slate-900 font-medium focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-xs"
          />
        </div>
      </div>

      {/* Category Facets & Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategoryId === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Categories ({calculators.filter(c => c.isActive && activeCategoryIds.has(c.categoryId)).length})
          </button>
          {activeCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategoryId === cat.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
          <span className="font-semibold">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="relevance">Default Order</option>
            <option value="popular">Most Popular</option>
            <option value="name">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Results Count & Grid */}
      <div className="space-y-6">
        <div className="text-xs font-semibold text-slate-400">
          Found {filteredCalculators.length} matching {filteredCalculators.length === 1 ? 'calculator' : 'calculators'}
        </div>

        {filteredCalculators.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCalculators.map(calc => {
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
        ) : (
          <EmptyState
            icon={Search}
            title="No Matching Calculators Found"
            description={
              calculators.length === 0
                ? "There are currently 0 calculators in the platform. Add your first calculator in the Admin Portal."
                : `We couldn't find any calculators matching "${query}". Try different search terms or explore all categories.`
            }
            actionText={calculators.length === 0 ? "Go to Admin Panel" : "Clear Search"}
            onAction={() => {
              if (calculators.length === 0) onNavigate('/admin');
              else {
                setQuery('');
                setSelectedCategoryId('all');
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
