export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($) - US Dollar' },
  { code: 'EUR', symbol: '€', label: 'EUR (€) - Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP (£) - British Pound' },
  { code: 'INR', symbol: '₹', label: 'INR (₹) - Indian Rupee' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD (CA$) - Canadian Dollar' },
  { code: 'AUD', symbol: 'AU$', label: 'AUD (AU$) - Australian Dollar' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥) - Japanese Yen' },
];

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Housing & Rent',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Groceries',
  'Education',
  'Travel',
  'Personal Care',
  'Bills & Fees',
  'Other',
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Business',
  'Dividends',
  'Gifts',
  'Rental Income',
  'Side Hustle',
  'Other',
];

export const ALL_CATEGORIES = [
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES.filter((c) => !EXPENSE_CATEGORIES.includes(c)),
];

export const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'UPI / Digital Wallet',
  'PayPal',
  'Cheque',
  'Other',
];

export const CATEGORY_COLORS = {
  'Food & Dining': '#f97316',
  'Housing & Rent': '#6366f1',
  'Transportation': '#06b6d4',
  'Utilities': '#eab308',
  'Entertainment': '#ec4899',
  'Healthcare': '#ef4444',
  'Shopping': '#8b5cf6',
  'Groceries': '#10b981',
  'Education': '#3b82f6',
  'Travel': '#14b8a6',
  'Personal Care': '#d946ef',
  'Bills & Fees': '#64748b',
  'Salary': '#10b981',
  'Freelance': '#059669',
  'Investments': '#3b82f6',
  'Business': '#6366f1',
  'Dividends': '#8b5cf6',
  'Gifts': '#f43f5e',
  'Other': '#94a3b8',
};
