import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { addExpense, updateExpense, getCategories } from '../services/storageService';
import { formatCurrency } from '../services/calculationService';
import { X, ChevronDown, RefreshCw, Check, AlertCircle } from 'lucide-react';

const ExpenseForm = ({ expense, onClose, onSave }) => {
  const { user, getAllUsers } = useAuth();
  const isEditing = !!expense;

  const [formData, setFormData] = useState({
    amount: expense?.amount?.toString() || '',
    description: expense?.description || '',
    category: expense?.category || '',
    paidBy: expense?.paidBy || user?.id || '',
    date: expense?.date || new Date().toISOString().split('T')[0],
    imputeTo: expense?.imputeTo || 'both',
    needsReimbursement: expense?.needsReimbursement || false,
  });

  const [errors, setErrors] = useState({});
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPaidByDropdown, setShowPaidByDropdown] = useState(false);
  const [showImputeDropdown, setShowImputeDropdown] = useState(false);

  const categories = getCategories();
  const users = getAllUsers();

  // Auto-select impute when Juan pays with reimbursement
  useEffect(() => {
    if (formData.paidBy === 'juanmartin' && formData.needsReimbursement) {
      if (formData.imputeTo !== 'both' && formData.imputeTo !== 'mariano' && formData.imputeTo !== 'gabriela') {
        setFormData((prev) => ({ ...prev, imputeTo: 'both' }));
      }
    }
  }, [formData.paidBy, formData.needsReimbursement]);

  const validate = () => {
    const newErrors = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Ingresá un monto válido';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Ingresá una descripción';
    }
    if (!formData.category) {
      newErrors.category = 'Seleccioná una categoría';
    }
    if (!formData.paidBy) {
      newErrors.paidBy = 'Seleccioná quién pagó';
    }
    if (!formData.date) {
      newErrors.date = 'Seleccioná una fecha';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      createdBy: expense?.createdBy || user.id,
    };

    if (isEditing) {
      updateExpense(expense.id, expenseData);
    } else {
      addExpense(expenseData);
    }

    onSave && onSave();
    onClose();
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : 'Seleccionar categoría';
  };

  const getUserName = (userId) => {
    const u = users.find((u) => u.id === userId);
    return u ? u.name : 'Seleccionar';
  };

  const getImputeLabel = (value) => {
    const labels = {
      both: 'Mariano + Gabriela (50/50)',
      mariano: 'Mariano 100%',
      gabriela: 'Gabriela 100%',
    };
    return labels[value] || value;
  };

  // Calculate reimbursement preview
  const getReimbursementPreview = () => {
    if (formData.paidBy !== 'juanmartin' || !formData.needsReimbursement || !formData.amount) {
      return null;
    }

    const amount = parseFloat(formData.amount) || 0;
    if (formData.imputeTo === 'both') {
      return {
        mariano: amount / 2,
        gabriela: amount / 2,
      };
    } else if (formData.imputeTo === 'mariano') {
      return { mariano: amount, gabriela: 0 };
    } else if (formData.imputeTo === 'gabriela') {
      return { mariano: 0, gabriela: amount };
    }
    return null;
  };

  const reimbursementPreview = getReimbursementPreview();

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        data-testid="expense-form"
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Editar Gasto' : 'Nuevo Gasto'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Monto */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Monto <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <input
                type="number"
                inputMode="numeric"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0"
                data-testid="amount-input"
                className={`w-full bg-slate-800 border ${errors.amount ? 'border-red-500' : 'border-slate-700'} rounded-xl py-3 pl-10 pr-4 text-white text-lg font-medium placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors`}
              />
            </div>
            {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Descripción <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="¿En qué se gastó?"
              data-testid="description-input"
              className={`w-full bg-slate-800 border ${errors.description ? 'border-red-500' : 'border-slate-700'} rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors`}
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Categoría */}
          <div className="relative">
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Categoría <span className="text-red-400">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              data-testid="category-dropdown"
              className={`w-full bg-slate-800 border ${errors.category ? 'border-red-500' : 'border-slate-700'} rounded-xl py-3 px-4 text-left flex items-center justify-between transition-colors`}
            >
              <span className={formData.category ? 'text-white' : 'text-slate-500'}>
                {getCategoryName(formData.category)}
              </span>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showCategoryDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setFormData({ ...formData, category: cat.id });
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-colors flex items-center justify-between"
                  >
                    {cat.name}
                    {formData.category === cat.id && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
            {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
          </div>

          {/* Pagado por */}
          <div className="relative">
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Pagado por <span className="text-red-400">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowPaidByDropdown(!showPaidByDropdown)}
              data-testid="paidby-dropdown"
              className={`w-full bg-slate-800 border ${errors.paidBy ? 'border-red-500' : 'border-slate-700'} rounded-xl py-3 px-4 text-left flex items-center justify-between transition-colors`}
            >
              <span className={formData.paidBy ? 'text-white' : 'text-slate-500'}>
                {getUserName(formData.paidBy)}
              </span>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showPaidByDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showPaidByDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setFormData({ ...formData, paidBy: u.id });
                      setShowPaidByDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-colors flex items-center justify-between"
                  >
                    {u.name}
                    {formData.paidBy === u.id && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
            {errors.paidBy && <p className="text-red-400 text-xs mt-1">{errors.paidBy}</p>}
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Fecha <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              data-testid="date-input"
              className={`w-full bg-slate-800 border ${errors.date ? 'border-red-500' : 'border-slate-700'} rounded-xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors`}
            />
            {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Imputar a */}
          <div className="relative">
            <label className="block text-slate-300 text-sm font-medium mb-2">Imputar a</label>
            <button
              type="button"
              onClick={() => setShowImputeDropdown(!showImputeDropdown)}
              data-testid="impute-dropdown"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-left flex items-center justify-between transition-colors"
            >
              <span className="text-white">{getImputeLabel(formData.imputeTo)}</span>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showImputeDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showImputeDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                {['both', 'mariano', 'gabriela'].map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      setFormData({ ...formData, imputeTo: value });
                      setShowImputeDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-colors flex items-center justify-between"
                  >
                    {getImputeLabel(value)}
                    {formData.imputeTo === value && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reintegro Toggle */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white text-sm font-medium">Reintegrar a quien pagó</p>
                  <p className="text-slate-500 text-xs">Genera deuda de reintegro</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, needsReimbursement: !formData.needsReimbursement })}
                data-testid="reimbursement-toggle"
                className={`w-12 h-7 rounded-full transition-colors ${formData.needsReimbursement ? 'bg-emerald-500' : 'bg-slate-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.needsReimbursement ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Reimbursement Preview */}
            {reimbursementPreview && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <p className="text-blue-400 text-xs font-medium mb-2">Se generará reintegro:</p>
                <div className="space-y-1 text-sm">
                  {reimbursementPreview.mariano > 0 && (
                    <p className="text-slate-300">Mariano → Juan Martín: {formatCurrency(reimbursementPreview.mariano)}</p>
                  )}
                  {reimbursementPreview.gabriela > 0 && (
                    <p className="text-slate-300">Gabriela → Juan Martín: {formatCurrency(reimbursementPreview.gabriela)}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            data-testid="submit-expense-btn"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity"
          >
            {isEditing ? 'Guardar Cambios' : 'Registrar Gasto'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
