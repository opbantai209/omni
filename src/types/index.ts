export type InputType = 'number' | 'slider' | 'select' | 'radio' | 'currency' | 'percentage';

export interface InputOption {
  label: string;
  value: string | number;
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: InputType;
  defaultValue: number | string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  prefix?: string;
  suffix?: string;
  options?: InputOption[];
  helpText?: string;
  required?: boolean;
}

export type OutputFormat = 'number' | 'currency' | 'percentage' | 'scientific' | 'integer' | 'text';

export interface CalculatorOutput {
  id: string;
  label: string;
  formula: string; // mathematical expression, e.g. "amount * (1 + rate / 100) ^ years" or "weight / ((height/100)^2)"
  format: OutputFormat;
  precision?: number;
  prefix?: string;
  suffix?: string;
  isMainResult?: boolean;
  description?: string;
}

export interface CalculatorFAQ {
  question: string;
  answer: string;
}

export interface CalculatorPreset {
  id: string;
  name: string;
  description?: string;
  values: Record<string, number | string>;
}

export interface CalculatorConfig {
  inputs: CalculatorInput[];
  outputs: CalculatorOutput[];
  presets?: CalculatorPreset[];
  faqs?: CalculatorFAQ[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Calculator {
  id: string;
  categoryId: string;
  subcategoryId?: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription?: string;
  formulaExplanation?: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  viewCount: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  config: CalculatorConfig;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  metaDescription: string;
  contactEmail: string;
  currencySymbol: string;
  allowPublicCalculatorsList: boolean;
  robotsTxt: string;
}

export interface PlatformDatabase {
  version: number;
  categories: Category[];
  subcategories: Subcategory[];
  calculators: Calculator[];
  settings: SiteSettings;
  adminPasswordHash?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AdminStats {
  totalCategories: number;
  activeCategories: number;
  totalSubcategories: number;
  activeSubcategories: number;
  totalCalculators: number;
  activeCalculators: number;
  featuredCalculators: number;
  popularCalculators: number;
}
