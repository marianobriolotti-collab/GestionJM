/**
 * Calculation Service - Business logic for expense calculations
 */

import { getExpensesByMonth, getTransfersByMonth, getUserById } from './storageService';

// Calculate balances for a specific month
export const calculateMonthlyBalances = (year, month) => {
  const expenses = getExpensesByMonth(year, month);
  const transfers = getTransfersByMonth(year, month);

  // Initialize balances
  const balances = {
    mariano: { paid: 0, owes: 0, balance: 0 },
    gabriela: { paid: 0, owes: 0, balance: 0 },
    juanmartin: { paid: 0, owes: 0, balance: 0, pendingReimbursement: 0 },
  };

  // Track reimbursements to Juan
  const reimbursements = {
    marianoToJuan: 0,
    gabrielaToJuan: 0,
  };

  // Process expenses
  expenses.forEach((expense) => {
    const amount = parseFloat(expense.amount);
    const paidBy = expense.paidBy;
    const imputeTo = expense.imputeTo || 'both'; // 'both', 'mariano', 'gabriela'
    const needsReimbursement = expense.needsReimbursement || false;

    // Add to paid amount
    if (balances[paidBy]) {
      balances[paidBy].paid += amount;
    }

    // Calculate who owes what
    if (imputeTo === 'both') {
      // 50/50 split between Mariano and Gabriela
      const halfAmount = amount / 2;
      balances.mariano.owes += halfAmount;
      balances.gabriela.owes += halfAmount;

      // If Juan paid and needs reimbursement
      if (paidBy === 'juanmartin' && needsReimbursement) {
        reimbursements.marianoToJuan += halfAmount;
        reimbursements.gabrielaToJuan += halfAmount;
      }
    } else if (imputeTo === 'mariano') {
      balances.mariano.owes += amount;
      if (paidBy === 'juanmartin' && needsReimbursement) {
        reimbursements.marianoToJuan += amount;
      }
    } else if (imputeTo === 'gabriela') {
      balances.gabriela.owes += amount;
      if (paidBy === 'juanmartin' && needsReimbursement) {
        reimbursements.gabrielaToJuan += amount;
      }
    }
  });

  // Process transfers (adjust balances)
  transfers.forEach((transfer) => {
    const amount = parseFloat(transfer.amount);
    const from = transfer.from;
    const to = transfer.to;

    // Transfers between Mariano and Gabriela affect their balance
    if (from === 'mariano' && to === 'gabriela') {
      balances.mariano.paid += amount;
      balances.gabriela.paid -= amount;
    } else if (from === 'gabriela' && to === 'mariano') {
      balances.gabriela.paid += amount;
      balances.mariano.paid -= amount;
    }

    // Transfers to Juan reduce reimbursement debt
    if (to === 'juanmartin') {
      if (from === 'mariano') {
        reimbursements.marianoToJuan = Math.max(0, reimbursements.marianoToJuan - amount);
      } else if (from === 'gabriela') {
        reimbursements.gabrielaToJuan = Math.max(0, reimbursements.gabrielaToJuan - amount);
      }
    }
  });

  // Calculate final balances (paid - owes)
  balances.mariano.balance = balances.mariano.paid - balances.mariano.owes;
  balances.gabriela.balance = balances.gabriela.paid - balances.gabriela.owes;
  balances.juanmartin.pendingReimbursement = reimbursements.marianoToJuan + reimbursements.gabrielaToJuan;

  // Calculate who owes whom between parents
  const parentDifference = balances.mariano.balance - balances.gabriela.balance;
  let debtInfo = null;

  if (Math.abs(parentDifference) > 0.01) {
    if (parentDifference > 0) {
      // Mariano paid more, Gabriela owes him
      debtInfo = {
        from: 'gabriela',
        fromName: 'Gabriela',
        to: 'mariano',
        toName: 'Mariano',
        amount: Math.abs(parentDifference) / 2,
      };
    } else {
      // Gabriela paid more, Mariano owes her
      debtInfo = {
        from: 'mariano',
        fromName: 'Mariano',
        to: 'gabriela',
        toName: 'Gabriela',
        amount: Math.abs(parentDifference) / 2,
      };
    }
  }

  // Total expenses of the month
  const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return {
    totalExpenses,
    balances,
    debtInfo,
    reimbursements,
    isBalanced: Math.abs(parentDifference) < 0.01,
  };
};

// Get expenses grouped by category for a month
export const getExpensesByCategory = (year, month) => {
  const expenses = getExpensesByMonth(year, month);
  const grouped = {};

  expenses.forEach((expense) => {
    const category = expense.category || 'otros';
    if (!grouped[category]) {
      grouped[category] = {
        total: 0,
        count: 0,
        expenses: [],
      };
    }
    grouped[category].total += parseFloat(expense.amount);
    grouped[category].count += 1;
    grouped[category].expenses.push(expense);
  });

  return grouped;
};

// Get recent expenses (last N)
export const getRecentExpenses = (limit = 5) => {
  const allExpenses = JSON.parse(localStorage.getItem('gestionjm_expenses') || '[]');
  return allExpenses
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
};

// Check if user can edit expense
export const canEditExpense = (user, expense) => {
  if (!user) return false;
  if (user.canEditAll) return true;
  return expense.createdBy === user.id;
};

// Check if user can delete expense
export const canDeleteExpense = (user, expense) => {
  return canEditExpense(user, expense);
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get month name in Spanish
export const getMonthName = (month) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[month];
};
