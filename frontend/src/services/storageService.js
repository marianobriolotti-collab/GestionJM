/**
 * Storage Service - Abstraction layer for data persistence
 * Currently uses localStorage, designed for easy migration to Firebase
 */

const STORAGE_KEYS = {
  USERS: 'gestionjm_users',
  EXPENSES: 'gestionjm_expenses',
  TRANSFERS: 'gestionjm_transfers',
  CURRENT_USER: 'gestionjm_current_user',
};

// Default users with hashed PINs (simple hash for demo, use bcrypt in production)
const hashPin = (pin) => {
  // Simple hash for localStorage version - replace with proper hashing for Firebase
  return btoa(pin + '_gestionjm_salt');
};

const verifyPin = (pin, hashedPin) => {
  return hashPin(pin) === hashedPin;
};

const defaultUsers = [
  {
    id: 'mariano',
    name: 'Mariano',
    role: 'parent',
    pinHash: hashPin('1234'),
    canEditAll: true,
    canManageTransfers: true,
  },
  {
    id: 'gabriela',
    name: 'Gabriela Gentilucci',
    shortName: 'Gabriela',
    role: 'parent',
    pinHash: hashPin('4321'),
    canEditAll: true,
    canManageTransfers: true,
  },
  {
    id: 'juanmartin',
    name: 'Juan Martín',
    role: 'collaborator',
    pinHash: hashPin('1111'),
    canEditAll: false,
    canManageTransfers: false,
  },
];

// Initialize default data if not exists
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSFERS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify([]));
  }
};

// User operations
export const getUsers = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
};

export const getUserById = (userId) => {
  const users = getUsers();
  return users.find((u) => u.id === userId);
};

export const updateUserPin = (userId, newPin) => {
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].pinHash = hashPin(newPin);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return true;
  }
  return false;
};

export const authenticateUser = (userId, pin) => {
  const user = getUserById(userId);
  if (user && verifyPin(pin, user.pinHash)) {
    return user;
  }
  return null;
};

// Session operations
export const setCurrentUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const clearCurrentUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Expense operations
export const getExpenses = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES));
};

export const addExpense = (expense) => {
  const expenses = getExpenses();
  const newExpense = {
    ...expense,
    id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  expenses.push(newExpense);
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  return newExpense;
};

export const updateExpense = (expenseId, updates) => {
  const expenses = getExpenses();
  const index = expenses.findIndex((e) => e.id === expenseId);
  if (index !== -1) {
    expenses[index] = {
      ...expenses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    return expenses[index];
  }
  return null;
};

export const deleteExpense = (expenseId) => {
  const expenses = getExpenses();
  const filtered = expenses.filter((e) => e.id !== expenseId);
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(filtered));
  return true;
};

export const getExpensesByMonth = (year, month) => {
  const expenses = getExpenses();
  return expenses.filter((e) => {
    const date = new Date(e.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });
};

// Transfer operations
export const getTransfers = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSFERS));
};

export const addTransfer = (transfer) => {
  const transfers = getTransfers();
  const newTransfer = {
    ...transfer,
    id: `tr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  transfers.push(newTransfer);
  localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(transfers));
  return newTransfer;
};

export const deleteTransfer = (transferId) => {
  const transfers = getTransfers();
  const filtered = transfers.filter((t) => t.id !== transferId);
  localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(filtered));
  return true;
};

export const getTransfersByMonth = (year, month) => {
  const transfers = getTransfers();
  return transfers.filter((t) => {
    const date = new Date(t.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });
};

// Categories
export const getCategories = () => [
  { id: 'alquiler_ba', name: 'Alquiler BA' },
  { id: 'universidad', name: 'Universidad' },
  { id: 'vida_diaria', name: 'Vida diaria' },
  { id: 'telefono', name: 'Teléfono' },
  { id: 'salud', name: 'Salud' },
  { id: 'otros', name: 'Otros' },
];

// Export for Firebase migration
export const exportAllData = () => {
  return {
    users: getUsers(),
    expenses: getExpenses(),
    transfers: getTransfers(),
  };
};

export const importAllData = (data) => {
  if (data.users) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
  if (data.expenses) localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(data.expenses));
  if (data.transfers) localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(data.transfers));
};

export { hashPin, verifyPin };
