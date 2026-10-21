import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ isOpen, title, message, confirmText = 'Delete', isDeleting = false, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-6 overflow-hidden transform transition-all text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-950/60 border border-rose-800/40 text-rose-400 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="text-slate-500 hover:text-slate-300 p-1 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 rounded-xl transition-colors shadow-md shadow-rose-600/30 cursor-pointer disabled:opacity-50"
          >
            {isDeleting && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            <span>{isDeleting ? 'Deleting...' : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
