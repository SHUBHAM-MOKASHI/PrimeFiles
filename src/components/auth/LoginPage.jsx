import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Laptop, 
  Smartphone, 
  Monitor, 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown,
  ChevronUp,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import PrimeFilesLogo from '../common/PrimeFilesLogo';

export default function LoginPage() {
  const { 
    loginWithEmail, 
    signUpWithEmail, 
    resetPassword,
    loginDemo, 
    isSupabaseConfigured 
  } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (mode === 'forgot') {
      setIsSubmitting(true);
      const res = await resetPassword(email);
      setIsSubmitting(false);
      if (res.success) {
        setSuccessMessage('Password reset instructions sent! Please check your inbox.');
      } else {
        setError(res.error || 'Failed to send reset email.');
      }
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    if (mode === 'login') {
      const res = await loginWithEmail(email, password);
      if (!res.success) {
        setError(res.error || 'Failed to sign in. Please verify your credentials.');
        setIsSubmitting(false);
      }
    } else if (mode === 'signup') {
      const res = await signUpWithEmail(email, password);
      if (!res.success) {
        setError(res.error || 'Failed to create PrimeFiles account.');
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
        if (res.needsConfirmation) {
          setSuccessMessage('Account created! Please check your email to confirm registration, then sign in.');
          setMode('login');
        } else {
          setSuccessMessage('Account created successfully! Entering your cloud vault...');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <PrimeFilesLogo size="lg" showTagline={false} />
          <p className="mt-2 text-sm text-slate-400 font-medium">
            Your files, everywhere.
          </p>
        </div>

        {/* Supabase Status / Setup Guide */}
        {!isSupabaseConfigured && (
          <div className="mb-5 bg-amber-950/40 border border-amber-600/40 rounded-2xl p-4 shadow-lg backdrop-blur-md">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <h3 className="text-xs font-bold text-amber-200">Supabase Setup Required</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSetupGuide(!showSetupGuide)}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                {showSetupGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>{showSetupGuide ? 'Hide Guide' : 'Setup Guide'}</span>
              </button>
            </div>

            {showSetupGuide && (
              <div className="mt-3 text-[11px] text-amber-200/90 space-y-2 border-t border-amber-600/30 pt-2.5 leading-relaxed">
                <p>
                  To connect your real cloud storage, add your keys to the <code className="bg-amber-900/50 px-1 py-0.5 rounded font-mono text-amber-200">.env</code> file:
                </p>
                <div className="bg-slate-950 text-slate-200 p-2.5 rounded-xl font-mono text-[10px] border border-slate-800 select-all">
                  <code>VITE_SUPABASE_URL=https://your-project.supabase.co<br />VITE_SUPABASE_ANON_KEY=your-anon-key</code>
                </div>
              </div>
            )}

            <div className="mt-3 pt-2.5 border-t border-amber-600/30 flex items-center justify-between">
              <span className="text-[11px] text-amber-300/80 font-medium">Test interface preview:</span>
              <button
                type="button"
                onClick={loginDemo}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Open Demo Preview
              </button>
            </div>
          </div>
        )}

        {/* Auth Card */}
        <div className="bg-slate-900/90 backdrop-blur-md py-7 px-6 sm:px-8 shadow-2xl rounded-2xl border border-slate-800">
          
          {/* Header tabs */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                {mode === 'login' && 'Sign In'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot' && 'Reset Password'}
              </span>
            </div>

            {mode === 'forgot' ? (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setSuccessMessage('');
                }}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError('');
                  setSuccessMessage('');
                }}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
              >
                {mode === 'login' ? 'Create new account' : 'Already have account?'}
              </button>
            )}
          </div>

          {/* Feedback banners */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field (not shown in forgot mode) */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label 
                    htmlFor="password" 
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setError('');
                        setSuccessMessage('');
                      }}
                      className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'login' ? 'Enter your password' : 'Create a secure password (6+ chars)'}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-md shadow-blue-600/30 transition-all duration-150 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Sign In to PrimeFiles'}
                    {mode === 'signup' && 'Create PrimeFiles Account'}
                    {mode === 'forgot' && 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Preview shortcut for testing */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={loginDemo}
              className="text-xs text-slate-400 hover:text-blue-400 font-medium transition-colors cursor-pointer"
            >
              Or preview dashboard in demo mode →
            </button>
          </div>

        </div>

        {/* Cross-device workflow footer */}
        <div className="mt-8 text-center">
          <p className="text-xs font-medium text-slate-500 mb-2.5">
            Access your personal files across all your devices
          </p>
          <div className="inline-flex items-center gap-4 sm:gap-6 text-xs text-slate-400 bg-slate-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-800 shadow-sm">
            <span className="flex items-center gap-1.5 font-medium">
              <Smartphone className="w-3.5 h-3.5 text-blue-400" /> Phone
            </span>
            <span className="text-slate-600">→</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Laptop className="w-3.5 h-3.5 text-blue-400" /> Laptop
            </span>
            <span className="text-slate-600">→</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Monitor className="w-3.5 h-3.5 text-blue-400" /> College PC
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
