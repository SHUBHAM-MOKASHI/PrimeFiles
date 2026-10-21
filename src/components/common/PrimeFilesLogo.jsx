import React from 'react';
import { Cloud, Folder } from 'lucide-react';

export default function PrimeFilesLogo({ size = 'md', showTagline = false }) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-3">
      {/* Cloud/Folder Icon Badge */}
      <div className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/25 shrink-0`}>
        <Cloud className="w-5 h-5 opacity-90" />
        <Folder className="w-3.5 h-3.5 absolute bottom-1 right-1 text-blue-100 drop-shadow-xs" />
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span className={`font-bold tracking-tight text-white ${textSizes[size]}`}>
            Prime<span className="text-blue-400">Files</span>
          </span>
        </div>
        {showTagline && (
          <p className="text-[11px] text-slate-400 font-medium tracking-wide">
            Your files, everywhere.
          </p>
        )}
      </div>
    </div>
  );
}
