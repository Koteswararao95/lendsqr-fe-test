import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import storageService from '../services/storage';

/**
 * Custom hook for authentication
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = storageService.getAuthState();
    if (auth && auth.isAuthenticated) {
      setIsAuthenticated(true);
      setUserEmail(auth.email);
    }
    setIsLoading(false);
  }, []);

  const login = (email: string) => {
    storageService.saveAuthState(email);
    setIsAuthenticated(true);
    setUserEmail(email);
    navigate('/dashboard');
  };

  const logout = () => {
    storageService.clearAuthState();
    setIsAuthenticated(false);
    setUserEmail('');
    navigate('/login');
  };

  return {
    isAuthenticated,
    userEmail,
    isLoading,
    login,
    logout,
  };
};

/**
 * Custom hook for managing state with localStorage
 */
export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
};
