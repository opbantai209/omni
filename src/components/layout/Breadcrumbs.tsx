import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '../../types';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href?: string) => {
    if (href && onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="w-full py-3 mb-4">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs md:text-sm text-slate-500 font-medium">
        <li className="flex items-center">
          <a
            href="/"
            onClick={e => handleClick(e, '/')}
            className="flex items-center gap-1 hover:text-emerald-600 transition-colors text-slate-600"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </a>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-3.5 h-3.5 mx-1 text-slate-400 shrink-0" />
              {isLast || !item.href ? (
                <span className="font-semibold text-slate-900 truncate max-w-[200px] md:max-w-md" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  onClick={e => handleClick(e, item.href)}
                  className="hover:text-emerald-600 transition-colors truncate max-w-[150px] md:max-w-xs"
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
