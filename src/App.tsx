/**
 * Global Calculator Website Platform
 * Clean, full-width responsive architecture with dynamic category/calculator CMS
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { storage } from './services/storage';
import { auth, AdminSession } from './services/auth';
import { Category, Subcategory, Calculator, SiteSettings } from './types';

// Layout & Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/search/SearchModal';
import { EmptyState } from './components/common/EmptyState';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { CategoryPage } from './pages/public/CategoryPage';
import { SubcategoryPage } from './pages/public/SubcategoryPage';
import { CalculatorPage } from './pages/public/CalculatorPage';
import { SearchPage } from './pages/public/SearchPage';
import { SitemapPage } from './pages/public/SitemapPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminSubcategories } from './pages/admin/AdminSubcategories';
import { AdminCalculators } from './pages/admin/AdminCalculators';
import { AdminCalculatorEditor } from './pages/admin/AdminCalculatorEditor';
import { AdminSEO } from './pages/admin/AdminSEO';
import { AdminSettings } from './pages/admin/AdminSettings';

export default function App() {
  // Reactive Database State
  const [dbVersion, setDbVersion] = useState(0);
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search;
    }
    return '/';
  });

  // Admin Session State
  const [adminSession, setAdminSession] = useState<AdminSession>(() => auth.getSession());
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [editingCalculatorId, setEditingCalculatorId] = useState<string | undefined>(undefined);

  // Search Modal
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Listen to Storage updates
  useEffect(() => {
    const unsubStorage = storage.subscribe(() => {
      setDbVersion(v => v + 1);
    });
    const unsubAuth = auth.subscribe(() => {
      setAdminSession(auth.getSession());
    });
    return () => {
      unsubStorage();
      unsubAuth();
    };
  }, []);

  // Listen to Browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation Helper
  const navigate = useCallback((path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Keyboard shortcut Cmd/Ctrl + K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Current Database Data
  const categories = useMemo(() => storage.getCategories(true), [dbVersion]);
  const subcategories = useMemo(() => storage.getSubcategories(undefined, true), [dbVersion]);
  const calculators = useMemo(
    () => storage.getCalculators({ includeInactive: true }),
    [dbVersion]
  );
  const settings = useMemo(() => storage.getSettings(), [dbVersion]);

  // Parse Path
  const cleanPath = currentPath.split('?')[0].replace(/\/+$/, '') || '/';
  const urlParams = new URLSearchParams(currentPath.includes('?') ? currentPath.split('?')[1] : '');
  const pathSegments = cleanPath.split('/').filter(Boolean);

  // Handle Admin Routing
  const isAdminRoute = pathSegments[0] === 'admin';

  const handleOpenCalculatorEditor = (calcId?: string) => {
    setEditingCalculatorId(calcId);
    setAdminTab('calculator-editor');
  };

  // Render Admin View
  if (isAdminRoute) {
    if (!adminSession.isAuthenticated) {
      return (
        <AdminLoginPage
          onSuccess={() => {
            setAdminSession(auth.getSession());
          }}
          onBackToSite={() => navigate('/')}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={tab => {
          if (tab === 'calculator-new') {
            handleOpenCalculatorEditor(undefined);
          } else {
            setAdminTab(tab);
          }
        }}
        onNavigateSite={path => navigate(path)}
        onLogout={() => {
          auth.logout();
        }}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            onNavigateTab={tab => {
              if (tab === 'calculator-new') handleOpenCalculatorEditor(undefined);
              else setAdminTab(tab);
            }}
            onNavigateSite={path => navigate(path)}
          />
        )}
        {adminTab === 'categories' && <AdminCategories />}
        {adminTab === 'subcategories' && <AdminSubcategories />}
        {adminTab === 'calculators' && (
          <AdminCalculators
            onOpenEditor={id => handleOpenCalculatorEditor(id)}
            onNavigateSite={path => navigate(path)}
          />
        )}
        {(adminTab === 'calculator-editor' || adminTab === 'calculator-new') && (
          <AdminCalculatorEditor
            calculatorId={editingCalculatorId}
            onBack={() => setAdminTab('calculators')}
            onSaved={() => setAdminTab('calculators')}
          />
        )}
        {adminTab === 'seo' && <AdminSEO />}
        {adminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // Render Public Website View
  let publicContent: React.ReactNode = null;

  if (cleanPath === '/' || cleanPath === '') {
    // Homepage
    publicContent = (
      <HomePage
        categories={categories}
        subcategories={subcategories}
        calculators={calculators}
        settings={settings}
        onNavigate={navigate}
        onOpenSearch={() => setSearchModalOpen(true)}
      />
    );
  } else if (cleanPath === '/search') {
    // Global Search Page
    publicContent = (
      <SearchPage
        initialQuery={urlParams.get('q') || ''}
        categories={categories}
        subcategories={subcategories}
        calculators={calculators}
        settings={settings}
        onNavigate={navigate}
      />
    );
  } else if (cleanPath === '/sitemap' || cleanPath === '/sitemap.xml') {
    // Dynamic Sitemap & Platform Directory
    publicContent = (
      <SitemapPage
        categories={categories}
        subcategories={subcategories}
        calculators={calculators}
        settings={settings}
        onNavigate={navigate}
      />
    );
  } else if (pathSegments.length === 1) {
    // 1 Segment: /:categorySlug
    const categorySlug = pathSegments[0];
    const category = storage.getCategoryBySlug(categorySlug, false);

    if (category) {
      publicContent = (
        <CategoryPage
          category={category}
          subcategories={subcategories}
          calculators={calculators}
          settings={settings}
          onNavigate={navigate}
        />
      );
    } else {
      // Check if it matches a direct calculator slug without category
      const directCalc = calculators.find(
        c => c.isActive && c.slug.toLowerCase() === categorySlug.toLowerCase()
      );
      if (directCalc) {
        const cat = categories.find(c => c.id === directCalc.categoryId);
        if (cat && cat.isActive) {
          publicContent = (
            <CalculatorPage
              calculator={directCalc}
              category={cat}
              allCalculators={calculators}
              settings={settings}
              onNavigate={navigate}
            />
          );
        }
      }
    }
  } else if (pathSegments.length === 2) {
    // 2 Segments: /:categorySlug/:subcategorySlug OR /:categorySlug/:calculatorSlug
    const [catSlug, secondSlug] = pathSegments;
    const category = storage.getCategoryBySlug(catSlug, false);

    if (category) {
      // Check if second slug is a calculator first
      const calculator = calculators.find(
        c =>
          c.isActive &&
          c.slug.toLowerCase() === secondSlug.toLowerCase()
      );

      if (calculator) {
        const subcategory = calculator.subcategoryId
          ? subcategories.find(s => s.id === calculator.subcategoryId)
          : undefined;
        publicContent = (
          <CalculatorPage
            calculator={calculator}
            category={category}
            subcategory={subcategory}
            allCalculators={calculators}
            settings={settings}
            onNavigate={navigate}
          />
        );
      } else {
        // Otherwise check if second slug is subcategory
        const subcategory = storage.getSubcategoryBySlug(category.id, secondSlug, false);
        if (subcategory) {
          publicContent = (
            <SubcategoryPage
              category={category}
              subcategory={subcategory}
              calculators={calculators}
              settings={settings}
              onNavigate={navigate}
            />
          );
        }
      }
    }
  } else if (pathSegments.length >= 3) {
    // 3+ Segments: /:categorySlug/:subcategorySlug/:calculatorSlug or deep aliases
    const [catSlug, subSlug] = pathSegments;
    const calcSlug = pathSegments[pathSegments.length - 1];
    const match = storage.getCalculatorBySlug(catSlug, subSlug, calcSlug, false);

    if (match) {
      publicContent = (
        <CalculatorPage
          calculator={match.calculator}
          category={match.category}
          subcategory={match.subcategory}
          allCalculators={calculators}
          settings={settings}
          onNavigate={navigate}
        />
      );
    } else {
      // Direct lookup by calculator slug across database
      const foundCalc = calculators.find(
        c => c.isActive && c.slug.toLowerCase() === calcSlug.toLowerCase()
      );
      if (foundCalc) {
        const foundCat = categories.find(c => c.id === foundCalc.categoryId);
        if (foundCat && foundCat.isActive) {
          const foundSub = foundCalc.subcategoryId
            ? subcategories.find(s => s.id === foundCalc.subcategoryId)
            : undefined;
          publicContent = (
            <CalculatorPage
              calculator={foundCalc}
              category={foundCat}
              subcategory={foundSub}
              allCalculators={calculators}
              settings={settings}
              onNavigate={navigate}
            />
          );
        }
      }
    }
  }

  // 404 Fallback if no matching public page
  if (!publicContent) {
    // Final check for any path that ends with a valid calculator slug
    const lastSlug = pathSegments[pathSegments.length - 1];
    const fallbackCalc = lastSlug
      ? calculators.find(c => c.isActive && c.slug.toLowerCase() === lastSlug.toLowerCase())
      : undefined;

    if (fallbackCalc) {
      const fbCat = categories.find(c => c.id === fallbackCalc.categoryId);
      if (fbCat && fbCat.isActive) {
        const fbSub = fallbackCalc.subcategoryId
          ? subcategories.find(s => s.id === fallbackCalc.subcategoryId)
          : undefined;
        publicContent = (
          <CalculatorPage
            calculator={fallbackCalc}
            category={fbCat}
            subcategory={fbSub}
            allCalculators={calculators}
            settings={settings}
            onNavigate={navigate}
          />
        );
      }
    }
  }

  if (!publicContent) {
    publicContent = (
      <div className="w-full px-6 py-20">
        <EmptyState
          title="Page Not Found (404)"
          description={`The requested page "${cleanPath}" does not exist or has been disabled by the administrator.`}
          actionText="Return to Homepage"
          onAction={() => navigate('/')}
          secondaryText="Search Calculators"
          onSecondaryAction={() => setSearchModalOpen(true)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Global Clean Header */}
      <Header
        categories={categories}
        settings={settings}
        isAdminAuthenticated={adminSession.isAuthenticated}
        onNavigate={navigate}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Full-Width Content View */}
      <main className="flex-1 w-full">{publicContent}</main>

      {/* Global Clean Footer */}
      <Footer categories={categories} settings={settings} onNavigate={navigate} />

      {/* Instant Global Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        calculators={calculators}
        categories={categories}
        subcategories={subcategories}
        onNavigate={navigate}
      />
    </div>
  );
}
