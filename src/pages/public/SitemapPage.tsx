import React, { useState, useEffect } from 'react';
import { FileText, Download, Copy, Check, ArrowRight, Layers, Sliders } from 'lucide-react';
import { Category, Subcategory, Calculator, SiteSettings } from '../../types';
import { getCategoryUrl, getSubcategoryUrl, getCalculatorUrl } from '../../utils/slug';
import { getDynamicIcon } from '../../utils/icons';
import { generateXmlSitemap, updateSEO } from '../../utils/seo';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';

interface SitemapPageProps {
  categories: Category[];
  subcategories: Subcategory[];
  calculators: Calculator[];
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({
  categories,
  subcategories,
  calculators,
  settings,
  onNavigate,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'xml'>('visual');

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

  const xmlContent = generateXmlSitemap(categories, subcategories, calculators);

  useEffect(() => {
    updateSEO({
      title: `Sitemap & Directory | ${settings.siteName}`,
      description: `Complete sitemap and URL directory of all active categories and calculators.`,
    });
  }, [settings]);

  const handleCopyXml = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadXml = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full px-6 sm:px-10 lg:px-16 py-8 space-y-8 pb-20">
      <Breadcrumbs items={[{ label: 'Sitemap & Directory' }]} onNavigate={onNavigate} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sitemap & Platform Directory
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Dynamic XML and HTML hierarchy for search engines and platform discovery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Visual Directory
          </button>
          <button
            onClick={() => setActiveTab('xml')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'xml'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Raw XML Format
          </button>
        </div>
      </div>

      {activeTab === 'visual' ? (
        <div className="space-y-8">
          {activeCategories.length > 0 ? (
            activeCategories.map(cat => {
              const catSubcategories = activeSubcategories.filter(s => s.categoryId === cat.id);
              const catCalculators = activeCalculators.filter(c => c.categoryId === cat.id);

              return (
                <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6">
                  {/* Category Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <a
                      href={getCategoryUrl(cat.slug)}
                      onClick={e => {
                        e.preventDefault();
                        onNavigate(getCategoryUrl(cat.slug));
                      }}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-emerald-50 text-emerald-600 flex items-center justify-center transition-colors">
                        {getDynamicIcon(cat.icon, { className: 'w-5 h-5' })}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {cat.name}
                        </h2>
                        <span className="text-xs text-slate-400 font-mono">
                          {getCategoryUrl(cat.slug)}
                        </span>
                      </div>
                    </a>

                    <span className="text-xs font-semibold text-slate-400">
                      {catCalculators.length} calculators
                    </span>
                  </div>

                  {/* Subcategories & Calculators Matrix */}
                  <div className="space-y-4">
                    {catSubcategories.length > 0 ? (
                      catSubcategories.map(sub => {
                        const subCalculators = catCalculators.filter(c => c.subcategoryId === sub.id);

                        return (
                          <div key={sub.id} className="pl-4 border-l-2 border-emerald-500/40 space-y-2">
                            <a
                              href={getSubcategoryUrl(cat.slug, sub.slug)}
                              onClick={e => {
                                e.preventDefault();
                                onNavigate(getSubcategoryUrl(cat.slug, sub.slug));
                              }}
                              className="text-sm font-bold text-slate-800 hover:text-emerald-600 inline-flex items-center gap-2"
                            >
                              <span>{sub.name}</span>
                              <span className="text-xs text-slate-400 font-normal">
                                ({subCalculators.length})
                              </span>
                            </a>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                              {subCalculators.map(calc => (
                                <a
                                  key={calc.id}
                                  href={getCalculatorUrl(cat.slug, sub.slug, calc.slug)}
                                  onClick={e => {
                                    e.preventDefault();
                                    onNavigate(getCalculatorUrl(cat.slug, sub.slug, calc.slug));
                                  }}
                                  className="text-xs font-medium text-slate-600 hover:text-emerald-600 hover:bg-slate-50 p-2 rounded-lg transition-colors flex items-center justify-between"
                                >
                                  <span className="truncate">{calc.name}</span>
                                  <ArrowRight className="w-3 h-3 text-slate-300" />
                                </a>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {catCalculators.map(calc => (
                          <a
                            key={calc.id}
                            href={getCalculatorUrl(cat.slug, undefined, calc.slug)}
                            onClick={e => {
                              e.preventDefault();
                              onNavigate(getCalculatorUrl(cat.slug, undefined, calc.slug));
                            }}
                            className="text-xs font-medium text-slate-600 hover:text-emerald-600 hover:bg-slate-50 p-2 rounded-lg transition-colors flex items-center justify-between"
                          >
                            <span className="truncate">{calc.name}</span>
                            <ArrowRight className="w-3 h-3 text-slate-300" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <h3 className="text-lg font-bold text-slate-800">Directory Is Empty</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                No active categories or calculators are published yet. They will appear here dynamically once created in the Admin Panel.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Raw XML Code Box */
        <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-emerald-400">sitemap.xml</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyXml}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied XML' : 'Copy XML'}</span>
              </button>
              <button
                onClick={handleDownloadXml}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download sitemap.xml</span>
              </button>
            </div>
          </div>

          <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-4 bg-slate-950/80 rounded-xl max-h-96">
            {xmlContent}
          </pre>
        </div>
      )}
    </div>
  );
};
