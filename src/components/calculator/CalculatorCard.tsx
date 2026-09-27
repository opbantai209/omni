import React from 'react';
import { ArrowUpRight, Sparkles, TrendingUp, Eye } from 'lucide-react';
import { Calculator, Category, Subcategory } from '../../types';
import { getDynamicIcon } from '../../utils/icons';
import { getCalculatorUrl } from '../../utils/slug';

interface CalculatorCardProps {
  calculator: Calculator;
  category?: Category;
  subcategory?: Subcategory;
  onNavigate?: (url: string) => void;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({
  calculator,
  category,
  subcategory,
  onNavigate,
}) => {
  const url = getCalculatorUrl(
    category?.slug || 'tools',
    subcategory?.slug,
    calculator.slug
  );

  const handleClick = (e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(url);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between bg-white rounded-xl border border-slate-200/90 hover:border-emerald-500/80 p-5 sm:p-6 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-950/5">
      <div>
        {/* Top Badges & Icon */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors shrink-0">
            {getDynamicIcon(calculator.icon, { className: 'w-6 h-6' })}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 justify-end">
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
            {category && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                {category.name}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
          <a href={url} onClick={handleClick} className="focus:outline-none">
            {calculator.name}
          </a>
        </h3>

        {/* Short Description */}
        <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
          {calculator.shortDescription || 'Interactive calculator with instant calculation and step-by-step breakdown.'}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" />
          <span>{calculator.viewCount || 0} uses</span>
        </div>

        <a
          href={url}
          onClick={handleClick}
          className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <span>Calculate</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
};
