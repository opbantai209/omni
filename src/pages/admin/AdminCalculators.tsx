import React, { useState } from 'react';
import {
  Calculator as CalcIcon,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Power,
  Sparkles,
  TrendingUp,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { Category, Subcategory, Calculator } from '../../types';
import { storage } from '../../services/storage';
import { getDynamicIcon } from '../../utils/icons';
import { getCalculatorUrl } from '../../utils/slug';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';

interface AdminCalculatorsProps {
  onOpenEditor: (calculatorId?: string) => void;
  onNavigateSite: (path: string) => void;
}

export const AdminCalculators: React.FC<AdminCalculatorsProps> = ({
  onOpenEditor,
  onNavigateSite,
}) => {
  const [calculators, setCalculators] = useState<Calculator[]>(() =>
    storage.getCalculators({ includeInactive: true })
  );
  const categories = storage.getCategories(true);
  const subcategories = storage.getSubcategories(undefined, true);

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const refreshList = () => {
    setCalculators(storage.getCalculators({ includeInactive: true }));
  };

  const handleToggleStatus = (calc: Calculator) => {
    storage.updateCalculator(calc.id, { isActive: !calc.isActive });
    refreshList();
  };

  const handleToggleFeatured = (calc: Calculator) => {
    storage.updateCalculator(calc.id, { isFeatured: !calc.isFeatured });
    refreshList();
  };

  const handleTogglePopular = (calc: Calculator) => {
    storage.updateCalculator(calc.id, { isPopular: !calc.isPopular });
    refreshList();
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      storage.deleteCalculator(deleteTargetId);
      setDeleteTargetId(null);
      refreshList();
    }
  };

  const filteredCalculators = calculators.filter(c => {
    if (selectedCategoryFilter !== 'all' && c.categoryId !== selectedCategoryFilter) {
      return false;
    }
    if (selectedStatusFilter === 'active' && !c.isActive) return false;
    if (selectedStatusFilter === 'disabled' && c.isActive) return false;
    if (selectedStatusFilter === 'featured' && !c.isFeatured) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      c.shortDescription?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Calculator Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage interactive calculators, formulas, input fields, and SEO metadata.
          </p>
        </div>

        <button
          onClick={() => onOpenEditor()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Build New Calculator</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search calculators by name, slug..."
              className="rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategoryFilter}
              onChange={e => setSelectedCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-700 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-700 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="disabled">Disabled Only</option>
              <option value="featured">Featured Only</option>
            </select>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Total: {calculators.length} ({calculators.filter(c => c.isActive).length} Active)
        </span>
      </div>

      {/* Calculators Table */}
      {filteredCalculators.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Calculator</th>
                  <th className="px-6 py-3.5">Category & Subcategory</th>
                  <th className="px-6 py-3.5">Badges</th>
                  <th className="px-6 py-3.5">Views</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCalculators.map(calc => {
                  const parentCat = categories.find(c => c.id === calc.categoryId);
                  const parentSub = subcategories.find(s => s.id === calc.subcategoryId);
                  const publicUrl = getCalculatorUrl(
                    parentCat?.slug || 'tools',
                    parentSub?.slug,
                    calc.slug
                  );

                  return (
                    <tr key={calc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 text-emerald-600 flex items-center justify-center shrink-0">
                            {getDynamicIcon(calc.icon, { className: 'w-5 h-5' })}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{calc.name}</div>
                            <div className="text-xs text-slate-400 font-mono">/{calc.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                            {parentCat ? parentCat.name : 'No Category'}
                          </span>
                          {parentSub && (
                            <span className="block text-[11px] text-slate-400 font-medium">
                              ↳ {parentSub.name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleFeatured(calc)}
                            className={`p-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                              calc.isFeatured
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'text-slate-300 hover:text-slate-600'
                            }`}
                            title="Toggle Featured"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleTogglePopular(calc)}
                            className={`p-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                              calc.isPopular
                                ? 'bg-amber-100 text-amber-800'
                                : 'text-slate-300 hover:text-slate-600'
                            }`}
                            title="Toggle Popular"
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-slate-400" />
                          <span>{calc.viewCount || 0}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(calc)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            calc.isActive
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          <span>{calc.isActive ? 'Active' : 'Disabled'}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {calc.isActive && parentCat && (
                            <button
                              onClick={() => onNavigateSite(publicUrl)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="View on Public Website"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onOpenEditor(calc.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit Calculator"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(calc.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Calculator"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={CalcIcon}
          title="No Calculators Created Yet"
          description="Create your first interactive calculator tool with custom inputs, formulas, and step explanations."
          actionText="Build First Calculator"
          onAction={() => onOpenEditor()}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Calculator?"
        message="Are you sure you want to permanently delete this calculator? This action cannot be undone."
        confirmText="Yes, Delete Calculator"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
