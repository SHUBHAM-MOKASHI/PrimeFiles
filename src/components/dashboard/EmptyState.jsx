import React from 'react';
import { CloudUpload, Search, RefreshCw, Upload } from 'lucide-react';

export default function EmptyState({ isFiltered = false, searchQuery = '', onResetSearch, onUploadClick }) {
  if (isFiltered) {
    return (
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-12 text-center text-slate-100">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-4">
          <Search className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-white mb-1">
          No files matching "{searchQuery}"
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
          We couldn't find any files matching your search filter. Try searching with a different filename.
        </p>
        <button
          onClick={onResetSearch}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Clear Filter
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-100">
      <div className="w-16 h-16 rounded-2xl bg-blue-950/60 border border-blue-800/40 text-blue-400 mx-auto flex items-center justify-center mb-4 shadow-sm">
        <CloudUpload className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">
        Your PrimeFiles drive is empty
      </h3>
      <p className="text-xs text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
        Upload files from your phone or laptop. Later, log in from any device — including your college PC — to securely download them anytime.
      </p>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onUploadClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          Upload Your First File
        </button>
      </div>
    </div>
  );
}
