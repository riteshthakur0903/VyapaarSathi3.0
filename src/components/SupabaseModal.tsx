import React, { useState } from 'react';
import {
  configureSupabase,
  SUPABASE_SQL_SCHEMA,
  isUsingSupabaseCloud,
  supabase,
} from '../services/supabase';
import { Database, Copy, Check, X, Shield, AlertCircle, RefreshCw, Key } from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [url, setUrl] = useState(
    localStorage.getItem('vyapaarsathi_supabase_url') || import.meta.env.VITE_SUPABASE_URL || ''
  );
  const [anonKey, setAnonKey] = useState(
    localStorage.getItem('vyapaarsathi_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  );

  const [copiedSql, setCopiedSql] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestStatus(null);

    const configured = configureSupabase(url.trim(), anonKey.trim());
    if (!configured) {
      setTestStatus('Cleared cloud connection. Running in local storage mode.');
      setTesting(false);
      return;
    }

    try {
      if (supabase) {
        const { error } = await supabase.from('profiles').select('id').limit(1);
        if (error) {
          setTestStatus(`Connected to Supabase endpoint, but table query returned: ${error.message}. Ensure you ran the SQL schema below in your Supabase SQL Editor.`);
        } else {
          setTestStatus('Success! Connected to Supabase and verified tables & RLS policies.');
        }
      }
    } catch (err: any) {
      setTestStatus(`Connection error: ${err.message || 'Check your URL and API Key.'}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-stone-200 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Database className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Supabase Database Integration</h2>
              <span className="text-xs text-stone-600">
                {isUsingSupabaseCloud ? 'Connected to Cloud Instance' : 'Active in Local Storage Mode'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-600 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Pill */}
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
            isUsingSupabaseCloud
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-medium'
              : 'bg-stone-50 border-stone-200 text-stone-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              {isUsingSupabaseCloud
                ? 'Cloud Sync Active: Profiles, DPR reports & calculations replicate to your Supabase tables.'
                : 'Local Offline Mode: All features save locally. Add credentials below for cloud synchronization.'}
            </span>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSaveAndTest} className="space-y-4">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Connection Credentials
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Supabase Project URL (VITE_SUPABASE_URL)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-project-id.supabase.co"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Supabase Anon / Public API Key (VITE_SUPABASE_ANON_KEY)
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
              />
            </div>
          </div>

          {testStatus && (
            <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 text-xs text-stone-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
              <span>{testStatus}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={testing}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-2"
            >
              {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
              <span>Save & Test Connection</span>
            </button>
          </div>
        </form>

        {/* Copyable SQL Schema Script */}
        <div className="space-y-3 pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Supabase SQL Schema Script (with RLS Policies)
            </h3>
            <button
              onClick={handleCopySql}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy SQL Script</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-stone-900 text-stone-200 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto max-h-48 border border-stone-800 leading-relaxed">
            <pre>{SUPABASE_SQL_SCHEMA}</pre>
          </div>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            Copy and paste this SQL into the <strong>SQL Editor</strong> tab of your Supabase project dashboard. It creates the 4 core tables (<code>profiles</code>, <code>saved_businesses</code>, <code>loan_calculations</code>, <code>feasibility_reports</code>) and applies Row Level Security (RLS).
          </p>
        </div>
      </div>
    </div>
  );
};
