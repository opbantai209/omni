/**
 * Safe Mathematical Formula Evaluator and Formatter for Calculators
 */

import { OutputFormat } from '../types';

export interface EvaluationResult {
  success: boolean;
  value: number;
  formatted: string;
  error?: string;
}

/**
 * Clean and safely prepare expression for execution
 */
function prepareExpression(formula: string, variables: Record<string, number | string>): string {
  let expr = formula.trim();

  // Replace ^ with ** for exponentiation
  expr = expr.replace(/\^/g, '**');

  // Handle IF(condition, trueVal, falseVal) -> ( (condition) ? (trueVal) : (falseVal) )
  // Replace case-insensitive IF statements
  const ifRegex = /IF\s*\(([^,]+),([^,]+),([^)]+)\)/gi;
  while (ifRegex.test(expr)) {
    expr = expr.replace(ifRegex, '($1 ? $2 : $3)');
  }

  // Replace common math functions with Math.* equivalents
  const mathFunctions: Record<string, string> = {
    'sqrt': 'Math.sqrt',
    'pow': 'Math.pow',
    'abs': 'Math.abs',
    'round': 'Math.round',
    'floor': 'Math.floor',
    'ceil': 'Math.ceil',
    'sin': 'Math.sin',
    'cos': 'Math.cos',
    'tan': 'Math.tan',
    'log': 'Math.log10',
    'ln': 'Math.log',
    'exp': 'Math.exp',
    'min': 'Math.min',
    'max': 'Math.max',
    'PI': 'Math.PI',
    'E': 'Math.E',
  };

  for (const [fn, mathFn] of Object.entries(mathFunctions)) {
    const regex = new RegExp(`\\b${fn}\\b(?=\\s*\\()`, 'g');
    expr = expr.replace(regex, mathFn);
    // Special case for constants PI and E
    if (fn === 'PI' || fn === 'E') {
      const constRegex = new RegExp(`\\b${fn}\\b`, 'g');
      expr = expr.replace(constRegex, mathFn);
    }
  }

  // Substitute variable names with their numeric values
  // Sort keys by length descending to prevent partial variable replacements (e.g., 'rate_yearly' before 'rate')
  const sortedKeys = Object.keys(variables).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    const rawVal = variables[key];
    const numVal = typeof rawVal === 'number' ? rawVal : Number(rawVal);
    const safeVal = isNaN(numVal) ? 0 : numVal;
    
    // Replace whole word variable matches or [var] brackets
    const bracketRegex = new RegExp(`\\[${key}\\]`, 'g');
    expr = expr.replace(bracketRegex, `(${safeVal})`);

    const wordRegex = new RegExp(`\\b${key}\\b`, 'g');
    // Ensure we don't accidentally replace inside Math.*
    expr = expr.replace(wordRegex, (match, offset, str) => {
      const prevChar = offset > 0 ? str[offset - 1] : '';
      if (prevChar === '.') return match; // part of Math.xxx
      return `(${safeVal})`;
    });
  }

  return expr;
}

/**
 * Validate that expression contains only safe tokens (numbers, operators, Math functions, ternary)
 */
function isSafeExpression(expr: string): boolean {
  // Disallow forbidden keywords: window, document, alert, eval, Function, import, require, fetch, this, globalThis, etc.
  const forbidden = /\b(window|document|alert|eval|Function|import|require|fetch|this|globalThis|constructor|prototype|process|setTimeout|setInterval|localStorage|sessionStorage|indexedDB)\b/i;
  if (forbidden.test(expr)) {
    return false;
  }
  return true;
}

/**
 * Evaluate mathematical formula
 */
export function evaluateFormula(
  formula: string,
  variables: Record<string, number | string>
): { value: number; error?: string } {
  if (!formula || !formula.trim()) {
    return { value: 0, error: 'Empty formula' };
  }

  try {
    const prepared = prepareExpression(formula, variables);

    if (!isSafeExpression(prepared)) {
      return { value: 0, error: 'Invalid or unsafe formula expression' };
    }

    // Evaluate using Function constructor with sandbox-like constraints
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function('Math', `"use strict"; return (${prepared});`);
    const rawResult = fn(Math);

    if (typeof rawResult !== 'number' || isNaN(rawResult)) {
      return { value: 0, error: 'Result is not a valid number (NaN)' };
    }

    if (!isFinite(rawResult)) {
      return { value: 0, error: 'Result is infinite (e.g. division by zero)' };
    }

    return { value: rawResult };
  } catch (err: any) {
    return { value: 0, error: err?.message || 'Calculation error' };
  }
}

/**
 * Format numeric calculation outputs
 */
export function formatOutputValue(
  value: number,
  format: OutputFormat,
  options?: {
    precision?: number;
    prefix?: string;
    suffix?: string;
    currencySymbol?: string;
  }
): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '—';
  }

  const precision = options?.precision !== undefined ? options.precision : 2;
  const prefix = options?.prefix || '';
  const suffix = options?.suffix || '';
  const curr = options?.currencySymbol || '$';

  let formatted = '';

  switch (format) {
    case 'currency': {
      const symbol = prefix || curr;
      formatted = `${symbol}${value.toLocaleString(undefined, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      })}${suffix}`;
      break;
    }
    case 'percentage': {
      formatted = `${prefix}${value.toLocaleString(undefined, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      })}%${suffix}`;
      break;
    }
    case 'integer': {
      formatted = `${prefix}${Math.round(value).toLocaleString()}${suffix}`;
      break;
    }
    case 'scientific': {
      formatted = `${prefix}${value.toExponential(precision)}${suffix}`;
      break;
    }
    case 'text': {
      formatted = `${prefix}${value}${suffix}`;
      break;
    }
    case 'number':
    default: {
      formatted = `${prefix}${value.toLocaleString(undefined, {
        minimumFractionDigits: precision > 0 ? 0 : 0,
        maximumFractionDigits: precision,
      })}${suffix}`;
      break;
    }
  }

  return formatted;
}
