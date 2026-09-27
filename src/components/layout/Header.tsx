import React, { useState, useEffect, useRef } from 'react';
import {
  Calculator as LogoIcon,
  Search,
  Menu,
  X,
  Shield,
  ChevronDown,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Category, SiteSettings } from '../../types';
import { getCategoryUrl } from '../../utils/slug';
import { getDynamicIcon } from '../../utils/icons';

interface HeaderProps {
  categories: Category[];
  settings: SiteSettings;
  isAdminAuthenticated: boolean;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  settings,
  isAdminAuthenticated,
  onNavigate,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
    onNavigate(path);
  };

  const activeCategories = categories.filter(c => c.isActive);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-2xs">
      {/* Top Navbar */}
      <div className="w-full px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <a
            href="/"
            onClick={e => handleLinkClick(e, '/')}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 text-white flex items-center justify-center transition-all shadow-sm shadow-emerald-600/20">
              <LogoIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight block leading-tight">
                {settings.siteName || 'Global Calculator'}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider block">
                Platform
              </span>
            </div>
          </a>

          {/* Desktop Categories Dropdown (if active categories exist) */}
          {activeCategories.length > 0 && (
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                    Active Categories ({activeCategories.length})
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {activeCategories.map(cat => (
                      <a
                        key={cat.id}
                        href={getCategoryUrl(cat.slug)}
                        onClick={e => handleLinkClick(e, getCategoryUrl(cat.slug))}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                          {getDynamicIcon(cat.icon, { className: 'w-4 h-4 text-emerald-600' })}
                        </div>
                        <span className="truncate">{cat.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Global Search Button / Input */}
        <div className="flex-1 max-w-lg hidden sm:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 text-slate-500 text-sm transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              <span>Search any calculator tool...</span>
            </div>
            <kbd className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-white rounded border border-slate-200 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Admin Portal Button */}
          <a
            href="/admin"
            onClick={e => handleLinkClick(e, '/admin')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              isAdminAuthenticated
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="hidden md:inline">Admin Portal</span>
            {isAdminAuthenticated && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Subheader: Active Category Navigation Pill Strip (Desktop, when active categories exist) */}
      {activeCategories.length > 0 && (
        <div className="hidden md:block w-full bg-slate-50/70 border-t border-slate-200/70 px-4 sm:px-6 lg:px-10 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 py-1.5 whitespace-nowrap min-w-max">
            {activeCategories.map(cat => (
              <a
                key={cat.id}
                href={getCategoryUrl(cat.slug)}
                onClick={e => handleLinkClick(e, getCategoryUrl(cat.slug))}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-white hover:shadow-2xs border border-transparent hover:border-slate-200/80 transition-all"
              >
                {getDynamicIcon(cat.icon, { className: 'w-3.5 h-3.5 text-emerald-600' })}
                <span>{cat.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Navigation
            </div>
            <div className="space-y-1">
              <a
                href="/"
                onClick={e => handleLinkClick(e, '/')}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
              >
                Home
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Search Calculators</span>
                <Search className="w-4 h-4 text-slate-400" />
              </button>
              <a
                href="/sitemap"
                onClick={e => handleLinkClick(e, '/sitemap')}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
              >
                Sitemap & Directory
              </a>
              <a
                href="/admin"
                onClick={e => handleLinkClick(e, '/admin')}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50"
              >
                Admin Management Portal
              </a>
            </div>
          </div>

          {activeCategories.length > 0 ? (
            <div className="pt-3 border-t border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Categories ({activeCategories.length})
              </div>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {activeCategories.map(cat => (
                  <a
                    key={cat.id}
                    href={getCategoryUrl(cat.slug)}
                    onClick={e => handleLinkClick(e, getCategoryUrl(cat.slug))}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {getDynamicIcon(cat.icon, { className: 'w-4 h-4 text-emerald-600' })}
                    <span>{cat.name}</span>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-400">
              No public categories published yet.
            </div>
          )}
        </div>
      )}
    </header>
  );
};
