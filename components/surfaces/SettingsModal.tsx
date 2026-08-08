'use client';

import React, { useState, useEffect } from 'react';
import { AppSettings } from '@/lib/types';
import { Settings as SettingsIcon, Key, Cpu, Check, X, Eye, EyeOff, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
  currentSettings: AppSettings;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentSettings,
}) => {
  const [apiKey, setApiKey] = useState(currentSettings.apiKey || '');
  const [model, setModel] = useState(currentSettings.model || 'gemini-3.5-flash-lite');
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setApiKey(currentSettings.apiKey || '');
    setModel(currentSettings.model || 'gemini-3.5-flash-lite');
  }, [currentSettings]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ apiKey, model });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 500);
  };

  const models = [
    { id: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash-Lite (Recommended)' },
    { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash-Lite' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate border border-slate-border rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-surface-muted hover:text-white p-1 rounded-lg hover:bg-slate-border/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-border pb-4">
          <div className="w-10 h-10 rounded-xl bg-crimson/20 border border-crimson/40 flex items-center justify-center text-crimson">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl uppercase tracking-wide text-white">
              Studio Engine Settings
            </h2>
            <span className="font-mono text-[10px] text-cyan uppercase tracking-widest block">
              CONFIGURE GEMINI API KEY & MODEL
            </span>
          </div>
        </div>

        {/* Form Controls */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Gemini API Key Input */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs text-gold uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter Gemini API key..."
                className="w-full bg-charcoal border border-slate-border rounded-lg px-3.5 py-2.5 font-mono text-xs text-surface-text focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-muted hover:text-white"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="font-sans text-[11px] text-surface-muted">
              API keys are stored safely in browser session state & localStorage.
            </p>
          </div>

          {/* Model Selector */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs text-cyan uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> AI Model Selection
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-charcoal border border-slate-border rounded-lg px-3.5 py-2.5 font-mono text-xs text-surface-text focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-crimson hover:bg-crimson-dark text-white font-display font-bold text-sm uppercase tracking-wider py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all focus-visible:ring-2 focus-visible:ring-crimson"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-gold" /> Settings Saved!
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
