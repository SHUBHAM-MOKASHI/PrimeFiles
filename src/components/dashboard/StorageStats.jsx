import React from 'react';
import { Files, HardDrive, Smartphone, Laptop, Monitor, Sparkles } from 'lucide-react';
import { formatBytes } from '../../utils/formatters';

export default function StorageStats({ files = [], onUploadClick }) {
  const totalBytes = files.reduce((acc, f) => acc + (f.sizeBytes || 0), 0);
  const totalFormatted = formatBytes(totalBytes);
  const limitBytes = 15 * 1024 * 1024 * 1024; // 15 GB
  const percentage = Math.min(100, Math.max(0.5, (totalBytes / limitBytes) * 100)).toFixed(1);

  // Count by device / origin
  const deviceCounts = files.reduce((acc, f) => {
    const dev = f.device || 'Cloud Storage';
    acc[dev] = (acc[dev] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      
      {/* Storage Used Card */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-800/40">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Storage Used</h3>
              <p className="text-lg font-bold text-slate-100">{totalFormatted} <span className="text-xs font-normal text-slate-500">/ 15 GB</span></p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-blue-400 border border-slate-700">
            {percentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(percentage, 2)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Free Tier quota</span>
            <span>{(15 - (totalBytes / (1024 * 1024 * 1024))).toFixed(1)} GB available</span>
          </p>
        </div>
      </div>

      {/* Files Count Card */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
              <Files className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Files</h3>
              <p className="text-lg font-bold text-slate-100">{files.length} <span className="text-xs font-normal text-slate-500">in personal cloud</span></p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
          <span className="flex items-center gap-1 font-medium">
            <Laptop className="w-3.5 h-3.5 text-slate-500" />
            {deviceCounts['Laptop'] || 0} Laptop
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1 font-medium">
            <Smartphone className="w-3.5 h-3.5 text-slate-500" />
            {deviceCounts['Phone'] || 0} Phone
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1 font-medium">
            <Monitor className="w-3.5 h-3.5 text-slate-500" />
            {deviceCounts['College PC'] || 0} College PC
          </span>
        </div>
      </div>

      {/* Tagline & Upload Banner */}
      <div className="bg-gradient-to-br from-blue-900/70 via-slate-900 to-indigo-950/70 rounded-2xl p-5 border border-blue-800/40 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> PrimeFiles Storage
            </span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/20 font-medium px-2 py-0.5 rounded-full">
              Private Bucket
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            <strong>Your files, everywhere.</strong> Upload files from your phone or laptop, and safely download them on any PC.
          </p>
        </div>

        <div className="pt-3">
          <button
            onClick={onUploadClick}
            className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Upload File</span>
          </button>
        </div>
      </div>

    </div>
  );
}
