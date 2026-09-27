import React from 'react';
import {
  LayoutDashboard,
  Layers,
  FolderTree,
  Calculator,
  Sliders,
  FileCode2,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  PlusCircle,
} from 'lucide-react';
import { storage } from '../../services/storage';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onNavigateSite: (path: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onNavigateSite,
  onLogout,
  children,
}) => {
  const stats = storage.getStats();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: Layers,
      count: stats.totalCategories,
    },
    {
      id: 'subcategories',
      label: 'Subcategories',
      icon: FolderTree,
      count: stats.totalSubcategories,
    },
    {
      id: 'calculators',
      label: 'Calculators',
      icon: Calculator,
      count: stats.totalCalculators,
    },
    {
      id: 'seo',
      label: 'SEO & Sitemap',
      icon: FileCode2,
    },
    {
      id: 'settings',
      label: 'Settings & DB',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Admin Topbar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white h-16 px-4 sm:px-8 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight block">
              Admin Platform Control
            </span>
            <span className="text-[10px] text-emerald-400 font-medium block">
              Global Calculator CMS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateSite('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Admin Main Body with Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 space-y-6 shrink-0">
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Management
            </div>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                        isActive
                          ? 'bg-emerald-700 text-emerald-100'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Create Calculator shortcut */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => onSelectTab('calculator-new')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Create Calculator</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
