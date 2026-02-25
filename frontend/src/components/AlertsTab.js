import React from 'react';
import { Bell } from 'lucide-react';

const AlertsTab = () => {
  return (
    <div className="pb-24 px-4" data-testid="alerts-tab">
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Bell className="w-8 h-8 text-slate-600" />
        </div>
        <h3 className="text-white font-medium text-lg mb-2">Sin notificaciones</h3>
        <p className="text-slate-500 text-center text-sm max-w-xs">
          Cuando haya alertas sobre gastos pendientes o reintegros, aparecerán acá.
        </p>
      </div>
    </div>
  );
};

export default AlertsTab;
