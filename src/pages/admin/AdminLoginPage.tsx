import React, { useState } from 'react';
import { Shield, KeyRound, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { auth } from '../../services/auth';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onBackToSite }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter the administrator password.');
      return;
    }

    const success = auth.login(password);
    if (success) {
      setError('');
      onSuccess();
    } else {
      setError('Invalid password. Default installation password is "admin123".');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-6">
        {/* Back Button */}
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public Website</span>
        </button>

        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Sign in to manage categories, subcategories, and calculators.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Admin Password
            </label>
            <div className="relative flex items-center">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter password (default: admin123)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm shadow-emerald-600/20 transition-all cursor-pointer active:scale-95"
          >
            Authenticate & Access Dashboard
          </button>
        </form>

        {/* Default Note */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
          <div className="font-bold text-slate-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Default Installation Access</span>
          </div>
          <p>
            Default password is <code className="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">admin123</code>. You can change it anytime in Admin Settings.
          </p>
        </div>
      </div>
    </div>
  );
};
