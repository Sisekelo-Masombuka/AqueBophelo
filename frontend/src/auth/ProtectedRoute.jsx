import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

export function ProtectedRoute({ allowedRoles, children }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-brand-navy">
        <Loader2 className="mb-3 h-8 w-8 animate-spin text-brand-droplet" />
        <p className="text-sm text-slate-500">Verifying session...</p>
      </div>
    );
  }

  // Not logged in -> send to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="mx-auto mt-16 max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-[0_14px_36px_rgba(15,39,63,0.06)]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="mb-2 text-lg font-bold text-brand-navy-dark">Access Restricted</h2>
        <p className="mb-6 text-xs text-slate-500">
          This portal requires <span className="font-semibold text-brand-blue">{allowedRoles.join(' or ')}</span> privileges.
          You are currently signed in as <span className="font-semibold text-brand-navy-dark">{user.role}</span>.
        </p>
        <Navigate to="/dashboard" replace />
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
