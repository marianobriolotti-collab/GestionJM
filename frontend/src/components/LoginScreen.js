import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, User, AlertCircle } from 'lucide-react';

const LoginScreen = () => {
  const { login, getAllUsers } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const users = getAllUsers();

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setPin(['', '', '', '']);
    setError('');
  };

  const handlePinChange = (index, value) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto-submit when all digits entered
    if (index === 3 && value) {
      const fullPin = newPin.join('');
      if (fullPin.length === 4) {
        handleLogin(fullPin);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleLogin = async (fullPin) => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    setError('');

    // Small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    const result = login(selectedUser.id, fullPin);
    
    if (!result.success) {
      setError(result.error);
      setPin(['', '', '', '']);
      document.getElementById('pin-0')?.focus();
    }
    
    setIsLoading(false);
  };

  const handleBack = () => {
    setSelectedUser(null);
    setPin(['', '', '', '']);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-6">
      {/* Logo/Header */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
          <span className="text-3xl font-bold text-white">JM</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Gestión JM</h1>
        <p className="text-slate-400 text-sm mt-1">Gastos Compartidos</p>
      </div>

      {!selectedUser ? (
        /* User Selection */
        <div className="w-full max-w-sm space-y-3" data-testid="user-selection">
          <p className="text-slate-300 text-center mb-4">¿Quién sos?</p>
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleUserSelect(user)}
              data-testid={`user-btn-${user.id}`}
              className="w-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-emerald-500/50 rounded-xl p-4 flex items-center gap-4 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-slate-300" />
              </div>
              <span className="text-white font-medium">{user.name}</span>
            </button>
          ))}
        </div>
      ) : (
        /* PIN Entry */
        <div className="w-full max-w-sm" data-testid="pin-entry">
          <button
            onClick={handleBack}
            className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"
          >
            ← Cambiar usuario
          </button>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-slate-300" />
              </div>
              <div>
                <p className="text-white font-medium">{selectedUser.name}</p>
                <p className="text-slate-400 text-sm">Ingresá tu PIN</p>
              </div>
            </div>

            {/* PIN Inputs */}
            <div className="flex justify-center gap-3 mb-6">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isLoading}
                  data-testid={`pin-input-${index}`}
                  className="w-14 h-14 bg-slate-900/50 border-2 border-slate-600 focus:border-emerald-500 rounded-xl text-center text-2xl text-white font-bold outline-none transition-colors disabled:opacity-50"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm justify-center mb-4" data-testid="login-error">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <p className="text-slate-500 text-xs text-center mt-4">
            <Lock className="w-3 h-3 inline mr-1" />
            Tu sesión se mantendrá activa
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
