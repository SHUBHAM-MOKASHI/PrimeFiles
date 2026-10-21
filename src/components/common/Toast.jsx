import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
  };

  const borders = {
    info: 'border-blue-800/80 bg-blue-950/90 text-blue-100',
    success: 'border-emerald-800/80 bg-emerald-950/90 text-emerald-100',
    warning: 'border-amber-800/80 bg-amber-950/90 text-amber-100',
    error: 'border-rose-800/80 bg-rose-950/90 text-rose-100',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md ${
          borders[toast.type || 'info']
        }`}
      >
        {icons[toast.type || 'info']}
        <div className="flex-1 pr-2">
          {toast.title && <h4 className="text-sm font-semibold mb-0.5 text-white">{toast.title}</h4>}
          <p className="text-xs leading-relaxed opacity-90">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg cursor-pointer"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
