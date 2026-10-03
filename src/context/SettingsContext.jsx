import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const { user } = useAuth();

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('app_currency') || user?.currency || 'USD';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'light';
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('app_notifications');
      return stored
        ? JSON.parse(stored)
        : {
            emailAlerts: true,
            budgetLimit: true,
            monthlyReports: true,
            transactionAlerts: false,
          };
    } catch {
      return {
        emailAlerts: true,
        budgetLimit: true,
        monthlyReports: true,
        transactionAlerts: false,
      };
    }
  });

  // Keep currency synced with user profile
  useEffect(() => {
    if (user?.currency) {
      setCurrency(user.currency);
      localStorage.setItem('app_currency', user.currency);
    }
  }, [user?.currency]);

  // Apply theme class to HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const updateCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('app_currency', newCurrency);
  };

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const updateNotifications = (newSettings) => {
    setNotifications(newSettings);
    localStorage.setItem('app_notifications', JSON.stringify(newSettings));
  };

  return (
    <SettingsContext.Provider
      value={{
        currency,
        updateCurrency,
        theme,
        updateTheme,
        notifications,
        updateNotifications,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;
