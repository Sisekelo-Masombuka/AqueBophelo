import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

export function ProtectedRoute({ allowedRoles, children }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center text-[#E6EDF7]">
        <Loader2 className="w-8 h-8 text-[#22D3EE] animate-spin mb-3" />
        <p className="text-sm text-[#8A9BB8]">Verifying session...</p>
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
      <div className="max-w-md mx-auto mt-16 p-6 bg-[#111B2E] border border-[#EF4444]/30 rounded-xl text-center shadow-lg">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#E6EDF7] mb-2">Access Restricted</h2>
        <p className="text-xs text-[#8A9BB8] mb-6">
          This portal requires <span className="font-semibold text-[#22D3EE]">{allowedRoles.join(' or ')}</span> privileges.
          You are currently signed in as <span className="font-semibold text-[#E6EDF7]">{user.role}</span>.
        </p>
        <Navigate to="/dashboard" replace />
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
