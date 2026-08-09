'use client';

import React, { useState, useEffect } from 'react';
import { AppSettings } from '@/lib/types';
import { Settings as SettingsIcon, Key, Cpu, Check, X, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Card, Badge, Button, SectionHeader } from '../ui';
import { motion, AnimatePresence } from 'framer-motion';

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md"
        >
          <Card variant="elevated" depth="high" className="p-6 space-y-6 relative border-crimson/40">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 min-w-0"
              title="Close Settings"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Modal Header using SectionHeader primitive */}
            <SectionHeader
              label="CONFIGURE GEMINI API KEY & MODEL"
              title="Studio Engine Settings"
              action={
                <Badge variant="crimson" size="sm" icon={<SettingsIcon className="w-3.5 h-3.5" />}>
                  API ENGINE
                </Badge>
              }
            />

            {/* Form Controls */}
            <form onSubmit={handleSave} className="space-y-4">
              {/* Gemini API Key Input */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-gold uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-gold" /> Gemini API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter Gemini API key..."
                    className="w-full bg-charcoal border border-slate-border rounded-lg px-3.5 py-2.5 font-mono text-xs text-surface-text focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 min-w-0"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="font-sans text-[11px] text-surface-muted">
                  API keys are stored safely in browser session state & localStorage.
                </p>
              </div>

              {/* Model Selector */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-cyan uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan" /> AI Model Selection
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
                <Button
                  type="submit"
                  variant={savedSuccess ? 'gold' : 'primary'}
                  size="lg"
                  className="w-full shadow-lg"
                  icon={savedSuccess ? <Check className="w-4 h-4 text-charcoal" /> : <Sparkles className="w-4 h-4" />}
                >
                  {savedSuccess ? 'Settings Saved!' : 'Save Settings'}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
