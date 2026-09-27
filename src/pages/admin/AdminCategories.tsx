import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  ArrowUpDown,
  ExternalLink,
  Power,
  AlertCircle,
} from 'lucide-react';
import { Category } from '../../types';
import { storage } from '../../services/storage';
import { generateSlug, isValidSlug } from '../../utils/slug';
import { AVAILABLE_ICONS, getDynamicIcon } from '../../utils/icons';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(() => storage.getCategories(true));
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'Calculator',
    displayOrder: 1,
    isActive: true,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });
  const [formError, setFormError] = useState('');

  const refreshList = () => {
    setCategories(storage.getCategories(true));
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: 'Calculator',
      displayOrder: categories.length + 1,
      isActive: true,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      icon: cat.icon || 'Calculator',
      displayOrder: cat.displayOrder || 1,
      isActive: cat.isActive,
      seoTitle: cat.seoTitle || '',
      seoDescription: cat.seoDescription || '',
      seoKeywords: cat.seoKeywords ? cat.seoKeywords.join(', ') : '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      // Auto-generate slug only if not editing or slug is untouched
      slug: editingCategory ? prev.slug : generateSlug(name),
    }));
  };

  const handleToggleStatus = (cat: Category) => {
    storage.updateCategory(cat.id, { isActive: !cat.isActive });
    refreshList();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    const cleanSlug = formData.slug ? generateSlug(formData.slug) : generateSlug(formData.name);

    if (!isValidSlug(cleanSlug)) {
      setFormError('Invalid URL slug format. Slugs must be lowercase alphanumeric and hyphens only.');
      return;
    }

    if (storage.isCategorySlugTaken(cleanSlug, editingCategory?.id)) {
      setFormError(`The slug "${cleanSlug}" is already used by another category. Please use a unique slug.`);
      return;
    }

    const keywordsArray = formData.seoKeywords
      ? formData.seoKeywords.split(',').map(k => k.trim()).filter(Boolean)
      : [];

    if (editingCategory) {
      storage.updateCategory(editingCategory.id, {
        name: formData.name.trim(),
        slug: cleanSlug,
        description: formData.description.trim(),
        icon: formData.icon,
        displayOrder: Number(formData.displayOrder) || 1,
        isActive: formData.isActive,
        seoTitle: formData.seoTitle.trim(),
        seoDescription: formData.seoDescription.trim(),
        seoKeywords: keywordsArray,
      });
    } else {
      storage.createCategory({
        name: formData.name.trim(),
        slug: cleanSlug,
        description: formData.description.trim(),
        icon: formData.icon,
        displayOrder: Number(formData.displayOrder) || 1,
        isActive: formData.isActive,
        seoTitle: formData.seoTitle.trim(),
        seoDescription: formData.seoDescription.trim(),
        seoKeywords: keywordsArray,
      });
    }

    setIsModalOpen(false);
    refreshList();
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      storage.deleteCategory(deleteTargetId, true);
      setDeleteTargetId(null);
      refreshList();
    }
  };

  const filteredCategories = categories.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Category Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Add, reorder, and configure high-level calculator categories.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search categories by name or slug..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <span className="text-xs font-semibold text-slate-400">
          Total: {categories.length} ({categories.filter(c => c.isActive).length} Active)
        </span>
      </div>

      {/* Categories Table / Empty State */}
      {filteredCategories.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">URL Slug</th>
                  <th className="px-6 py-3.5">Order</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map(cat => (
                  <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-emerald-600 flex items-center justify-center shrink-0">
                          {getDynamicIcon(cat.icon, { className: 'w-5 h-5' })}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{cat.name}</div>
                          {cat.description && (
                            <div className="text-xs text-slate-400 line-clamp-1 max-w-xs">
                              {cat.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">
                      /{cat.slug}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">
                      {cat.displayOrder}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          cat.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        <span>{cat.isActive ? 'Active' : 'Disabled'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(cat.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title="No Categories Configured"
          description="Create your first category to start organizing your platform calculators."
          actionText="Add New Category"
          onAction={handleOpenCreate}
        />
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="e.g. Finance, Health, Construction, Math"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  URL Slug <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 text-xs font-mono">/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
                    placeholder="finance"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-7 pr-3 text-sm font-mono text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  placeholder="Short description displayed on category pages..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Icon & Display Order Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={e => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  >
                    {Object.keys(AVAILABLE_ICONS).map(iconKey => (
                      <option key={iconKey} value={iconKey}>
                        {iconKey}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={e => setFormData(prev => ({ ...prev, displayOrder: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm font-mono text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="block text-xs font-bold text-slate-800">Public Visibility</span>
                  <span className="text-[11px] text-slate-400">Enable to make category visible on public website</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    formData.isActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {formData.isActive ? 'Active (ON)' : 'Disabled (OFF)'}
                </button>
              </div>

              {/* SEO Fields Accordion */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  SEO Metadata (Optional)
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    SEO Page Title
                  </label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={e => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                    placeholder="Custom HTML <title> tag..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    SEO Meta Description
                  </label>
                  <input
                    type="text"
                    value={formData.seoDescription}
                    onChange={e => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                    placeholder="Meta description for search engines..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    SEO Keywords (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.seoKeywords}
                    onChange={e => setFormData(prev => ({ ...prev, seoKeywords: e.target.value }))}
                    placeholder="finance, loan, calculation, money"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Category?"
        message="Deleting this category will safely remove its subcategories and calculators from the public site. This action cannot be undone."
        confirmText="Yes, Delete Category"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
