import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator as CalcIcon,
  ArrowLeft,
  Plus,
  Trash2,
  Sliders,
  Sparkles,
  HelpCircle,
  FileCode,
  Info,
  Check,
  AlertCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  Calculator,
  CalculatorInput,
  CalculatorOutput,
  CalculatorFAQ,
  CalculatorPreset,
  Category,
  Subcategory,
  InputType,
  OutputFormat,
} from '../../types';
import { storage } from '../../services/storage';
import { generateSlug, isValidSlug } from '../../utils/slug';
import { AVAILABLE_ICONS, getDynamicIcon } from '../../utils/icons';
import { evaluateFormula, formatOutputValue } from '../../utils/formulaEngine';

interface AdminCalculatorEditorProps {
  calculatorId?: string;
  onBack: () => void;
  onSaved: () => void;
}

export const AdminCalculatorEditor: React.FC<AdminCalculatorEditorProps> = ({
  calculatorId,
  onBack,
  onSaved,
}) => {
  const categories = storage.getCategories(true);
  const subcategories = storage.getSubcategories(undefined, true);

  const existingCalc = calculatorId ? storage.getCalculatorById(calculatorId) : undefined;

  // Active Tab
  const [activeTab, setActiveTab] = useState<'basic' | 'inputs' | 'outputs' | 'preview' | 'seo'>('basic');

  // Form States
  const [name, setName] = useState(existingCalc?.name || '');
  const [slug, setSlug] = useState(existingCalc?.slug || '');
  const [categoryId, setCategoryId] = useState(existingCalc?.categoryId || (categories[0]?.id || ''));
  const [subcategoryId, setSubcategoryId] = useState(existingCalc?.subcategoryId || '');
  const [shortDescription, setShortDescription] = useState(existingCalc?.shortDescription || '');
  const [longDescription, setLongDescription] = useState(existingCalc?.longDescription || '');
  const [formulaExplanation, setFormulaExplanation] = useState(existingCalc?.formulaExplanation || '');
  const [icon, setIcon] = useState(existingCalc?.icon || 'Calculator');
  const [displayOrder, setDisplayOrder] = useState(existingCalc?.displayOrder || 1);
  const [isActive, setIsActive] = useState(existingCalc?.isActive !== undefined ? existingCalc.isActive : true);
  const [isFeatured, setIsFeatured] = useState(existingCalc?.isFeatured || false);
  const [isPopular, setIsPopular] = useState(existingCalc?.isPopular || false);

  // Dynamic Inputs
  const [inputs, setInputs] = useState<CalculatorInput[]>(() => {
    if (existingCalc?.config.inputs && existingCalc.config.inputs.length > 0) {
      return existingCalc.config.inputs;
    }
    return [
      {
        id: 'val1',
        label: 'First Value',
        type: 'number',
        defaultValue: 100,
        min: 0,
        max: 1000000,
        step: 1,
        prefix: '',
        suffix: '',
        helpText: 'Enter the initial amount',
      },
    ];
  });

  // Dynamic Outputs / Formulas
  const [outputs, setOutputs] = useState<CalculatorOutput[]>(() => {
    if (existingCalc?.config.outputs && existingCalc.config.outputs.length > 0) {
      return existingCalc.config.outputs;
    }
    return [
      {
        id: 'result',
        label: 'Calculated Result',
        formula: 'val1 * 1.5',
        format: 'number',
        precision: 2,
        isMainResult: true,
        description: 'Estimated output value',
      },
    ];
  });

  // Dynamic FAQs
  const [faqs, setFaqs] = useState<CalculatorFAQ[]>(existingCalc?.config.faqs || []);

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState(existingCalc?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(existingCalc?.seoDescription || '');
  const [seoKeywords, setSeoKeywords] = useState(
    existingCalc?.seoKeywords ? existingCalc.seoKeywords.join(', ') : ''
  );

  const [formError, setFormError] = useState('');

  // Sandbox Test Values
  const [testInputValues, setTestInputValues] = useState<Record<string, number | string>>({});

  useEffect(() => {
    const vals: Record<string, number | string> = {};
    inputs.forEach(i => {
      vals[i.id] = i.defaultValue !== undefined ? i.defaultValue : 0;
    });
    setTestInputValues(vals);
  }, [inputs]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!existingCalc) {
      setSlug(generateSlug(val));
    }
  };

  // Subcategories for currently selected Category
  const availableSubcategories = subcategories.filter(s => s.categoryId === categoryId);

  // Add Input
  const handleAddInput = () => {
    const newId = `var_${inputs.length + 1}`;
    const newInput: CalculatorInput = {
      id: newId,
      label: `Parameter ${inputs.length + 1}`,
      type: 'number',
      defaultValue: 10,
      min: 0,
      max: 1000,
      step: 1,
      helpText: '',
    };
    setInputs([...inputs, newInput]);
  };

  const handleUpdateInput = (index: number, updates: Partial<CalculatorInput>) => {
    const next = [...inputs];
    next[index] = { ...next[index], ...updates };
    setInputs(next);
  };

  const handleRemoveInput = (index: number) => {
    if (inputs.length <= 1) {
      alert('A calculator must have at least 1 input field.');
      return;
    }
    setInputs(inputs.filter((_, i) => i !== index));
  };

  // Add Output
  const handleAddOutput = () => {
    const newId = `output_${outputs.length + 1}`;
    const newOutput: CalculatorOutput = {
      id: newId,
      label: `Result ${outputs.length + 1}`,
      formula: inputs[0] ? `${inputs[0].id} * 2` : '0',
      format: 'number',
      precision: 2,
      isMainResult: outputs.length === 0,
    };
    setOutputs([...outputs, newOutput]);
  };

  const handleUpdateOutput = (index: number, updates: Partial<CalculatorOutput>) => {
    const next = [...outputs];
    if (updates.isMainResult) {
      // Clear main result on others
      next.forEach(o => (o.isMainResult = false));
    }
    next[index] = { ...next[index], ...updates };
    setOutputs(next);
  };

  const handleRemoveOutput = (index: number) => {
    if (outputs.length <= 1) {
      alert('A calculator must have at least 1 calculation output formula.');
      return;
    }
    setOutputs(outputs.filter((_, i) => i !== index));
  };

  // FAQs
  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleUpdateFaq = (index: number, updates: Partial<CalculatorFAQ>) => {
    const next = [...faqs];
    next[index] = { ...next[index], ...updates };
    setFaqs(next);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  // Live Sandbox test evaluation
  const liveTestResults = useMemo(() => {
    return outputs.map(out => {
      const { value, error } = evaluateFormula(out.formula, testInputValues);
      const formatted = error
        ? 'Formula Error'
        : formatOutputValue(value, out.format, {
            precision: out.precision,
            prefix: out.prefix,
            suffix: out.suffix,
          });
      return { ...out, value, formatted, error };
    });
  }, [outputs, testInputValues]);

  // Save Calculator
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Calculator name is required.');
      setActiveTab('basic');
      return;
    }

    if (!categoryId) {
      setFormError('Please select a Category.');
      setActiveTab('basic');
      return;
    }

    const cleanSlug = slug ? generateSlug(slug) : generateSlug(name);
    if (!isValidSlug(cleanSlug)) {
      setFormError('Invalid URL slug. Slugs must be lowercase alphanumeric and hyphens only.');
      setActiveTab('basic');
      return;
    }

    if (storage.isCalculatorSlugTaken(categoryId, subcategoryId || undefined, cleanSlug, existingCalc?.id)) {
      setFormError(`The slug "${cleanSlug}" is already taken in this category.`);
      setActiveTab('basic');
      return;
    }

    if (inputs.length === 0) {
      setFormError('Please add at least one input field.');
      setActiveTab('inputs');
      return;
    }

    if (outputs.length === 0) {
      setFormError('Please add at least one output formula.');
      setActiveTab('outputs');
      return;
    }

    // Check outputs have formulas
    for (const out of outputs) {
      if (!out.formula.trim()) {
        setFormError(`Formula cannot be empty for "${out.label}".`);
        setActiveTab('outputs');
        return;
      }
    }

    const keywordsArray = seoKeywords
      ? seoKeywords.split(',').map(k => k.trim()).filter(Boolean)
      : [];

    const configData = {
      inputs,
      outputs,
      faqs: faqs.filter(f => f.question.trim() && f.answer.trim()),
    };

    if (existingCalc) {
      storage.updateCalculator(existingCalc.id, {
        name: name.trim(),
        slug: cleanSlug,
        categoryId,
        subcategoryId: subcategoryId || undefined,
        shortDescription: shortDescription.trim(),
        longDescription: longDescription.trim(),
        formulaExplanation: formulaExplanation.trim(),
        icon,
        displayOrder: Number(displayOrder) || 1,
        isActive,
        isFeatured,
        isPopular,
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim(),
        seoKeywords: keywordsArray,
        config: configData,
      });
    } else {
      storage.createCalculator({
        name: name.trim(),
        slug: cleanSlug,
        categoryId,
        subcategoryId: subcategoryId || undefined,
        shortDescription: shortDescription.trim(),
        longDescription: longDescription.trim(),
        formulaExplanation: formulaExplanation.trim(),
        icon,
        displayOrder: Number(displayOrder) || 1,
        isActive,
        isFeatured,
        isPopular,
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim(),
        seoKeywords: keywordsArray,
        config: configData,
      });
    }

    onSaved();
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {existingCalc ? `Edit: ${existingCalc.name}` : 'Visual Calculator Builder'}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Configure parameters, mathematical equations, and SEO metadata.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-95"
          >
            {existingCalc ? 'Save Changes' : 'Publish Calculator'}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {formError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Editor Steps / Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'basic', label: '1. General & Classification' },
          { id: 'inputs', label: `2. Input Fields (${inputs.length})` },
          { id: 'outputs', label: `3. Formulas & Outputs (${outputs.length})` },
          { id: 'preview', label: '4. Live Sandbox Test' },
          { id: 'seo', label: '5. SEO & FAQs' },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BASIC INFO */}
      {activeTab === 'basic' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">General Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Calculator Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Compound Interest Calculator, BMI Calculator"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                URL Slug <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 text-xs font-mono">/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(generateSlug(e.target.value))}
                  placeholder="compound-interest-calculator"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-7 pr-3 text-sm font-mono text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={e => {
                  setCategoryId(e.target.value);
                  setSubcategoryId('');
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Subcategory (Optional)
              </label>
              <select
                value={subcategoryId}
                onChange={e => setSubcategoryId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="">None (Top-Level Category Only)</option>
                {availableSubcategories.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Icon
              </label>
              <select
                value={icon}
                onChange={e => setIcon(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
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
                value={displayOrder}
                onChange={e => setDisplayOrder(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm font-mono text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Short Description
            </label>
            <textarea
              value={shortDescription}
              onChange={e => setShortDescription(e.target.value)}
              rows={2}
              placeholder="Brief overview displayed on calculator cards and previews..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Status Switches */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="block text-xs font-bold text-slate-800">Public Status</span>
                <span className="text-[11px] text-slate-400">Show on public site</span>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  isActive ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                {isActive ? 'Active' : 'Disabled'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="block text-xs font-bold text-slate-800">Featured Tool</span>
                <span className="text-[11px] text-slate-400">Display in featured row</span>
              </div>
              <button
                type="button"
                onClick={() => setIsFeatured(!isFeatured)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  isFeatured ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                {isFeatured ? 'Featured' : 'No'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="block text-xs font-bold text-slate-800">Popular Tool</span>
                <span className="text-[11px] text-slate-400">Highlight in popular list</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPopular(!isPopular)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  isPopular ? 'bg-amber-500 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                {isPopular ? 'Popular' : 'No'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INPUT FIELDS DESIGNER */}
      {activeTab === 'inputs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Configure Input Fields</h2>
              <p className="text-xs text-slate-500">
                Define the variables users will enter or adjust (e.g. loan amount, interest rate, age, weight).
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddInput}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Input Field</span>
            </button>
          </div>

          <div className="space-y-4">
            {inputs.map((input, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-bold text-sm text-slate-800">
                      Variable ID: <code className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">{input.id}</code>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveInput(index)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove Input"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Label */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Field Label
                    </label>
                    <input
                      type="text"
                      value={input.label}
                      onChange={e => handleUpdateInput(index, { label: e.target.value })}
                      placeholder="e.g. Loan Amount"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Variable ID */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Variable Key (Used in Formulas)
                    </label>
                    <input
                      type="text"
                      value={input.id}
                      onChange={e =>
                        handleUpdateInput(index, {
                          id: generateSlug(e.target.value).replace(/-/g, '_'),
                        })
                      }
                      placeholder="e.g. amount, rate, years"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Input Type */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Control Type
                    </label>
                    <select
                      value={input.type}
                      onChange={e =>
                        handleUpdateInput(index, { type: e.target.value as InputType })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="number">Number Box</option>
                      <option value="slider">Range Slider</option>
                      <option value="currency">Currency ($)</option>
                      <option value="percentage">Percentage (%)</option>
                      <option value="select">Dropdown Select</option>
                      <option value="radio">Radio Buttons</option>
                    </select>
                  </div>
                </div>

                {/* Min, Max, Step, Default Value */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Default Value
                    </label>
                    <input
                      type="number"
                      value={input.defaultValue}
                      onChange={e =>
                        handleUpdateInput(index, {
                          defaultValue: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Min Value
                    </label>
                    <input
                      type="number"
                      value={input.min !== undefined ? input.min : ''}
                      onChange={e =>
                        handleUpdateInput(index, {
                          min: e.target.value === '' ? undefined : Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs font-mono text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Max Value
                    </label>
                    <input
                      type="number"
                      value={input.max !== undefined ? input.max : ''}
                      onChange={e =>
                        handleUpdateInput(index, {
                          max: e.target.value === '' ? undefined : Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs font-mono text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Step / Increment
                    </label>
                    <input
                      type="number"
                      value={input.step !== undefined ? input.step : 1}
                      onChange={e =>
                        handleUpdateInput(index, {
                          step: e.target.value === '' ? 1 : Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs font-mono text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Units, Prefix, Suffix, Help text */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Prefix (e.g. $, €)
                    </label>
                    <input
                      type="text"
                      value={input.prefix || ''}
                      onChange={e => handleUpdateInput(index, { prefix: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Suffix (e.g. %, kg, years)
                    </label>
                    <input
                      type="text"
                      value={input.suffix || ''}
                      onChange={e => handleUpdateInput(index, { suffix: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Help Hint Text
                    </label>
                    <input
                      type="text"
                      value={input.helpText || ''}
                      onChange={e => handleUpdateInput(index, { helpText: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FORMULAS & OUTPUTS */}
      {activeTab === 'outputs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Configure Calculation Formulas</h2>
              <p className="text-xs text-slate-500">
                Write mathematical formulas using your input variables (e.g.{' '}
                <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-mono">
                  {inputs.map(i => i.id).join(', ')}
                </code>
                ).
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddOutput}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Output Formula</span>
            </button>
          </div>

          <div className="space-y-4">
            {outputs.map((out, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-bold text-sm text-slate-800">
                      Output Result: <strong className="text-slate-900">{out.label}</strong>
                    </span>
                    {out.isMainResult && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                        Main Highlight Result
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateOutput(index, { isMainResult: true })}
                      className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        out.isMainResult
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {out.isMainResult ? 'Primary Result' : 'Set as Primary'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveOutput(index)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove Output"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Label */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Result Label
                    </label>
                    <input
                      type="text"
                      value={out.label}
                      onChange={e => handleUpdateOutput(index, { label: e.target.value })}
                      placeholder="e.g. Monthly Repayment, Total Cost"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Format */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Format Type
                    </label>
                    <select
                      value={out.format}
                      onChange={e =>
                        handleUpdateOutput(index, { format: e.target.value as OutputFormat })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="currency">Currency ($1,234.56)</option>
                      <option value="percentage">Percentage (12.50%)</option>
                      <option value="number">Decimal Number (123.45)</option>
                      <option value="integer">Integer / Round (123)</option>
                      <option value="scientific">Scientific Notation (1.23e+4)</option>
                    </select>
                  </div>
                </div>

                {/* Mathematical Formula Expression */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Mathematical Formula <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Supports: +, -, *, /, ^, sqrt(), pow(), round(), min(), max()
                    </span>
                  </div>
                  <input
                    type="text"
                    value={out.formula}
                    onChange={e => handleUpdateOutput(index, { formula: e.target.value })}
                    placeholder="e.g. (amount * (rate/100)) / 12"
                    className="w-full rounded-xl border border-slate-200 bg-slate-900 text-emerald-400 font-mono font-bold p-3 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Precision, Prefix, Suffix */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Decimals (Precision)
                    </label>
                    <input
                      type="number"
                      value={out.precision !== undefined ? out.precision : 2}
                      onChange={e =>
                        handleUpdateOutput(index, {
                          precision: e.target.value === '' ? 2 : Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs font-mono text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Prefix (e.g. $, €)
                    </label>
                    <input
                      type="text"
                      value={out.prefix || ''}
                      onChange={e => handleUpdateOutput(index, { prefix: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Suffix (e.g. %, /mo, lbs)
                    </label>
                    <input
                      type="text"
                      value={out.suffix || ''}
                      onChange={e => handleUpdateOutput(index, { suffix: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LIVE SANDBOX TEST PREVIEW */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Play className="w-4 h-4" />
                <span>Live Calculator Sandbox Simulator</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-1">
                Test Calculations in Real-Time
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
                Adjust test variable values below to verify your mathematical formulas before publishing.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const vals: Record<string, number | string> = {};
                inputs.forEach(i => (vals[i.id] = i.defaultValue || 0));
                setTestInputValues(vals);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Test Values</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Interactive Inputs Preview */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                Simulated Inputs ({inputs.length})
              </h3>

              <div className="space-y-4">
                {inputs.map(input => (
                  <div key={input.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-800">
                        {input.label} <span className="font-mono text-slate-400">({input.id})</span>
                      </label>
                      <span className="text-xs font-mono text-emerald-600 font-bold">
                        {testInputValues[input.id]}
                      </span>
                    </div>

                    <input
                      type="number"
                      value={testInputValues[input.id] ?? ''}
                      onChange={e =>
                        setTestInputValues(prev => ({
                          ...prev,
                          [input.id]: e.target.value === '' ? '' : Number(e.target.value),
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Calculated Outputs Preview */}
            <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-sm text-slate-300 border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Calculated Results ({outputs.length})</span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase">Live Output</span>
              </h3>

              <div className="space-y-3">
                {liveTestResults.map(out => (
                  <div
                    key={out.id}
                    className={`p-4 rounded-xl border ${
                      out.isMainResult
                        ? 'bg-emerald-900/40 border-emerald-500/50'
                        : 'bg-slate-800/60 border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{out.label}</span>
                      <span className="font-mono text-[10px] text-slate-500">{out.formula}</span>
                    </div>

                    <div className="text-2xl font-black text-white mt-1">
                      {out.error ? (
                        <span className="text-rose-400 text-sm font-normal">{out.error}</span>
                      ) : (
                        out.formatted
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SEO, RICH EXPLANATION & FAQS */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8">
          {/* SEO Metadata */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">SEO & Metadata</h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Custom SEO Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={e => setSeoTitle(e.target.value)}
                placeholder="e.g. Free Loan Payment Calculator | Fast & Accurate"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                SEO Meta Description
              </label>
              <textarea
                value={seoDescription}
                onChange={e => setSeoDescription(e.target.value)}
                rows={2}
                placeholder="Meta description for Google and search engines..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                SEO Keywords (Comma separated)
              </label>
              <input
                type="text"
                value={seoKeywords}
                onChange={e => setSeoKeywords(e.target.value)}
                placeholder="loan calculator, repayment, interest rate, amortization"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Long Description & Formula Explanation */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Educational Content & Formulas</h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Mathematical Formula Explanation (Shown below calculator)
              </label>
              <textarea
                value={formulaExplanation}
                onChange={e => setFormulaExplanation(e.target.value)}
                rows={3}
                placeholder="e.g. Payment = P * (r * (1 + r)^n) / ((1 + r)^n - 1)&#10;Where P = Principal, r = Monthly Rate, n = Total Payments."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Long Description / Guide
              </label>
              <textarea
                value={longDescription}
                onChange={e => setLongDescription(e.target.value)}
                rows={4}
                placeholder="In-depth guide explaining how to interpret the results, tips, and financial / mathematical context..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Dynamic FAQs */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
                <p className="text-xs text-slate-500">
                  Add FAQ pairs rendered with Google FAQPage Schema markup.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddFaq}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add FAQ</span>
              </button>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Question #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={e => handleUpdateFaq(idx, { question: e.target.value })}
                    placeholder="e.g. How is interest compounded?"
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-900 focus:outline-none"
                  />
                  <textarea
                    value={faq.answer}
                    onChange={e => handleUpdateFaq(idx, { answer: e.target.value })}
                    rows={2}
                    placeholder="Provide a clear, helpful answer..."
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
