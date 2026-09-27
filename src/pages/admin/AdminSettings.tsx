import React, { useState } from 'react';
import {
  Settings,
  Shield,
  KeyRound,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertCircle,
  Database,
} from 'lucide-react';
import { SiteSettings } from '../../types';
import { storage } from '../../services/storage';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(() => storage.getSettings());
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importMsg, setImportMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storage.updateSettings(settings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setPasswordMsg({ type: 'error', text: 'Password cannot be empty.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    storage.updateAdminPassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordMsg({ type: 'success', text: 'Admin password updated successfully!' });
    setTimeout(() => setPasswordMsg(null), 3000);
  };

  const handleExportDatabase = () => {
    const jsonStr = storage.exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculator-platform-db-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportDatabase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJson.trim()) {
      setImportMsg({ type: 'error', text: 'Please paste database JSON to import.' });
      return;
    }

    const res = storage.importDatabaseJson(importJson);
    if (res.success) {
      setImportJson('');
      setSettings(storage.getSettings());
      setImportMsg({ type: 'success', text: 'Database imported successfully!' });
      setTimeout(() => setImportMsg(null), 3000);
    } else {
      setImportMsg({ type: 'error', text: res.error || 'Failed to import JSON.' });
    }
  };

  const handleResetDatabase = () => {
    storage.resetDatabase();
    setSettings(storage.getSettings());
    setIsResetModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Platform Settings & Database
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure global website settings, administrator credentials, and database backups.
          </p>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">General Website Configuration</h2>
            <p className="text-xs text-slate-500">Global site name, tagline, and default currency.</p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Website Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={settings.currencySymbol}
                onChange={e => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm font-mono text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Website Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={e => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Global Meta Description
            </label>
            <textarea
              value={settings.metaDescription}
              onChange={e => setSettings({ ...settings, metaDescription: e.target.value })}
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {settingsSaved && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Settings updated!</span>
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Save Website Settings
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Change Admin Password</h2>
            <p className="text-xs text-slate-500">Update your dashboard authentication password.</p>
          </div>
        </div>

        {passwordMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              passwordMsg.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            {passwordMsg.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Update Admin Password
            </button>
          </div>
        </form>
      </div>

      {/* Database Backup & Export/Import */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Database Management & Backup</h2>
            <p className="text-xs text-slate-500">
              Export full platform data to JSON, restore from backup, or reset database.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export Database Backup</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Download complete snapshot of categories, subcategories, calculators, and configuration in JSON format.
            </p>
            <button
              onClick={handleExportDatabase}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Database JSON</span>
            </button>
          </div>

          {/* Reset */}
          <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3">
            <h3 className="font-bold text-sm text-rose-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>Reset to Clean 0-State</span>
            </h3>
            <p className="text-xs text-rose-700/80 leading-relaxed">
              Completely clear all categories, subcategories, and calculators to return to the initial 0-seed installation state.
            </p>
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Database to 0</span>
            </button>
          </div>
        </div>

        {/* Import JSON */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Upload className="w-4 h-4 text-slate-700" />
            <span>Restore / Import Database JSON</span>
          </h3>

          {importMsg && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                importMsg.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {importMsg.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{importMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleImportDatabase} className="space-y-3">
            <textarea
              value={importJson}
              onChange={e => setImportJson(e.target.value)}
              rows={4}
              placeholder="Paste exported database JSON content here..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 font-mono p-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Import & Replace Database
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset Entire Database to 0?"
        message="This will wipe all categories, subcategories, and calculators, resetting the platform back to a fresh 0-data installation. This action cannot be undone."
        confirmText="Yes, Reset Everything"
        onConfirm={handleResetDatabase}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
