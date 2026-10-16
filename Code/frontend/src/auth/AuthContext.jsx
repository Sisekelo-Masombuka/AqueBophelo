import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

/**
 * React Context Provider managing municipal authentication state, JWT tokens,
 * active user profiles, login, registration, and logout operations.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        // Clear any old legacy persistent localStorage token to enforce session security
        try { localStorage.removeItem('aquabophelo_token'); localStorage.removeItem('aquabophelo_user'); } catch {}
        return sessionStorage.getItem('aquabophelo_token') || null;
      }
    } catch {
      // Storage access restricted
    }
    return null;
  });

  const [user, setUser] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const savedUser = sessionStorage.getItem('aquabophelo_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed?.preferredLanguage) {
            localStorage.setItem('aquabophelo_lang', parsed.preferredLanguage);
          }
          return parsed;
        }
      }
    } catch {
      try {
        sessionStorage.removeItem('aquabophelo_user');
      } catch {
        // Storage access restricted
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        return !!sessionStorage.getItem('aquabophelo_token');
      }
    } catch {
      return false;
    }
    return false;
  });

  // Verify and sync live profile with backend if token exists
  useEffect(() => {
    let isCurrent = true;
    if (!token) return;

    apiClient
      .get('/api/v1/auth/me')
      .then((res) => {
        if (isCurrent && res.data) {
          setUser((prev) => {
            const freshProfile = {
              ...(prev || {}),
              id: res.data.id || prev?.id,
              email: res.data.email || prev?.email,
              fullName: res.data.fullName || prev?.fullName,
              role: res.data.role || prev?.role,
              phoneNumber: res.data.phoneNumber || prev?.phoneNumber || '',
              area: res.data.areaName || prev?.area || 'Galeshewe',
              areaId: res.data.areaId || prev?.areaId,
              profilePictureUrl: res.data.profilePictureUrl || prev?.profilePictureUrl || null,
              preferredLanguage: res.data.preferredLanguage || prev?.preferredLanguage || 'EN',
            };
            try {
              sessionStorage.setItem('aquabophelo_user', JSON.stringify(freshProfile));
            } catch {
              // Ignore storage errors
            }
            return freshProfile;
          });
        }
      })
      .catch((err) => {
        console.warn('Backend profile sync note:', err);
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [token]);

  const saveAuthSession = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    setIsLoading(false);
    try {
      sessionStorage.setItem('aquabophelo_token', authToken);
      sessionStorage.setItem('aquabophelo_user', JSON.stringify(authUser));
      // Clean up legacy localStorage keys
      localStorage.removeItem('aquabophelo_token');
      localStorage.removeItem('aquabophelo_user');
    } catch {}
    if (authUser?.preferredLanguage) {
      localStorage.setItem('aquabophelo_lang', authUser.preferredLanguage);
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedFields };
      try {
        sessionStorage.setItem('aquabophelo_user', JSON.stringify(merged));
      } catch {}
      return merged;
    });
  };

  const login = async (email, password, turnstileToken) => {
    setIsLoading(true);
    try {
      // Attempt live API authentication
      const response = await apiClient.post('/api/v1/auth/login', { email, password, turnstileToken });
      if (response.data && response.data.token) {
        const loggedUser = {
          id: response.data.userId || response.data.id || `usr-${Date.now()}`,
          email: response.data.email || email,
          fullName: response.data.fullName || email.split('@')[0],
          role: response.data.role || 'Resident',
          preferredLanguage: response.data.preferredLanguage || localStorage.getItem('aquabophelo_lang') || 'EN',
          area: response.data.areaName || 'Galeshewe',
          phoneNumber: response.data.phoneNumber || '',
          profilePictureUrl: response.data.profilePictureUrl || null,
        };
        saveAuthSession(response.data.token, loggedUser);
        setIsLoading(false);
        return { success: true, user: loggedUser };
      }
      return { success: false, error: 'Authentication failed. Please check your credentials.' };
    } catch (apiError) {
      console.warn('API auth response error:', apiError);
      let errorMsg =
        apiError.response?.data?.message ||
        apiError.response?.data?.title ||
        (typeof apiError.response?.data === 'string' ? apiError.response.data : null);

      if (!errorMsg) {
        if (apiError.response?.status === 401) {
          errorMsg = 'Invalid email address or password. Please check your credentials and try again.';
        } else if (apiError.response?.status === 429) {
          errorMsg = 'Too many attempts. Please wait a moment before trying again.';
        } else {
          errorMsg = 'Invalid email address or password.';
        }
      }

      return {
        success: false,
        error: errorMsg,
        status: apiError.response?.status,
        requiresVerification: Boolean(errorMsg && errorMsg.toLowerCase().includes('verify your email')),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async ({ email, password, fullName, area, phoneNumber, turnstileToken, otpCode }) => {
    setIsLoading(true);
    const chosenLang = localStorage.getItem('aquabophelo_lang') || 'EN';
    try {
      const response = await apiClient.post('/api/v1/auth/register', {
        email,
        password,
        fullName,
        areaName: area,
        phoneNumber,
        preferredLanguage: chosenLang,
        turnstileToken,
        otpCode,
      });
      if (response.data && response.data.token) {
        const newUser = {
          id: response.data.userId || response.data.id || `usr-${Date.now()}`,
          email,
          fullName,
          role: 'Resident',
          preferredLanguage: response.data.preferredLanguage || chosenLang,
          area: area || 'Galeshewe',
          phoneNumber: phoneNumber || response.data.phoneNumber || '',
          profilePictureUrl: response.data.profilePictureUrl || null,
        };
        saveAuthSession(response.data.token, newUser);
        setIsLoading(false);
        return { success: true, user: newUser };
      }
      if (response.data && !response.data.token) {
        setIsLoading(false);
        return { success: true, requiresVerification: true, message: response.data.message || 'Please verify your email.' };
      }
      return { success: false, error: 'Registration failed. Please check your details.' };
    } catch (apiError) {
      console.warn('API registration response error:', apiError);
      let errorMsg =
        apiError.response?.data?.message ||
        apiError.response?.data?.title ||
        (typeof apiError.response?.data === 'string' ? apiError.response.data : null) ||
        'Registration failed. Please try again.';

      return {
        success: false,
        error: errorMsg,
        accountExists: Boolean(errorMsg && errorMsg.toLowerCase().includes('already exists')),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLoading(false);
    try {
      sessionStorage.removeItem('aquabophelo_token');
      sessionStorage.removeItem('aquabophelo_user');
      localStorage.removeItem('aquabophelo_token');
      localStorage.removeItem('aquabophelo_user');
    } catch {}
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
        updateUser,
        logout,
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
