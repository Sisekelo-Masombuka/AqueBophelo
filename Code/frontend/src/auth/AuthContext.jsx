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
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved session from localStorage on app startup and sync with backend
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('aquabophelo_token');
      const savedUser = localStorage.getItem('aquabophelo_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        if (parsedUser?.preferredLanguage) {
          localStorage.setItem('aquabophelo_lang', parsedUser.preferredLanguage);
        }

        // Fetch live server profile in background to keep data fresh across tabs/refreshes
        apiClient.get('/api/v1/auth/me')
          .then((res) => {
            if (res.data) {
              const freshProfile = {
                ...parsedUser,
                id: res.data.id || parsedUser.id,
                email: res.data.email || parsedUser.email,
                fullName: res.data.fullName || parsedUser.fullName,
                role: res.data.role || parsedUser.role,
                phoneNumber: res.data.phoneNumber || parsedUser.phoneNumber || '',
                area: res.data.areaName || parsedUser.area || 'Galeshewe',
                areaId: res.data.areaId || parsedUser.areaId,
                profilePictureUrl: res.data.profilePictureUrl || parsedUser.profilePictureUrl || null,
                preferredLanguage: res.data.preferredLanguage || parsedUser.preferredLanguage || 'EN',
              };
              setUser(freshProfile);
              localStorage.setItem('aquabophelo_user', JSON.stringify(freshProfile));
            }
          })
          .catch((err) => {
            console.warn('Backend profile sync note:', err);
          });
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.error('Failed to load auth state:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveAuthSession = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    setIsLoading(false);
    localStorage.setItem('aquabophelo_token', authToken);
    localStorage.setItem('aquabophelo_user', JSON.stringify(authUser));
    if (authUser?.preferredLanguage) {
      localStorage.setItem('aquabophelo_lang', authUser.preferredLanguage);
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('aquabophelo_user', JSON.stringify(merged));
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
      const errorMsg = apiError.response?.data?.message || 'Invalid email address or password.';
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async ({ email, password, fullName, area, phoneNumber, turnstileToken }) => {
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
      return { success: false, error: 'Registration failed. Please check your details.' };
    } catch (apiError) {
      console.warn('API registration response error:', apiError);
      const errorMsg = apiError.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLoading(false);
    localStorage.removeItem('aquabophelo_token');
    localStorage.removeItem('aquabophelo_user');
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
