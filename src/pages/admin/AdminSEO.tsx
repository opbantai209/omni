import React, { useState } from 'react';
import {
  FileCode2,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Globe,
  ExternalLink,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { generateXmlSitemap } from '../../utils/seo';

export const AdminSEO: React.FC = () => {
  const categories = storage.getCategories(true);
  const subcategories = storage.getSubcategories(undefined, true);
  const calculators = storage.getCalculators({ includeInactive: true });
  const settings = storage.getSettings();

  const [robotsTxt, setRobotsTxt] = useState(settings.robotsTxt);
  const [robotsSaved, setRobotsSaved] = useState(false);
  const [xmlCopied, setXmlCopied] = useState(false);

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

  const handleSaveRobots = (e: React.FormEvent) => {
    e.preventDefault();
    storage.updateSettings({ robotsTxt });
    setRobotsSaved(true);
    setTimeout(() => setRobotsSaved(false), 2000);
  };

  const handleCopyXml = () => {
    navigator.clipboard.writeText(xmlContent);
    setXmlCopied(true);
    setTimeout(() => setXmlCopied(false), 2000);
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
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            SEO & Sitemap Engine
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Dynamic XML sitemaps, robots.txt configuration, and Schema.org structured data.
          </p>
        </div>
      </div>

      {/* SEO Health & Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Indexable Pages
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {1 + activeCategories.length + activeSubcategories.length + activeCalculators.length}
          </div>
          <p className="text-xs text-slate-400">
            Home (1) + Categories ({activeCategories.length}) + Subcategories ({activeSubcategories.length}) + Calculators ({activeCalculators.length})
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Sitemap Status
          </span>
          <div className="text-xl font-bold text-emerald-600 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Dynamic XML Active</span>
          </div>
          <p className="text-xs text-slate-400">
            Generated dynamically from live database records.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Schema.org Markup
          </span>
          <div className="text-xl font-bold text-emerald-600 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span>Auto JSON-LD</span>
          </div>
          <p className="text-xs text-slate-400">
            SoftwareApplication, BreadcrumbList, and FAQPage.
          </p>
        </div>
      </div>

      {/* Dynamic XML Sitemap Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Dynamic sitemap.xml</h2>
              <p className="text-xs text-slate-500">
                Only active categories, subcategories, and calculators are published in the sitemap.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyXml}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {xmlCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{xmlCopied ? 'Copied' : 'Copy XML'}</span>
            </button>
            <button
              onClick={handleDownloadXml}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download sitemap.xml</span>
            </button>
          </div>
        </div>

        <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto max-h-72">
          {xmlContent}
        </pre>
      </div>

      {/* Robots.txt Configuration */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Robots.txt Editor</h2>
            <p className="text-xs text-slate-500">
              Control search engine crawler behavior and sitemap references.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveRobots} className="space-y-4">
          <textarea
            value={robotsTxt}
            onChange={e => setRobotsTxt(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-slate-200 bg-slate-900 text-emerald-400 font-mono p-3 text-xs focus:border-emerald-500 focus:outline-none"
          />

          <div className="flex items-center justify-end gap-3">
            {robotsSaved && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Saved successfully!</span>
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Update robots.txt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
