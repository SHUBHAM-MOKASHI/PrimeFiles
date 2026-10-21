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
        return { success: false, error: error.message };
      }

      setSession(data.session);
      setUser(data.user);
      setIsDemoUser(false);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message || 'An unexpected error occurred during login' };
    }
  };

  // Supabase Email & Password Sign Up
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
        return { success: false, error: error.message };
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
      return { success: false, error: err.message || 'An unexpected error occurred during registration' };
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
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to send password reset email' };
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
