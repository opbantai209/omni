import React, { useState, useMemo, useEffect } from 'react';
import {
  Calculator as CalcIcon,
  RotateCcw,
  Copy,
  Check,
  Printer,
  Share2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Sliders,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { Calculator, CalculatorInput, CalculatorOutput } from '../../types';
import { evaluateFormula, formatOutputValue } from '../../utils/formulaEngine';
import { storage } from '../../services/storage';

interface CalculatorRunnerProps {
  calculator: Calculator;
  currencySymbol?: string;
}

export const CalculatorRunner: React.FC<CalculatorRunnerProps> = ({
  calculator,
  currencySymbol = '$',
}) => {
  // Initialize input state with default values
  const initialValues = useMemo(() => {
    const vals: Record<string, number | string> = {};
    calculator.config.inputs.forEach(input => {
      vals[input.id] = input.defaultValue !== undefined ? input.defaultValue : 0;
    });
    return vals;
  }, [calculator]);

  const [inputValues, setInputValues] = useState<Record<string, number | string>>(initialValues);
  const [copied, setCopied] = useState(false);
  const [openFaqIndices, setOpenFaqIndices] = useState<Record<number, boolean>>({});
  const [showExplanation, setShowExplanation] = useState(true);

  // Sync inputs when calculator changes
  useEffect(() => {
    setInputValues(initialValues);
    // Increment view count on mount
    storage.incrementViewCount(calculator.id);
  }, [calculator.id, initialValues]);

  const handleInputChange = (id: string, value: any) => {
    setInputValues(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleReset = () => {
    setInputValues(initialValues);
  };

  const handleApplyPreset = (presetValues: Record<string, number | string>) => {
    setInputValues(prev => ({
      ...prev,
      ...presetValues,
    }));
  };

  // Compute all output formulas
  const outputResults = useMemo(() => {
    return calculator.config.outputs.map(output => {
      const { value, error } = evaluateFormula(output.formula, inputValues);
      const formatted = error
        ? 'Error in formula'
        : formatOutputValue(value, output.format, {
            precision: output.precision,
            prefix: output.prefix,
            suffix: output.suffix,
            currencySymbol,
          });

      return {
        ...output,
        rawValue: value,
        formatted,
        error,
      };
    });
  }, [calculator.config.outputs, inputValues, currencySymbol]);

  // Main hero output vs secondary outputs
  const mainOutput = outputResults.find(o => o.isMainResult) || outputResults[0];
  const secondaryOutputs = outputResults.filter(o => o !== mainOutput);

  // Copy results summary
  const handleCopySummary = () => {
    let summary = `=== ${calculator.name} Results ===\n`;
    summary += `Inputs:\n`;
    calculator.config.inputs.forEach(input => {
      const val = inputValues[input.id];
      summary += `  - ${input.label}: ${val} ${input.suffix || input.unit || ''}\n`;
    });
    summary += `\nOutputs:\n`;
    outputResults.forEach(out => {
      summary += `  - ${out.label}: ${out.formatted}\n`;
    });
    summary += `\nCalculated at: ${window.location.href}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="w-full space-y-8 print:space-y-4">
      {/* Top Presets Bar (if any presets configured by admin) */}
      {calculator.config.presets && calculator.config.presets.length > 0 && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-wrap items-center gap-2 print:hidden">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Presets:</span>
          </div>
          {calculator.config.presets.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset.values)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 shadow-2xs transition-all cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      )}

      {/* Calculator Main Grid: Inputs (Left/Top) & Live Results (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Sliders className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Input Parameters</h2>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors p-1.5 rounded-md hover:bg-slate-100 cursor-pointer"
              title="Reset all inputs to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Dynamic Inputs Form */}
          <div className="space-y-6">
            {calculator.config.inputs.map(input => {
              const val = inputValues[input.id] ?? '';

              return (
                <div key={input.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={`input-${input.id}`}
                      className="block text-sm font-semibold text-slate-800"
                    >
                      {input.label}
                      {input.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {input.unit && (
                      <span className="text-xs font-medium text-slate-400">
                        Unit: {input.unit}
                      </span>
                    )}
                  </div>

                  {/* Input Types */}
                  {input.type === 'slider' ? (
                    <div className="space-y-3">
                      <div className="relative flex items-center">
                        {input.prefix && (
                          <span className="absolute left-3.5 text-slate-400 font-medium text-sm">
                            {input.prefix}
                          </span>
                        )}
                        <input
                          id={`input-${input.id}`}
                          type="number"
                          min={input.min}
                          max={input.max}
                          step={input.step || 1}
                          value={val}
                          onChange={e =>
                            handleInputChange(
                              input.id,
                              e.target.value === '' ? '' : Number(e.target.value)
                            )
                          }
                          className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 text-slate-900 font-semibold focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all ${
                            input.prefix ? 'pl-8' : 'pl-3.5'
                          } ${input.suffix ? 'pr-12' : 'pr-3.5'}`}
                        />
                        {input.suffix && (
                          <span className="absolute right-3.5 text-slate-400 font-medium text-sm">
                            {input.suffix}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 font-mono">
                          {input.min !== undefined ? input.min : 0}
                        </span>
                        <input
                          type="range"
                          min={input.min !== undefined ? input.min : 0}
                          max={input.max !== undefined ? input.max : 100}
                          step={input.step || 1}
                          value={Number(val) || 0}
                          onChange={e => handleInputChange(input.id, Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                        <span className="text-xs text-slate-400 font-mono">
                          {input.max !== undefined ? input.max : 100}
                        </span>
                      </div>
                    </div>
                  ) : input.type === 'select' ? (
                    <select
                      id={`input-${input.id}`}
                      value={val}
                      onChange={e => handleInputChange(input.id, e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 font-medium focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                    >
                      {input.options?.map(opt => (
                        <option key={String(opt.value)} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : input.type === 'radio' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                      {input.options?.map(opt => {
                        const isSelected = String(val) === String(opt.value);
                        return (
                          <button
                            key={String(opt.value)}
                            type="button"
                            onClick={() => handleInputChange(input.id, opt.value)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="relative flex items-center">
                      {(input.prefix || (input.type === 'currency' ? currencySymbol : null)) && (
                        <span className="absolute left-3.5 text-slate-400 font-medium text-sm">
                          {input.prefix || currencySymbol}
                        </span>
                      )}
                      <input
                        id={`input-${input.id}`}
                        type="number"
                        min={input.min}
                        max={input.max}
                        step={input.step || (input.type === 'percentage' ? 0.1 : 1)}
                        value={val}
                        onChange={e =>
                          handleInputChange(
                            input.id,
                            e.target.value === '' ? '' : Number(e.target.value)
                          )
                        }
                        className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 text-slate-900 font-semibold focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all ${
                          input.prefix || input.type === 'currency' ? 'pl-8' : 'pl-3.5'
                        } ${input.suffix || input.type === 'percentage' ? 'pr-10' : 'pr-3.5'}`}
                      />
                      {(input.suffix || (input.type === 'percentage' ? '%' : null)) && (
                        <span className="absolute right-3.5 text-slate-400 font-medium text-sm">
                          {input.suffix || '%'}
                        </span>
                      )}
                    </div>
                  )}

                  {input.helpText && (
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      <span>{input.helpText}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic Live Results */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
            {/* Top decorative glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
              <div className="flex items-center gap-2">
                <CalcIcon className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-300">
                  Calculation Results
                </h3>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopySummary}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Copy calculation summary"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer print:hidden"
                  title="Print results sheet"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Result Card */}
            {mainOutput && (
              <div className="mt-6 text-center py-4 relative z-10">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  {mainOutput.label}
                </span>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mt-2 tracking-tight">
                  {mainOutput.error ? (
                    <span className="text-rose-400 text-lg">{mainOutput.error}</span>
                  ) : (
                    mainOutput.formatted
                  )}
                </div>
                {mainOutput.description && (
                  <p className="text-xs text-slate-400 mt-2">{mainOutput.description}</p>
                )}
              </div>
            )}

            {/* Secondary Outputs Breakdown */}
            {secondaryOutputs.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3 relative z-10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Breakdown Details</span>
                </h4>

                <div className="space-y-2">
                  {secondaryOutputs.map(out => (
                    <div
                      key={out.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/50"
                    >
                      <span className="text-xs font-medium text-slate-300">{out.label}</span>
                      <span className="text-sm font-bold text-white font-mono">
                        {out.error ? (
                          <span className="text-rose-400 text-xs">{out.error}</span>
                        ) : (
                          out.formatted
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Share / Info Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-4 text-xs text-slate-500 flex items-center justify-between">
            <span>Calculated instantly with verified formulas</span>
            <button
              onClick={handleCopySummary}
              className="font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Long Description & Explanation Section (if configured by admin) */}
      {(calculator.longDescription || calculator.formulaExplanation) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-600" />
              <span>How It Works & Formula Explanation</span>
            </h3>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              {showExplanation ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {showExplanation && (
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              {calculator.longDescription && (
                <div className="whitespace-pre-line text-slate-700">
                  {calculator.longDescription}
                </div>
              )}

              {calculator.formulaExplanation && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2 text-xs uppercase tracking-wider">
                    Formula Definition
                  </h4>
                  <div className="font-mono text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200/80 overflow-x-auto">
                    {calculator.formulaExplanation}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Dynamic FAQs Accordion (if configured by admin) */}
      {calculator.config.faqs && calculator.config.faqs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <span>Frequently Asked Questions</span>
          </h3>

          <div className="space-y-3">
            {calculator.config.faqs.map((faq, idx) => {
              const isOpen = !!openFaqIndices[idx];
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer text-sm"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-sm text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
