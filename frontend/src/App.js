import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './components/LoginScreen';
import HomeTab from './components/HomeTab';
import ExpensesTab from './components/ExpensesTab';
import SettingsTab from './components/SettingsTab';
import AlertsTab from './components/AlertsTab';
import ExpenseForm from './components/ExpenseForm';
import BottomNav from './components/BottomNav';
import InstallButton from './components/InstallButton';
import './App.css';

const MainApp = () => {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowExpenseForm(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleCloseExpenseForm = () => {
    setShowExpenseForm(false);
    setEditingExpense(null);
  };

  const handleSaveExpense = () => {
    handleRefresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-900" data-testid="main-app">
      {/* Install Button */}
      <InstallButton />

      {/* Header */}
      <header className="sticky top-0 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800 z-30">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-white">Gestión JM</h1>
          <p className="text-slate-400 text-sm">Gastos Compartidos</p>
        </div>
      </header>

      {/* Content */}
      <main key={refreshKey}>
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'expenses' && (
          <ExpensesTab
            onAddExpense={handleAddExpense}
            onEditExpense={handleEditExpense}
          />
        )}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'alerts' && <AlertsTab />}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <ExpenseForm
          expense={editingExpense}
          onClose={handleCloseExpenseForm}
          onSave={handleSaveExpense}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
