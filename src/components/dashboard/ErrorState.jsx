import React from 'react';
import { AlertOctagon, RotateCw } from 'lucide-react';

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="bg-rose-950/40 rounded-2xl border border-rose-800/60 p-8 text-center text-slate-100">
      <div className="w-14 h-14 rounded-2xl bg-rose-900/40 border border-rose-700/50 text-rose-400 mx-auto flex items-center justify-center mb-4">
        <AlertOctagon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-white mb-1">
        Failed to load files from storage
      </h3>
      <p className="text-xs text-rose-300/90 max-w-md mx-auto mb-5 leading-relaxed">
        {error || 'An error occurred while connecting to your Supabase private storage bucket. Ensure the bucket "primefiles-storage" exists and storage policies are applied.'}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-rose-600/30 transition-colors cursor-pointer"
      >
        <RotateCw className="w-3.5 h-3.5" />
        Retry Loading
      </button>
    </div>
  );
}
