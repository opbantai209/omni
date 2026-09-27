/**
 * Central Database Storage Engine for the Global Calculator Platform.
 * STRICT REQUIREMENT: Initial installation starts with 0 categories, 0 subcategories, 0 calculators.
 */

import {
  Category,
  Subcategory,
  Calculator,
  SiteSettings,
  PlatformDatabase,
  AdminStats,
} from '../types';
import {
  CORE_MONEY_CATEGORY,
  CORE_MONEY_SUBCATEGORIES,
  CORE_MONEY_CALCULATORS,
} from './defaultData';

const STORAGE_KEY = 'global_calc_platform_db_v10';

// Initial Database seeded with CORE MONEY CALCULATORS category, subcategories, and calculators
const DEFAULT_INITIAL_DB: PlatformDatabase = {
  version: 10,
  categories: [CORE_MONEY_CATEGORY],
  subcategories: [...CORE_MONEY_SUBCATEGORIES],
  calculators: [...CORE_MONEY_CALCULATORS],
  settings: {
    siteName: 'Global Calculator Platform',
    tagline: 'Instant, Accurate & Professional Calculation Tools',
    metaDescription: 'Free online calculation platform covering finance, mortgages, loans, investments, and debt payoff.',
    contactEmail: 'admin@globalcalc.com',
    currencySymbol: '$',
    allowPublicCalculatorsList: true,
    robotsTxt: `User-agent: *\nAllow: /\nSitemap: /sitemap.xml\nDisallow: /admin`,
  },
  adminPasswordHash: 'admin123',
};

class StorageService {
  private db: PlatformDatabase;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.db = this.loadDatabase();
  }

  private loadDatabase(): PlatformDatabase {
    if (typeof window === 'undefined') {
      return DEFAULT_INITIAL_DB;
    }

    try {
      // Clear older version storage keys
      localStorage.removeItem('global_calc_platform_db_v1');
      localStorage.removeItem('global_calc_platform_db_v2');
      localStorage.removeItem('global_calc_platform_db_v3');
      localStorage.removeItem('global_calc_platform_db_v4');
      localStorage.removeItem('global_calc_platform_db_v5');
      localStorage.removeItem('global_calc_platform_db_v6');
      localStorage.removeItem('global_calc_platform_db_v7');
      localStorage.removeItem('global_calc_platform_db_v8');
      localStorage.removeItem('global_calc_platform_db_v9');

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const categories: Category[] = Array.isArray(parsed.categories) && parsed.categories.length > 0
          ? parsed.categories
          : [CORE_MONEY_CATEGORY];
        const subcategories: Subcategory[] = Array.isArray(parsed.subcategories) && parsed.subcategories.length > 0
          ? parsed.subcategories
          : [...CORE_MONEY_SUBCATEGORIES];
        const calculators: Calculator[] = Array.isArray(parsed.calculators) && parsed.calculators.length > 0
          ? parsed.calculators
          : [...CORE_MONEY_CALCULATORS];

        // Ensure Core Money Category is present
        if (!categories.some(c => c.id === CORE_MONEY_CATEGORY.id || c.slug === CORE_MONEY_CATEGORY.slug)) {
          categories.push(CORE_MONEY_CATEGORY);
        }

        // Ensure Subcategories are present and merged
        CORE_MONEY_SUBCATEGORIES.forEach(s => {
          const existingIdx = subcategories.findIndex(sub => sub.id === s.id || sub.slug === s.slug);
          if (existingIdx === -1) {
            subcategories.push(s);
          } else {
            subcategories[existingIdx] = { ...subcategories[existingIdx], ...s };
          }
        });

        // Ensure Core Money Calculators are present & up to date
        CORE_MONEY_CALCULATORS.forEach(c => {
          const existingIdx = calculators.findIndex(calc => calc.id === c.id || calc.slug === c.slug);
          if (existingIdx === -1) {
            calculators.push(c);
          } else {
            calculators[existingIdx] = { ...calculators[existingIdx], ...c, config: c.config };
          }
        });

        const merged: PlatformDatabase = {
          version: 10,
          categories,
          subcategories,
          calculators,
          settings: { ...DEFAULT_INITIAL_DB.settings, ...(parsed.settings || {}) },
          adminPasswordHash: parsed.adminPasswordHash || DEFAULT_INITIAL_DB.adminPasswordHash,
        };

        this.saveToStorage(merged);
        return merged;
      }
    } catch (err) {
      console.warn('Failed to parse database from localStorage, initializing default.', err);
    }

    this.saveToStorage(DEFAULT_INITIAL_DB);
    return DEFAULT_INITIAL_DB;
  }

  private saveToStorage(db: PlatformDatabase): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (err) {
      console.error('Failed to save database to localStorage:', err);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.saveToStorage(this.db);
    this.listeners.forEach(listener => listener());
  }

  public getDatabase(): PlatformDatabase {
    return this.db;
  }

  public resetDatabaseToDefault(): void {
    this.db = DEFAULT_INITIAL_DB;
    this.notify();
  }

  public resetDatabase(): void {
    this.resetDatabaseToDefault();
  }

  public verifyAdminPassword(password: string): boolean {
    return (this.db.adminPasswordHash || 'admin123') === password;
  }

  public updateAdminPassword(password: string): void {
    this.db.adminPasswordHash = password;
    this.notify();
  }

  public exportDatabaseJson(): string {
    return JSON.stringify(this.db, null, 2);
  }

  public importDatabaseJson(jsonString: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.categories) && Array.isArray(parsed.calculators)) {
        this.db = {
          ...DEFAULT_INITIAL_DB,
          ...parsed,
        };
        this.notify();
        return { success: true };
      }
      return { success: false, error: 'Invalid database format: missing categories or calculators array.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Invalid JSON syntax.' };
    }
  }

  // --- CATEGORIES ---
  public getCategories(includeInactive = false): Category[] {
    let list = [...this.db.categories];
    if (!includeInactive) {
      list = list.filter(c => c.isActive);
    }
    return list.sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
  }

  public getCategoryById(id: string): Category | undefined {
    return this.db.categories.find(c => c.id === id);
  }

  public getCategoryBySlug(slug: string, includeInactive = false): Category | undefined {
    const found = this.db.categories.find(c => c.slug.toLowerCase() === slug.toLowerCase());
    if (!found) return undefined;
    if (!includeInactive && !found.isActive) return undefined;
    return found;
  }

  public createCategory(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category {
    const now = new Date().toISOString();
    const newCategory: Category = {
      ...data,
      id: 'cat_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36),
      createdAt: now,
      updatedAt: now,
    };

    this.db.categories.push(newCategory);
    this.notify();
    return newCategory;
  }

  public updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>): Category | null {
    const index = this.db.categories.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.db.categories[index] = {
      ...this.db.categories[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.notify();
    return this.db.categories[index];
  }

  public deleteCategory(id: string, deleteRelated = true): boolean {
    const index = this.db.categories.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.db.categories.splice(index, 1);

    if (deleteRelated) {
      this.db.subcategories = this.db.subcategories.filter(s => s.categoryId !== id);
      this.db.calculators = this.db.calculators.filter(c => c.categoryId !== id);
    } else {
      this.db.subcategories = this.db.subcategories.filter(s => s.categoryId !== id);
      this.db.calculators = this.db.calculators.map(c => {
        if (c.categoryId === id) {
          return { ...c, categoryId: '', subcategoryId: undefined, isActive: false };
        }
        return c;
      });
    }

    this.notify();
    return true;
  }

  public isCategorySlugTaken(slug: string, excludeId?: string): boolean {
    return this.db.categories.some(c => c.slug.toLowerCase() === slug.toLowerCase() && c.id !== excludeId);
  }

  // --- SUBCATEGORIES ---
  public getSubcategories(categoryId?: string, includeInactive = false): Subcategory[] {
    let list = [...this.db.subcategories];
    if (categoryId) {
      list = list.filter(s => s.categoryId === categoryId);
    }
    if (!includeInactive) {
      const activeCategoryIds = new Set(this.db.categories.filter(c => c.isActive).map(c => c.id));
      list = list.filter(s => s.isActive && activeCategoryIds.has(s.categoryId));
    }
    return list.sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
  }

  public getSubcategoryById(id: string): Subcategory | undefined {
    return this.db.subcategories.find(s => s.id === id);
  }

  public getSubcategoryBySlug(categoryId: string, slug: string, includeInactive = false): Subcategory | undefined {
    const found = this.db.subcategories.find(
      s => s.categoryId === categoryId && s.slug.toLowerCase() === slug.toLowerCase()
    );
    if (!found) return undefined;
    if (!includeInactive && !found.isActive) return undefined;
    return found;
  }

  public createSubcategory(data: Omit<Subcategory, 'id' | 'createdAt' | 'updatedAt'>): Subcategory {
    const now = new Date().toISOString();
    const newSubcategory: Subcategory = {
      ...data,
      id: 'sub_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36),
      createdAt: now,
      updatedAt: now,
    };

    this.db.subcategories.push(newSubcategory);
    this.notify();
    return newSubcategory;
  }

  public updateSubcategory(id: string, updates: Partial<Omit<Subcategory, 'id' | 'createdAt'>>): Subcategory | null {
    const index = this.db.subcategories.findIndex(s => s.id === id);
    if (index === -1) return null;

    this.db.subcategories[index] = {
      ...this.db.subcategories[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.notify();
    return this.db.subcategories[index];
  }

  public deleteSubcategory(id: string, deleteRelated = true): boolean {
    const index = this.db.subcategories.findIndex(s => s.id === id);
    if (index === -1) return false;

    this.db.subcategories.splice(index, 1);

    if (deleteRelated) {
      this.db.calculators = this.db.calculators.filter(c => c.subcategoryId !== id);
    } else {
      this.db.calculators = this.db.calculators.map(c => {
        if (c.subcategoryId === id) {
          return { ...c, subcategoryId: undefined };
        }
        return c;
      });
    }

    this.notify();
    return true;
  }

  public isSubcategorySlugTaken(categoryId: string, slug: string, excludeId?: string): boolean {
    return this.db.subcategories.some(
      s => s.categoryId === categoryId && s.slug.toLowerCase() === slug.toLowerCase() && s.id !== excludeId
    );
  }

  // --- CALCULATORS ---
  public getCalculators(filter?: {
    categoryId?: string;
    subcategoryId?: string;
    includeInactive?: boolean;
    isFeatured?: boolean;
    isPopular?: boolean;
    searchQuery?: string;
  }): Calculator[] {
    let list = [...this.db.calculators];
    const includeInactive = filter?.includeInactive || false;

    if (!includeInactive) {
      const activeCatIds = new Set(this.db.categories.filter(c => c.isActive).map(c => c.id));
      const activeSubIds = new Set(this.db.subcategories.filter(s => s.isActive).map(s => s.id));

      list = list.filter(c => {
        if (!c.isActive) return false;
        if (!activeCatIds.has(c.categoryId)) return false;
        if (c.subcategoryId && !activeSubIds.has(c.subcategoryId)) return false;
        return true;
      });
    }

    if (filter?.categoryId) {
      list = list.filter(c => c.categoryId === filter.categoryId);
    }

    if (filter?.subcategoryId) {
      list = list.filter(c => c.subcategoryId === filter.subcategoryId);
    }

    if (filter?.isFeatured !== undefined) {
      list = list.filter(c => c.isFeatured === filter.isFeatured);
    }

    if (filter?.isPopular !== undefined) {
      list = list.filter(c => c.isPopular === filter.isPopular);
    }

    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase().trim();
      list = list.filter(c => {
        const matchName = c.name.toLowerCase().includes(q);
        const matchDesc = c.shortDescription?.toLowerCase().includes(q);
        const matchKeywords = c.seoKeywords?.some(k => k.toLowerCase().includes(q));
        const matchSlug = c.slug.toLowerCase().includes(q);
        return matchName || matchDesc || matchKeywords || matchSlug;
      });
    }

    return list.sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
  }

  public getCalculatorById(id: string): Calculator | undefined {
    return this.db.calculators.find(c => c.id === id);
  }

  public getCalculatorBySlug(
    categorySlug: string,
    subcategorySlug: string | undefined,
    calculatorSlug: string,
    includeInactive = false
  ): { calculator: Calculator; category: Category; subcategory?: Subcategory } | undefined {
    const category = this.getCategoryBySlug(categorySlug, includeInactive);

    let subcategory: Subcategory | undefined;
    if (category && subcategorySlug) {
      subcategory = this.getSubcategoryBySlug(category.id, subcategorySlug, includeInactive);
    }

    // 1. Exact match with category and subcategory
    let foundCalculator: Calculator | undefined = this.db.calculators.find(c => {
      if (category && c.categoryId !== category.id) return false;
      if (subcategory && c.subcategoryId !== subcategory.id) return false;
      return c.slug.toLowerCase() === calculatorSlug.toLowerCase();
    });

    // 2. Category fallback: match calculator under category even if subcategory slug differs
    if (!foundCalculator && category) {
      foundCalculator = this.db.calculators.find(c => {
        if (c.categoryId !== category.id) return false;
        return c.slug.toLowerCase() === calculatorSlug.toLowerCase();
      });

      if (foundCalculator && foundCalculator.subcategoryId) {
        subcategory = this.db.subcategories.find(s => s.id === foundCalculator?.subcategoryId);
      }
    }

    // 3. Global fallback: match calculator anywhere in database by slug
    if (!foundCalculator) {
      const globalMatch = this.db.calculators.find(c => c.slug.toLowerCase() === calculatorSlug.toLowerCase());
      if (globalMatch) {
        const cat = this.getCategoryById(globalMatch.categoryId);
        if (cat) {
          const sub = globalMatch.subcategoryId ? this.getSubcategoryById(globalMatch.subcategoryId) : undefined;
          return { calculator: globalMatch, category: cat, subcategory: sub };
        }
      }
    }

    if (!foundCalculator || !category) return undefined;
    if (!includeInactive && !foundCalculator.isActive) return undefined;

    return { calculator: foundCalculator, category, subcategory };
  }

  public createCalculator(data: Omit<Calculator, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>): Calculator {
    const now = new Date().toISOString();
    const newCalculator: Calculator = {
      ...data,
      id: 'calc_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36),
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.db.calculators.push(newCalculator);
    this.notify();
    return newCalculator;
  }

  public updateCalculator(
    id: string,
    updates: Partial<Omit<Calculator, 'id' | 'createdAt' | 'viewCount'>>
  ): Calculator | null {
    const index = this.db.calculators.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.db.calculators[index] = {
      ...this.db.calculators[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.notify();
    return this.db.calculators[index];
  }

  public deleteCalculator(id: string): boolean {
    const index = this.db.calculators.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.db.calculators.splice(index, 1);
    this.notify();
    return true;
  }

  public incrementViewCount(id: string): void {
    const calc = this.db.calculators.find(c => c.id === id);
    if (calc) {
      calc.viewCount = (calc.viewCount || 0) + 1;
      this.notify();
    }
  }

  public isCalculatorSlugTaken(
    arg1: string,
    arg2?: string,
    arg3?: string,
    arg4?: string
  ): boolean {
    let slug = arg1;
    let excludeId = arg2;

    if (arg3 !== undefined) {
      slug = arg3;
      excludeId = arg4;
    }

    return this.db.calculators.some(
      c => c.slug.toLowerCase() === slug.toLowerCase() && c.id !== excludeId
    );
  }

  // --- SITE SETTINGS ---
  public getSettings(): SiteSettings {
    return this.db.settings;
  }

  public updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.db.settings = {
      ...this.db.settings,
      ...updates,
    };
    this.notify();
    return this.db.settings;
  }

  // --- ADMIN STATS ---
  public getAdminStats(): AdminStats {
    const activeCategories = this.db.categories.filter(c => c.isActive).length;
    const activeSubcategories = this.db.subcategories.filter(s => s.isActive).length;
    const activeCalculators = this.db.calculators.filter(c => c.isActive).length;

    return {
      totalCategories: this.db.categories.length,
      activeCategories,
      totalSubcategories: this.db.subcategories.length,
      activeSubcategories,
      totalCalculators: this.db.calculators.length,
      activeCalculators,
      featuredCalculators: this.db.calculators.filter(c => c.isFeatured).length,
      popularCalculators: this.db.calculators.filter(c => c.isPopular).length,
    };
  }

  public getStats(): AdminStats {
    return this.getAdminStats();
  }
}

export const storage = new StorageService();
