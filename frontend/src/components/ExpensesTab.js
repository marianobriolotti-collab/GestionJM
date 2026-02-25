import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getExpenses, deleteExpense, getCategories } from '../services/storageService';
import { canDeleteExpense, formatCurrency, getMonthName } from '../services/calculationService';
import { Plus, Search, Filter, Trash2, Edit, Receipt, RefreshCw, ChevronDown, X } from 'lucide-react';

const ExpensesTab = ({ onAddExpense, onEditExpense }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const categories = getCategories();

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = () => {
    const allExpenses = getExpenses();
    setExpenses(allExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const handleDelete = (expenseId) => {
    deleteExpense(expenseId);
    loadExpenses();
    setDeleteConfirm(null);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group expenses by month
  const groupedExpenses = filteredExpenses.reduce((groups, expense) => {
    const date = new Date(expense.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!groups[key]) {
      groups[key] = {
        year: date.getFullYear(),
        month: date.getMonth(),
        expenses: [],
        total: 0,
      };
    }
    groups[key].expenses.push(expense);
    groups[key].total += parseFloat(expense.amount);
    return groups;
  }, {});

  const sortedGroups = Object.values(groupedExpenses).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : categoryId;
  };

  const getUserName = (userId) => {
    const names = {
      mariano: 'Mariano',
      gabriela: 'Gabriela',
      juanmartin: 'Juan Martín',
    };
    return names[userId] || userId;
  };

  return (
    <div className="pb-24" data-testid="expenses-tab">
      {/* Search Bar */}
      <div className="px-4 py-3 sticky top-0 bg-slate-900 z-10">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar gastos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="search-input"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            data-testid="filter-btn"
            className={`p-2.5 rounded-xl border transition-colors ${showFilters ? 'bg-emerald-500/20 border-emerald-500' : 'bg-slate-800 border-slate-700'}`}
          >
            <Filter className={`w-5 h-5 ${showFilters ? 'text-emerald-400' : 'text-slate-400'}`} />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-3 p-3 bg-slate-800 border border-slate-700 rounded-xl" data-testid="filters-panel">
            <p className="text-slate-400 text-xs mb-2">Categoría</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedCategory === 'all' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'}`}
              >
                Todas
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedCategory === cat.id ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Expenses List */}
      <div className="px-4">
        {sortedGroups.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-expenses">
            <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No hay gastos</p>
            <p className="text-slate-500 text-sm">Agregá uno con el botón +</p>
          </div>
        ) : (
          sortedGroups.map((group) => (
            <div key={`${group.year}-${group.month}`} className="mb-6">
              {/* Month Header */}
              <div className="flex items-center justify-between mb-3 sticky top-20 bg-slate-900 py-2">
                <h3 className="text-white font-medium">
                  {getMonthName(group.month)} {group.year}
                </h3>
                <span className="text-emerald-400 font-medium">{formatCurrency(group.total)}</span>
              </div>

              {/* Expenses */}
              <div className="space-y-2">
                {group.expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
                    data-testid={`expense-item-${expense.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded">
                            {getCategoryName(expense.category)}
                          </span>
                          {expense.needsReimbursement && (
                            <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded flex items-center gap-1">
                              <RefreshCw className="w-3 h-3" />
                              Reintegro
                            </span>
                          )}
                        </div>
                        <p className="text-white font-medium">{expense.description}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span>{new Date(expense.date).toLocaleDateString('es-AR')}</span>
                          <span>Pagó: {getUserName(expense.paidBy)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-lg">{formatCurrency(expense.amount)}</p>
                        
                        {/* Actions */}
                        {canDeleteExpense(user, expense) && (
                          <div className="flex gap-1 mt-2 justify-end">
                            <button
                              onClick={() => onEditExpense && onEditExpense(expense)}
                              className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                              data-testid={`edit-expense-${expense.id}`}
                            >
                              <Edit className="w-4 h-4 text-slate-400" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(expense.id)}
                              className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
                              data-testid={`delete-expense-${expense.id}`}
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delete Confirmation */}
                    {deleteConfirm === expense.id && (
                      <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-between">
                        <span className="text-red-400 text-sm">¿Eliminar este gasto?</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1 text-sm text-slate-400 hover:text-white transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            data-testid={`confirm-delete-${expense.id}`}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* FAB Button */}
      <button
        onClick={onAddExpense}
        data-testid="add-expense-fab"
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-shadow z-20"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default ExpensesTab;
