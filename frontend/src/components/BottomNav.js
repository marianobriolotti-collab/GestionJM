import React from 'react';
import { Home, Receipt, Settings, Bell } from 'lucide-react';

const BottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'expenses', label: 'Gastos', icon: Receipt },
    { id: 'settings', label: 'Ajustes', icon: Settings },
    { id: 'alerts', label: 'Alertas', icon: Bell },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 z-40" data-testid="bottom-nav">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              data-testid={`nav-${tab.id}`}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
      {/* Safe area padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};

export default BottomNav;
