import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved credentials from localStorage on startup
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('aquabophelo_token');
      const savedUser = localStorage.getItem('aquabophelo_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } else {
        // Visitors start unauthenticated so they land on the login/register screen
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.error('Failed to load auth state from localStorage:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveAuthSession = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('aquabophelo_token', authToken);
    localStorage.setItem('aquabophelo_user', JSON.stringify(authUser));
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // 1. Attempt live API login
      const response = await apiClient.post('/api/v1/auth/login', { email, password });
      if (response.data && response.data.token) {
        const loggedUser = {
          id: response.data.userId || 'usr-1',
          email: response.data.email || email,
          fullName: response.data.fullName || email.split('@')[0],
          role: response.data.role || 'Resident',
        };
        saveAuthSession(response.data.token, loggedUser);
        return { success: true, user: loggedUser };
      }
      return { success: false, error: 'Login response missing authentication token.' };
    } catch (apiError) {
      // If backend responded with an HTTP status code (e.g. 401 Unauthorized for wrong password, 400 Bad Request)
      if (apiError.response) {
        const errorMsg = apiError.response.data?.message || 'Invalid email or password.';
        return { success: false, error: errorMsg };
      }

      // 2. ONLY evaluate offline demo mode fallback on genuine network connection failure (e.g. ERR_NETWORK, timeout)
      const isNetworkFailure =
        apiError.code === 'ERR_NETWORK' ||
        apiError.code === 'ECONNABORTED' ||
        (apiError.request && !apiError.response);

      if (isNetworkFailure) {
        console.warn('Backend server unreachable (network failure), activating offline demo mode for testing:', apiError);
        let matchedRole = 'Resident';
        let fullName = 'Sol Plaatje Resident';

        if (email.toLowerCase().includes('admin')) {
          matchedRole = 'Admin';
          fullName = 'Sol Plaatje Municipal Admin';
        } else if (email.toLowerCase().includes('driver')) {
          matchedRole = 'Driver';
          fullName = 'Sipho Dlamini (Driver)';
        } else {
          fullName = email.split('@')[0];
        }

        const demoUser = {
          id: `usr-${Date.now()}`,
          email,
          fullName,
          role: matchedRole,
          area: 'Galeshewe',
        };
        const demoToken = `jwt-demo-${matchedRole.toLowerCase()}-${Date.now()}`;
        saveAuthSession(demoToken, demoUser);
        return { success: true, user: demoUser };
      }

      return { success: false, error: apiError.message || 'Authentication failed.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async ({ email, password, fullName, areaId }) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/api/v1/auth/register', {
        email,
        password,
        fullName,
        areaId,
      });
      if (response.data && response.data.token) {
        const newUser = {
          id: response.data.userId,
          email,
          fullName,
          role: 'Resident',
        };
        saveAuthSession(response.data.token, newUser);
        return { success: true, user: newUser };
      }
      return { success: false, error: 'Registration response missing authentication token.' };
    } catch (apiError) {
      // If the backend responded at all (e.g. 400 duplicate email, weak password), surface the real error —
      // do NOT silently create a fake local account and report success.
      if (apiError.response) {
        const errorMsg = apiError.response.data?.message || 'Registration failed. Please check your details and try again.';
        return { success: false, error: errorMsg };
      }

      // Only fall back to offline demo mode on a genuine network connection failure.
      const isNetworkFailure =
        apiError.code === 'ERR_NETWORK' ||
        apiError.code === 'ECONNABORTED' ||
        (apiError.request && !apiError.response);

      if (isNetworkFailure) {
        console.warn('Backend server unreachable (network failure), activating offline demo mode for testing:', apiError);
        const newUser = {
          id: `usr-${Date.now()}`,
          email,
          fullName: fullName || email.split('@')[0],
          role: 'Resident',
          area: 'Galeshewe',
        };
        const demoToken = `jwt-demo-resident-${Date.now()}`;
        saveAuthSession(demoToken, newUser);
        return { success: true, user: newUser };
      }

      return { success: false, error: apiError.message || 'Registration failed.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('aquabophelo_token');
    localStorage.removeItem('aquabophelo_user');
  };

  const switchRole = (newRole) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      role: newRole,
      fullName:
        newRole === 'Admin'
          ? 'Sol Plaatje Municipal Admin'
          : newRole === 'Driver'
          ? 'Sipho Dlamini (Driver)'
          : 'Nomcebo Nkosi (Resident)',
    };
    saveAuthSession(token || 'demo-token', updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
