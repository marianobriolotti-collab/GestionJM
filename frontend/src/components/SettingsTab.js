import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTransfers, addTransfer, deleteTransfer, updateUserPin } from '../services/storageService';
import { formatCurrency, getMonthName } from '../services/calculationService';
import { ArrowRight, Plus, Trash2, Lock, ChevronDown, Check, LogOut, User } from 'lucide-react';

const SettingsTab = () => {
  const { user, logout, canManageTransfers, getAllUsers } = useAuth();
  const [activeSection, setActiveSection] = useState('transfers'); // 'transfers', 'pin', 'account'
  const [transfers, setTransfers] = useState([]);
  const [showAddTransfer, setShowAddTransfer] = useState(false);

  useEffect(() => {
    loadTransfers();
  }, []);

  const loadTransfers = () => {
    const allTransfers = getTransfers();
    setTransfers(allTransfers.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  // Group transfers by month
  const groupedTransfers = transfers.reduce((groups, transfer) => {
    const date = new Date(transfer.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!groups[key]) {
      groups[key] = {
        year: date.getFullYear(),
        month: date.getMonth(),
        transfers: [],
      };
    }
    groups[key].transfers.push(transfer);
    return groups;
  }, {});

  const sortedGroups = Object.values(groupedTransfers).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  const getUserName = (userId) => {
    const names = {
      mariano: 'Mariano',
      gabriela: 'Gabriela',
      juanmartin: 'Juan Martín',
    };
    return names[userId] || userId;
  };

  const handleDeleteTransfer = (transferId) => {
    deleteTransfer(transferId);
    loadTransfers();
  };

  return (
    <div className="pb-24 px-4" data-testid="settings-tab">
      {/* Section Tabs */}
      <div className="flex gap-2 py-4 overflow-x-auto">
        <button
          onClick={() => setActiveSection('transfers')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeSection === 'transfers' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          Transferencias
        </button>
        <button
          onClick={() => setActiveSection('pin')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeSection === 'pin' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          Cambiar PIN
        </button>
        <button
          onClick={() => setActiveSection('account')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeSection === 'account' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          Cuenta
        </button>
      </div>

      {/* Transfers Section */}
      {activeSection === 'transfers' && (
        <div data-testid="transfers-section">
          {canManageTransfers ? (
            <>
              {/* Add Transfer Button */}
              <button
                onClick={() => setShowAddTransfer(true)}
                data-testid="add-transfer-btn"
                className="w-full bg-slate-800 border border-slate-700 border-dashed rounded-xl p-4 flex items-center justify-center gap-2 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors mb-4"
              >
                <Plus className="w-5 h-5" />
                <span>Registrar transferencia</span>
              </button>

              {/* Transfers List */}
              {sortedGroups.length === 0 ? (
                <div className="text-center py-8">
                  <ArrowRight className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No hay transferencias</p>
                </div>
              ) : (
                sortedGroups.map((group) => (
                  <div key={`${group.year}-${group.month}`} className="mb-6">
                    <h3 className="text-white font-medium mb-3">
                      {getMonthName(group.month)} {group.year}
                    </h3>
                    <div className="space-y-2">
                      {group.transfers.map((transfer) => (
                        <div
                          key={transfer.id}
                          className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between"
                          data-testid={`transfer-item-${transfer.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{getUserName(transfer.from)}</span>
                              <ArrowRight className="w-4 h-4 text-emerald-400" />
                              <span className="text-white font-medium">{getUserName(transfer.to)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-emerald-400 font-bold">{formatCurrency(transfer.amount)}</span>
                            <button
                              onClick={() => handleDeleteTransfer(transfer.id)}
                              className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
                              data-testid={`delete-transfer-${transfer.id}`}
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            /* View Only for Juan */
            <div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
                <p className="text-amber-400 text-sm">Solo podés ver las transferencias. Solo Mariano o Gabriela pueden registrar nuevas.</p>
              </div>
              {sortedGroups.length === 0 ? (
                <div className="text-center py-8">
                  <ArrowRight className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No hay transferencias</p>
                </div>
              ) : (
                sortedGroups.map((group) => (
                  <div key={`${group.year}-${group.month}`} className="mb-6">
                    <h3 className="text-white font-medium mb-3">
                      {getMonthName(group.month)} {group.year}
                    </h3>
                    <div className="space-y-2">
                      {group.transfers.map((transfer) => (
                        <div
                          key={transfer.id}
                          className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-white">{getUserName(transfer.from)}</span>
                            <ArrowRight className="w-4 h-4 text-emerald-400" />
                            <span className="text-white">{getUserName(transfer.to)}</span>
                          </div>
                          <span className="text-emerald-400 font-bold">{formatCurrency(transfer.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Add Transfer Modal */}
          {showAddTransfer && (
            <TransferForm onClose={() => setShowAddTransfer(false)} onSave={loadTransfers} />
          )}
        </div>
      )}

      {/* Change PIN Section */}
      {activeSection === 'pin' && <ChangePinSection />}

      {/* Account Section */}
      {activeSection === 'account' && (
        <div data-testid="account-section">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-white font-medium text-lg">{user?.name}</p>
                <p className="text-slate-400 text-sm capitalize">{user?.role === 'parent' ? 'Administrador' : 'Colaborador'}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-700">
                <span className="text-slate-400">Puede editar todos los gastos</span>
                <span className={user?.canEditAll ? 'text-emerald-400' : 'text-slate-500'}>{user?.canEditAll ? 'Sí' : 'No'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Puede gestionar transferencias</span>
                <span className={user?.canManageTransfers ? 'text-emerald-400' : 'text-slate-500'}>{user?.canManageTransfers ? 'Sí' : 'No'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            data-testid="logout-btn"
            className="w-full bg-red-500/10 border border-red-500/30 text-red-400 font-medium py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

// Transfer Form Component
const TransferForm = ({ onClose, onSave }) => {
  const { getAllUsers } = useAuth();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  const users = getAllUsers();

  const allowedTransfers = [
    { from: 'mariano', to: 'gabriela' },
    { from: 'gabriela', to: 'mariano' },
    { from: 'mariano', to: 'juanmartin' },
    { from: 'gabriela', to: 'juanmartin' },
  ];

  const getAvailableToUsers = () => {
    if (!formData.from) return [];
    return allowedTransfers.filter((t) => t.from === formData.from).map((t) => t.to);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.from) newErrors.from = 'Seleccioná origen';
    if (!formData.to) newErrors.to = 'Seleccioná destino';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Monto inválido';
    if (!formData.date) newErrors.date = 'Seleccioná fecha';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    addTransfer({
      ...formData,
      amount: parseFloat(formData.amount),
    });
    onSave && onSave();
    onClose();
  };

  const getUserName = (userId) => {
    const u = users.find((u) => u.id === userId);
    return u ? u.name : 'Seleccionar';
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-5" onClick={(e) => e.stopPropagation()} data-testid="transfer-form">
        <h2 className="text-xl font-bold text-white mb-5">Nueva Transferencia</h2>

        {/* From */}
        <div className="relative mb-4">
          <label className="block text-slate-300 text-sm font-medium mb-2">Desde</label>
          <button
            onClick={() => setShowFromDropdown(!showFromDropdown)}
            className={`w-full bg-slate-800 border ${errors.from ? 'border-red-500' : 'border-slate-700'} rounded-xl py-3 px-4 text-left flex items-center justify-between`}
          >
            <span className={formData.from ? 'text-white' : 'text-slate-500'}>{getUserName(formData.from)}</span>
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </button>
          {showFromDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              {['mariano', 'gabriela'].map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    setFormData({ ...formData, from: id, to: '' });
                    setShowFromDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left text-white hover:bg-slate-700"
                >
                  {getUserName(id)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* To */}
        <div className="relative mb-4">
          <label className="block text-slate-300 text-sm font-medium mb-2">Hacia</label>
          <button
            onClick={() => formData.from && setShowToDropdown(!showToDropdown)}
            disabled={!formData.from}
            className={`w-full bg-slate-800 border ${errors.to ? 'border-red-500' : 'border-slate-700'} rounded-xl py-3 px-4 text-left flex items-center justify-between disabled:opacity-50`}
          >
            <span className={formData.to ? 'text-white' : 'text-slate-500'}>{getUserName(formData.to)}</span>
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </button>
          {showToDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              {getAvailableToUsers().map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    setFormData({ ...formData, to: id });
                    setShowToDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left text-white hover:bg-slate-700"
                >
                  {getUserName(id)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="block text-slate-300 text-sm font-medium mb-2">Monto</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0"
              className={`w-full bg-slate-800 border ${errors.amount ? 'border-red-500' : 'border-slate-700'} rounded-xl py-3 pl-10 pr-4 text-white`}
            />
          </div>
        </div>

        {/* Date */}
        <div className="mb-6">
          <label className="block text-slate-300 text-sm font-medium mb-2">Fecha</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-slate-800 text-white py-3 rounded-xl">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            data-testid="submit-transfer-btn"
            className="flex-1 bg-emerald-500 text-white py-3 rounded-xl"
          >
            Registrar
          </button>
        </div>
      </div>
    </div>
  );
};

// Change PIN Component
const ChangePinSection = () => {
  const { user } = useAuth();
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChangePin = () => {
    setError('');
    setSuccess(false);

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setError('El PIN debe tener 4 dígitos');
      return;
    }

    if (newPin !== confirmPin) {
      setError('Los PINs no coinciden');
      return;
    }

    // Verify current PIN
    const { authenticateUser } = require('../services/storageService');
    const verified = authenticateUser(user.id, currentPin);
    if (!verified) {
      setError('PIN actual incorrecto');
      return;
    }

    // Update PIN
    const result = updateUserPin(user.id, newPin);
    if (result) {
      setSuccess(true);
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    } else {
      setError('Error al cambiar el PIN');
    }
  };

  return (
    <div data-testid="pin-section">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <Lock className="w-5 h-5 text-emerald-400" />
          <h3 className="text-white font-medium">Cambiar PIN de acceso</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">PIN actual</label>
            <input
              type="password"
              maxLength={4}
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              data-testid="current-pin-input"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white text-center tracking-widest"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-2">Nuevo PIN</label>
            <input
              type="password"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              data-testid="new-pin-input"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white text-center tracking-widest"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-2">Confirmar nuevo PIN</label>
            <input
              type="password"
              maxLength={4}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              data-testid="confirm-pin-input"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white text-center tracking-widest"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-emerald-400 text-sm">PIN actualizado correctamente</p>}

          <button
            onClick={handleChangePin}
            data-testid="change-pin-btn"
            className="w-full bg-emerald-500 text-white font-medium py-3 rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Cambiar PIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
