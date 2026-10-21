import React, { useState, useEffect } from 'react';
import { AuthContext } from './auth-context-instance';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [isDemoUser, setIsDemoUser] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    let subscription = null;

    // 1. Fetch initial session from Supabase
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (error) {
        console.error('Error fetching Supabase session:', error.message);
      }
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setIsLoading(false);
    });

    // 2. Listen to Supabase auth state changes (sign in, sign out, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    subscription = authListener?.subscription;

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Format Supabase authentication errors with actionable guidance
  const formatAuthError = (err) => {
    if (!err) return 'An unexpected authentication error occurred.';
    const message = (typeof err === 'string' ? err : err.message || '').trim();
    const lower = message.toLowerCase();

    if (lower.includes('rate limit') || lower.includes('over_email_send_rate_limit')) {
      return 'Supabase email rate limit exceeded. On the Supabase free tier, confirmation emails are rate-limited. In your Supabase Dashboard, go to Authentication -> Providers -> Email and turn OFF "Confirm email" to enable instant signups for all accounts.';
    }

    if (lower.includes('email not confirmed')) {
      return 'Email address is not confirmed yet. Check your inbox/spam folder for the confirmation link, or disable "Confirm email" in Supabase Dashboard (Authentication -> Providers -> Email) for instant access.';
    }

    if (lower.includes('user already registered') || lower.includes('already exists')) {
      return 'An account with this email already exists. Please switch to "Sign In" or reset your password.';
    }

    if (lower.includes('signups not allowed') || lower.includes('signup is disabled')) {
      return 'Signups are currently disabled in your Supabase project. Enable "Allow new users to sign up" in Supabase Dashboard -> Authentication -> Configuration.';
    }

    if (lower.includes('invalid login credentials') || lower.includes('invalid credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }

    return message || 'Authentication failed. Please verify your details and try again.';
  };

  // Supabase Email & Password Login
  const loginWithEmail = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      return { 
        success: false, 
        error: 'Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.' 
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        return { success: false, error: formatAuthError(error) };
      }

      setSession(data.session);
      setUser(data.user);
      setIsDemoUser(false);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: formatAuthError(err) };
    }
  };

  // Supabase Email & Password Sign Up (Open for any email/user account)
  const signUpWithEmail = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      return { 
        success: false, 
        error: 'Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.' 
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (error) {
        return { success: false, error: formatAuthError(error) };
      }

      const needsConfirmation = !data.session;
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        setIsDemoUser(false);
      }

      return { 
        success: true, 
        user: data.user, 
        needsConfirmation 
      };
    } catch (err) {
      return { success: false, error: formatAuthError(err) };
    }
  };

  // Supabase Password Reset Request
  const resetPassword = async (email) => {
    if (!isSupabaseConfigured || !supabase) {
      return { 
        success: false, 
        error: 'Supabase is not configured yet. Please check your .env settings.' 
      };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      });

      if (error) {
        return { success: false, error: formatAuthError(error) };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: formatAuthError(err) };
    }
  };

  // Demo fallback preview login (when Supabase credentials are not yet configured)
  const loginDemo = () => {
    setIsDemoUser(true);
    setUser({
      id: 'demo-user-12345',
      email: 'user@primefiles.local',
      user_metadata: { full_name: 'PrimeFiles User' },
    });
  };

  // Logout handler
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error signing out of Supabase:', err);
      }
    }
    setSession(null);
    setUser(null);
    setIsDemoUser(false);
  };

  const isAuthenticated = Boolean(session || isDemoUser);

  const value = {
    isAuthenticated,
    user,
    session,
    isLoading,
    isSupabaseConfigured,
    isDemoUser,
    loginWithEmail,
    signUpWithEmail,
    resetPassword,
    loginDemo,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
