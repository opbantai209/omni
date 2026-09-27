import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Power,
  AlertCircle,
  X,
  Layers,
} from 'lucide-react';
import { Category, Subcategory } from '../../types';
import { storage } from '../../services/storage';
import { generateSlug, isValidSlug } from '../../utils/slug';
import { AVAILABLE_ICONS, getDynamicIcon } from '../../utils/icons';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminSubcategories: React.FC = () => {
  const [categories] = useState<Category[]>(() => storage.getCategories(true));
  const [subcategories, setSubcategories] = useState<Subcategory[]>(() =>
    storage.getSubcategories(undefined, true)
  );
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    slug: '',
    description: '',
    icon: 'FolderTree',
    displayOrder: 1,
    isActive: true,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });
  const [formError, setFormError] = useState('');

  const refreshList = () => {
    setSubcategories(storage.getSubcategories(undefined, true));
  };

  const handleOpenCreate = () => {
    if (categories.length === 0) {
      alert('Please create at least one Category before creating a Subcategory.');
      return;
    }

    const defaultCatId =
      selectedCategoryFilter !== 'all' ? selectedCategoryFilter : categories[0].id;

    setEditingSubcategory(null);
    setFormData({
      categoryId: defaultCatId,
      name: '',
      slug: '',
      description: '',
      icon: 'FolderTree',
      displayOrder: subcategories.length + 1,
      isActive: true,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sub: Subcategory) => {
    setEditingSubcategory(sub);
    setFormData({
      categoryId: sub.categoryId,
      name: sub.name,
      slug: sub.slug,
      description: sub.description || '',
      icon: sub.icon || 'FolderTree',
      displayOrder: sub.displayOrder || 1,
      isActive: sub.isActive,
      seoTitle: sub.seoTitle || '',
      seoDescription: sub.seoDescription || '',
      seoKeywords: sub.seoKeywords ? sub.seoKeywords.join(', ') : '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: editingSubcategory ? prev.slug : generateSlug(name),
    }));
  };

  const handleToggleStatus = (sub: Subcategory) => {
    storage.updateSubcategory(sub.id, { isActive: !sub.isActive });
    refreshList();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      setFormError('Please select a parent Category.');
      return;
    }
    if (!formData.name.trim()) {
      setFormError('Subcategory name is required.');
      return;
    }

    const cleanSlug = formData.slug ? generateSlug(formData.slug) : generateSlug(formData.name);

    if (!isValidSlug(cleanSlug)) {
      setFormError('Invalid URL slug format. Slugs must be lowercase alphanumeric and hyphens only.');
      return;
    }

    if (storage.isSubcategorySlugTaken(formData.categoryId, cleanSlug, editingSubcategory?.id)) {
      setFormError(`The slug "${cleanSlug}" is already taken within this Category.`);
      return;
    }

    const keywordsArray = formData.seoKeywords
      ? formData.seoKeywords.split(',').map(k => k.trim()).filter(Boolean)
      : [];

    if (editingSubcategory) {
      storage.updateSubcategory(editingSubcategory.id, {
        categoryId: formData.categoryId,
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
      storage.createSubcategory({
        categoryId: formData.categoryId,
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
      storage.deleteSubcategory(deleteTargetId, true);
      setDeleteTargetId(null);
      refreshList();
    }
  };

  const filteredSubcategories = subcategories.filter(s => {
    if (selectedCategoryFilter !== 'all' && s.categoryId !== selectedCategoryFilter) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Subcategory Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Group related calculators under their parent categories.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subcategory</span>
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
              placeholder="Search subcategories..."
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
                  {c.name} {c.isActive ? '' : '(Disabled)'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Total: {subcategories.length} ({subcategories.filter(s => s.isActive).length} Active)
        </span>
      </div>

      {/* Subcategories Table */}
      {filteredSubcategories.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Subcategory</th>
                  <th className="px-6 py-3.5">Parent Category</th>
                  <th className="px-6 py-3.5">URL Slug</th>
                  <th className="px-6 py-3.5">Order</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubcategories.map(sub => {
                  const parentCat = categories.find(c => c.id === sub.categoryId);

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-blue-600 flex items-center justify-center shrink-0">
                            {getDynamicIcon(sub.icon, { className: 'w-5 h-5' })}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{sub.name}</div>
                            {sub.description && (
                              <div className="text-xs text-slate-400 line-clamp-1 max-w-xs">
                                {sub.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                          {parentCat ? parentCat.name : 'Unknown Category'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">
                        {parentCat ? `/${parentCat.slug}/${sub.slug}` : `/${sub.slug}`}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">
                        {sub.displayOrder}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(sub)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            sub.isActive
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          <span>{sub.isActive ? 'Active' : 'Disabled'}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(sub)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit Subcategory"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(sub.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Subcategory"
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
          icon={FolderTree}
          title="No Subcategories Configured"
          description={
            categories.length === 0
              ? 'Please create a Category first before creating Subcategories.'
              : 'Add subcategories to organize your calculators into specific groups.'
          }
          actionText={categories.length > 0 ? 'Add Subcategory' : undefined}
          onAction={categories.length > 0 ? handleOpenCreate : undefined}
        />
      )}

      {/* Add / Edit Subcategory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
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
              {/* Parent Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Parent Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={e => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  required
                >
                  <option value="" disabled>
                    Select Parent Category
                  </option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Subcategory Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="e.g. Mortgages, Loans, Calorie Counting, Geometry"
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
                    onChange={e =>
                      setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))
                    }
                    placeholder="mortgages"
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
                  placeholder="Short subcategory description..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Icon & Display Order */}
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
                    onChange={e =>
                      setFormData(prev => ({ ...prev, displayOrder: Number(e.target.value) }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm font-mono text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="block text-xs font-bold text-slate-800">Public Visibility</span>
                  <span className="text-[11px] text-slate-400">Enable to make subcategory visible</span>
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

              {/* SEO Fields */}
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
                    placeholder="Custom page title..."
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
              </div>

              {/* Action Buttons */}
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
                  {editingSubcategory ? 'Update Subcategory' : 'Save Subcategory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Subcategory?"
        message="Are you sure you want to delete this subcategory? Associated calculators will remain under their category and become unassigned from this subcategory."
        confirmText="Yes, Delete Subcategory"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
