import React from 'react';
import { Calculator as LogoIcon, Shield, FileText, Globe, ArrowRight } from 'lucide-react';
import { Category, SiteSettings } from '../../types';
import { getCategoryUrl } from '../../utils/slug';

interface FooterProps {
  categories: Category[];
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ categories, settings, onNavigate }) => {
  const activeCategories = categories.filter(c => c.isActive);

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="w-full bg-slate-950 text-slate-300 border-t border-slate-900 mt-auto">
      <div className="w-full px-6 sm:px-10 lg:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <LogoIcon className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {settings.siteName || 'Global Calculator'}
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings.tagline || 'Modern online calculation platform delivering instant, reliable, and verified results.'}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span>Full-width global responsive architecture</span>
            </div>
          </div>

          {/* Categories Col */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Active Categories
            </h4>
            {activeCategories.length > 0 ? (
              <ul className="space-y-2">
                {activeCategories.slice(0, 8).map(cat => (
                  <li key={cat.id}>
                    <a
                      href={getCategoryUrl(cat.slug)}
                      onClick={e => handleLinkClick(e, getCategoryUrl(cat.slug))}
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                      <span>{cat.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">
                No active categories published yet. Use Admin Panel to create categories.
              </p>
            )}
          </div>

          {/* Platform & Resources Col */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Platform & Tools
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="/sitemap"
                  onClick={e => handleLinkClick(e, '/sitemap')}
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>XML Sitemap & Directory</span>
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  onClick={e => handleLinkClick(e, '/admin')}
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Admin Management Panel</span>
                </a>
              </li>
              {settings.contactEmail && (
                <li className="text-xs text-slate-500 pt-2">
                  Contact: <span className="text-slate-400">{settings.contactEmail}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.siteName || 'Global Calculator Platform'}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Dynamic Platform Engine Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
