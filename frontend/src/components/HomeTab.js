import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { calculateMonthlyBalances, getExpensesByCategory, getRecentExpenses, formatCurrency, getMonthName } from '../services/calculationService';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, Receipt, RefreshCw } from 'lucide-react';

const HomeTab = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [balanceData, setBalanceData] = useState(null);
  const [categoryData, setCategoryData] = useState({});
  const [recentExpenses, setRecentExpenses] = useState([]);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = () => {
    const balances = calculateMonthlyBalances(year, month);
    const categories = getExpensesByCategory(year, month);
    const recent = getRecentExpenses(5);

    setBalanceData(balances);
    setCategoryData(categories);
    setRecentExpenses(recent);
  };

  const handlePrevMonth = () => {
    setSelectedDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    const now = new Date();
    const nextMonth = new Date(year, month + 1, 1);
    if (nextMonth <= now) {
      setSelectedDate(nextMonth);
    }
  };

  const canGoNext = () => {
    const now = new Date();
    const nextMonth = new Date(year, month + 1, 1);
    return nextMonth <= now;
  };

  const getCategoryName = (categoryId) => {
    const names = {
      alquiler_ba: 'Alquiler BA',
      universidad: 'Universidad',
      vida_diaria: 'Vida diaria',
      telefono: 'Teléfono',
      salud: 'Salud',
      otros: 'Otros',
    };
    return names[categoryId] || categoryId;
  };

  const getCategoryColor = (categoryId) => {
    const colors = {
      alquiler_ba: 'bg-blue-500',
      universidad: 'bg-purple-500',
      vida_diaria: 'bg-green-500',
      telefono: 'bg-yellow-500',
      salud: 'bg-red-500',
      otros: 'bg-slate-500',
    };
    return colors[categoryId] || 'bg-slate-500';
  };

  if (!balanceData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { totalExpenses, balances, debtInfo, reimbursements, isBalanced } = balanceData;
  const totalPendingReimbursement = reimbursements.marianoToJuan + reimbursements.gabrielaToJuan;

  return (
    <div className="pb-24 px-4" data-testid="home-tab">
      {/* Month Selector */}
      <div className="flex items-center justify-between py-4" data-testid="month-selector">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          data-testid="prev-month-btn"
        >
          <ChevronLeft className="w-5 h-5 text-slate-400" />
        </button>
        <h2 className="text-lg font-semibold text-white">
          {getMonthName(month)} {year}
        </h2>
        <button
          onClick={handleNextMonth}
          disabled={!canGoNext()}
          className={`p-2 rounded-lg transition-colors ${canGoNext() ? 'hover:bg-slate-800' : 'opacity-30 cursor-not-allowed'}`}
          data-testid="next-month-btn"
        >
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Total del Mes */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-5 mb-4">
        <p className="text-slate-400 text-sm mb-1">Total del mes</p>
        <p className="text-3xl font-bold text-white" data-testid="total-expenses">
          {formatCurrency(totalExpenses)}
        </p>
        <p className="text-slate-400 text-sm mt-2">
          Cada uno debe: {formatCurrency(totalExpenses / 2)}
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Mariano */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4" data-testid="balance-mariano">
          <p className="text-slate-400 text-xs mb-2">Mariano</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500 text-xs">Pagó</span>
              <span className="text-white text-sm font-medium">{formatCurrency(balances.mariano.paid)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-xs">Diferencia</span>
              <span className={`text-sm font-medium ${balances.mariano.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {balances.mariano.balance >= 0 ? '+' : ''}{formatCurrency(balances.mariano.balance)}
              </span>
            </div>
          </div>
        </div>

        {/* Gabriela */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4" data-testid="balance-gabriela">
          <p className="text-slate-400 text-xs mb-2">Gabriela</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500 text-xs">Pagó</span>
              <span className="text-white text-sm font-medium">{formatCurrency(balances.gabriela.paid)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-xs">Diferencia</span>
              <span className={`text-sm font-medium ${balances.gabriela.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {balances.gabriela.balance >= 0 ? '+' : ''}{formatCurrency(balances.gabriela.balance)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Card - Balanced or Debt */}
      {isBalanced ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-4" data-testid="balanced-card">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-emerald-400 font-medium">Mes cerrado</p>
              <p className="text-emerald-400/70 text-sm">Cuentas equilibradas</p>
            </div>
          </div>
        </div>
      ) : debtInfo && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4" data-testid="debt-card">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <div>
              <p className="text-amber-400 font-medium">
                {debtInfo.fromName} debe a {debtInfo.toName}
              </p>
              <p className="text-amber-400 text-xl font-bold">{formatCurrency(debtInfo.amount)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Reimbursement to Juan */}
      {totalPendingReimbursement > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-4" data-testid="reimbursement-card">
          <div className="flex items-center gap-3 mb-3">
            <RefreshCw className="w-5 h-5 text-blue-400" />
            <p className="text-blue-400 font-medium">Pendiente de reintegro a Juan Martín</p>
          </div>
          <p className="text-blue-400 text-2xl font-bold mb-2">{formatCurrency(totalPendingReimbursement)}</p>
          <div className="space-y-1 text-sm">
            {reimbursements.marianoToJuan > 0 && (
              <p className="text-blue-400/70">Mariano → Juan: {formatCurrency(reimbursements.marianoToJuan)}</p>
            )}
            {reimbursements.gabrielaToJuan > 0 && (
              <p className="text-blue-400/70">Gabriela → Juan: {formatCurrency(reimbursements.gabrielaToJuan)}</p>
            )}
          </div>
        </div>
      )}

      {/* Category Summary */}
      {Object.keys(categoryData).length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-4" data-testid="category-summary">
          <p className="text-white font-medium mb-3">Resumen por categoría</p>
          <div className="space-y-2">
            {Object.entries(categoryData)
              .sort((a, b) => b[1].total - a[1].total)
              .map(([categoryId, data]) => (
                <div key={categoryId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getCategoryColor(categoryId)}`}></div>
                    <span className="text-slate-300 text-sm">{getCategoryName(categoryId)}</span>
                  </div>
                  <span className="text-white text-sm font-medium">{formatCurrency(data.total)}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recent Expenses */}
      {recentExpenses.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4" data-testid="recent-expenses">
          <p className="text-white font-medium mb-3">Gastos recientes</p>
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm">{expense.description}</p>
                    <p className="text-slate-500 text-xs">{new Date(expense.date).toLocaleDateString('es-AR')}</p>
                  </div>
                </div>
                <span className="text-white font-medium">{formatCurrency(expense.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalExpenses === 0 && (
        <div className="text-center py-8" data-testid="empty-state">
          <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No hay gastos este mes</p>
          <p className="text-slate-500 text-sm">Agregá un gasto con el botón +</p>
        </div>
      )}
    </div>
  );
};

export default HomeTab;
