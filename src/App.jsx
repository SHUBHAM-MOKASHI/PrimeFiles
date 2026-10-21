import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './components/dashboard/Dashboard';
import PrimeFilesLogo from './components/common/PrimeFilesLogo';

function ProtectedRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  // Full-screen loading state during initial session check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col items-center justify-center p-4">
        <PrimeFilesLogo size="lg" showTagline={true} />
        <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          <span>Verifying secure session...</span>
        </div>
      </div>
    );
  }

  // Protected route logic
  return isAuthenticated ? <Dashboard /> : <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoutes />
    </AuthProvider>
  );
}
