import React from 'react';
import {
  Layers,
  FolderTree,
  Calculator,
  Eye,
  PlusCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileCode2,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { storage } from '../../services/storage';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
  onNavigateSite: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onNavigateSite,
}) => {
  const stats = storage.getStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time management metrics and platform controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('calculator-new')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Calculator</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Grid (Starts accurately at 0) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Categories Card */}
        <div
          onClick={() => onNavigateTab('categories')}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Categories
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">
              {stats.totalCategories}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              {stats.activeCategories} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Organize calculators into high-level disciplines.
          </p>
        </div>

        {/* Subcategories Card */}
        <div
          onClick={() => onNavigateTab('subcategories')}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Subcategories
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderTree className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">
              {stats.totalSubcategories}
            </span>
            <span className="text-xs font-semibold text-blue-600">
              {stats.activeSubcategories} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Fine-grained topic groups under parent categories.
          </p>
        </div>

        {/* Calculators Card */}
        <div
          onClick={() => onNavigateTab('calculators')}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Calculators
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">
              {stats.totalCalculators}
            </span>
            <span className="text-xs font-semibold text-purple-600">
              {stats.activeCalculators} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Interactive calculation tools with custom formulas.
          </p>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Administrator Setup Workflow</h2>
            <p className="text-xs text-slate-500">
              Follow these simple steps to build your custom calculator platform.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span className={`text-xs font-bold ${stats.totalCategories > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                {stats.totalCategories > 0 ? 'Completed' : 'Pending'}
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Create Categories</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create your top-level categories (e.g. Finance, Health, Fitness, Math, Construction).
            </p>
            <button
              onClick={() => onNavigateTab('categories')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 pt-1 cursor-pointer"
            >
              <span>Manage Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span className={`text-xs font-bold ${stats.totalSubcategories > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                {stats.totalSubcategories > 0 ? 'Completed' : 'Optional'}
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Add Subcategories</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Group related tools into subcategories (e.g. Loans, Mortgages, BMI, Nutrition).
            </p>
            <button
              onClick={() => onNavigateTab('subcategories')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 pt-1 cursor-pointer"
            >
              <span>Manage Subcategories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span className={`text-xs font-bold ${stats.totalCalculators > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                {stats.totalCalculators > 0 ? 'Completed' : 'Pending'}
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Build Calculators</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Define inputs, mathematical formulas, and SEO meta tags with our visual builder.
            </p>
            <button
              onClick={() => onNavigateTab('calculator-new')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 pt-1 cursor-pointer"
            >
              <span>Build First Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Links & Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div
          onClick={() => onNavigateTab('seo')}
          className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between hover:border-emerald-500 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
              <FileCode2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">XML Sitemap & Robots.txt</h3>
              <p className="text-xs text-slate-500 mt-0.5">Inspect dynamic sitemap and SEO configuration.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </div>

        <div
          onClick={() => onNavigateTab('settings')}
          className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between hover:border-emerald-500 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Settings & Database Backup</h3>
              <p className="text-xs text-slate-500 mt-0.5">Export/Import JSON database or change password.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
};
