import React, { useState } from 'react';
import { LogOut, Laptop, Smartphone, Monitor, ShieldCheck, Upload } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import PrimeFilesLogo from './PrimeFilesLogo';

export default function Navbar({ onUploadClick }) {
  const { user, logout, isSupabaseConfigured } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userEmail = user?.email || 'user@primefiles.local';
  const displayName = user?.user_metadata?.full_name || userEmail.split('@')[0];
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0b1120]/80 backdrop-blur-md border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <PrimeFilesLogo size="sm" showTagline={false} />
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950/70 text-blue-400 border border-blue-800/60">
            <ShieldCheck className="w-3 h-3" />
            {isSupabaseConfigured ? 'Cloud Vault' : 'Local Preview'}
          </span>
        </div>

        {/* Center: Device Sync Info (visible on md+) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 text-xs text-slate-400 border border-slate-800">
          <span className="font-medium text-slate-500">Cross-device:</span>
          <span className="flex items-center gap-1 font-semibold text-slate-300">
            <Smartphone className="w-3.5 h-3.5 text-blue-400" /> Phone
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1 font-semibold text-slate-300">
            <Laptop className="w-3.5 h-3.5 text-blue-400" /> Laptop
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1 font-semibold text-slate-300">
            <Monitor className="w-3.5 h-3.5 text-blue-400" /> College PC
          </span>
        </div>

        {/* Right Side: Upload Shortcut, User Profile & Logout */}
        <div className="flex items-center gap-3">
          {onUploadClick && (
            <button
              onClick={onUploadClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-sm shadow-blue-600/20 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
          )}

          <div className="flex items-center gap-2.5 pl-2">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>
            <div className="hidden sm:block text-left max-w-[150px]">
              <p className="text-xs font-semibold text-slate-200 leading-none truncate" title={userEmail}>
                {displayName}
              </p>
              <p className="text-[10px] text-slate-400 font-mono font-medium truncate mt-0.5" title={userEmail}>
                {userEmail}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-900/50 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            title="Log out of PrimeFiles"
          >
            {isLoggingOut ? (
              <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-rose-500 rounded-full animate-spin" />
            ) : (
              <LogOut className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>

      </div>
    </header>
  );
}
