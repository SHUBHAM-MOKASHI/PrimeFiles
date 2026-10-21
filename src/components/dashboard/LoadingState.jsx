import React from 'react';

export default function LoadingState() {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="h-5 w-40 bg-slate-800 rounded-md"></div>
        <div className="h-5 w-24 bg-slate-800/60 rounded-md"></div>
      </div>

      {/* Row skeletons */}
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="flex items-center justify-between py-3 border-b border-slate-800/40 last:border-0"
        >
          <div className="flex items-center gap-3 w-1/3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 shrink-0"></div>
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-4/5 bg-slate-800 rounded"></div>
              <div className="h-3 w-1/2 bg-slate-800/60 rounded"></div>
            </div>
          </div>
          <div className="h-4 w-16 bg-slate-800 rounded hidden sm:block"></div>
          <div className="h-4 w-20 bg-slate-800/60 rounded hidden md:block"></div>
          <div className="h-4 w-28 bg-slate-800/60 rounded hidden lg:block"></div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-20 bg-slate-800 rounded-lg"></div>
            <div className="h-8 w-8 bg-slate-800/60 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
