import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowUpRight, Layers, Sparkles } from 'lucide-react';
import { Calculator, Category, Subcategory } from '../../types';
import { getDynamicIcon } from '../../utils/icons';
import { getCalculatorUrl } from '../../utils/slug';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculators: Calculator[];
  categories: Category[];
  subcategories: Subcategory[];
  onNavigate: (url: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  calculators,
  categories,
  subcategories,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedCategoryId('all');
    }
  }, [isOpen]);

  // Global keydown escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeCategories = categories.filter(c => c.isActive);
  const activeCategoryIds = new Set(activeCategories.map(c => c.id));
  const activeSubcategories = subcategories.filter(s => s.isActive && activeCategoryIds.has(s.categoryId));
  const activeSubcategoryIds = new Set(activeSubcategories.map(s => s.id));

  // Filter calculators: only active, matching category if selected, matching query
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
    const matchSlug = c.slug.toLowerCase().includes(q);
    const matchKeywords = c.seoKeywords?.some(k => k.toLowerCase().includes(q));

    return matchName || matchDesc || matchSlug || matchKeywords;
  });

  const handleSelectCalculator = (calc: Calculator) => {
    const cat = categories.find(c => c.id === calc.categoryId);
    const sub = subcategories.find(s => s.id === calc.subcategoryId);
    const url = getCalculatorUrl(cat?.slug || 'tools', sub?.slug, calc.slug);
    onClose();
    onNavigate(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200">
          <Search className="w-5 h-5 text-emerald-600 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search calculators by name, keyword, or topic..."
            className="w-full text-base text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-md text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Category Facet Filters (if categories exist) */}
        {activeCategories.length > 0 && (
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedCategoryId('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                selectedCategoryId === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Categories
            </button>
            {activeCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedCategoryId === cat.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {getDynamicIcon(cat.icon, { className: 'w-3 h-3' })}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredCalculators.length > 0 ? (
            filteredCalculators.map(calc => {
              const cat = categories.find(c => c.id === calc.categoryId);
              return (
                <button
                  key={calc.id}
                  onClick={() => handleSelectCalculator(calc)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-600 flex items-center justify-center shrink-0 transition-colors">
                      {getDynamicIcon(calc.icon, { className: 'w-5 h-5' })}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                          {calc.name}
                        </span>
                        {calc.isFeatured && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 shrink-0">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {calc.shortDescription || 'Instant online calculation tool'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {cat && (
                      <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md hidden sm:inline-block">
                        {cat.name}
                      </span>
                    )}
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">No calculators found</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {calculators.length === 0
                  ? 'There are currently 0 calculators in the database. Add calculators in the Admin Portal.'
                  : 'Try searching for different terms or reset your category filter.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-400 flex items-center justify-between">
          <span>
            Showing <strong className="text-slate-700">{filteredCalculators.length}</strong> available tools
          </span>
          <span className="hidden sm:inline">Use ↑ ↓ arrows to browse</span>
        </div>
      </div>
    </div>
  );
};
