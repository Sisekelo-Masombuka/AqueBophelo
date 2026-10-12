import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved session from localStorage on app startup
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

  const login = async (email, password, turnstileToken) => {
    setIsLoading(true);
    try {
      // Attempt live API authentication
      const response = await apiClient.post('/api/v1/auth/login', { email, password, turnstileToken });
      if (response.data && response.data.token) {
        const loggedUser = {
          id: response.data.userId || `usr-${Date.now()}`,
          email: response.data.email || email,
          fullName: response.data.fullName || email.split('@')[0],
          role: response.data.role || 'Resident',
          preferredLanguage: response.data.preferredLanguage || localStorage.getItem('aquabophelo_lang') || 'EN',
          area: 'Galeshewe',
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
          id: response.data.userId || `usr-${Date.now()}`,
          email,
          fullName,
          role: 'Resident',
          preferredLanguage: response.data.preferredLanguage || chosenLang,
          area: area || 'Galeshewe',
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
