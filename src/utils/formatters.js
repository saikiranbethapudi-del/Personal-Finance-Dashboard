import { CURRENCIES } from './constants';

export const getCurrencySymbol = (currencyCode = 'USD') => {
  const found = CURRENCIES.find((c) => c.code === currencyCode);
  return found ? found.symbol : '$';
};

export const formatCurrency = (amount, currencyCode = 'USD') => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${getCurrencySymbol(currencyCode)}0.00`;
  }

  const num = Number(amount);
  const symbol = getCurrencySymbol(currencyCode);

  return `${symbol}${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

export const formatInputDate = (dateString) => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];
  return date.toISOString().split('T')[0];
};

export const formatPercentage = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '0%';
  return `${Math.round(Number(value))}%`;
};
