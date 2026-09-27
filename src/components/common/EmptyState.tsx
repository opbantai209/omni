import React from 'react';
import { LucideIcon, PlusCircle, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryText?: string;
  secondaryHref?: string;
  onSecondaryAction?: () => void;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = PlusCircle,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  secondaryText,
  secondaryHref,
  onSecondaryAction,
  compact = false,
}) => {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 ${
        compact ? 'p-8' : 'p-12 md:p-16 my-6'
      }`}
    >
      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200/80 flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-7 h-7 text-emerald-600" />
      </div>
      <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm md:text-base text-slate-500 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {(actionText || secondaryText) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionText && (
            actionHref ? (
              <a
                href={actionHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-sm shadow-emerald-600/20 active:scale-95"
              >
                <span>{actionText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            ) : (
              <button
                onClick={onAction}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-sm shadow-emerald-600/20 active:scale-95 cursor-pointer"
              >
                <span>{actionText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )
          )}

          {secondaryText && (
            secondaryHref ? (
              <a
                href={secondaryHref}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-medium text-sm border border-slate-200 transition-all"
              >
                {secondaryText}
              </a>
            ) : onSecondaryAction ? (
              <button
                onClick={onSecondaryAction}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-medium text-sm border border-slate-200 transition-all cursor-pointer"
              >
                {secondaryText}
              </button>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};
