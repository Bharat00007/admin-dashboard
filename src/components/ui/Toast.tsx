import React from 'react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp();

  if (!toast.show) return null;

  const iconMap = {
    success: 'check_circle',
    info: 'info',
    error: 'error'
  };

  const bgMap = {
    success: 'bg-tertiary/15 text-tertiary',
    info: 'bg-primary/15 text-primary',
    error: 'bg-error/15 text-error'
  };

  return (
    <div className="fixed top-20 right-8 z-[100] transform transition-all duration-300 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-lowest text-on-surface shadow-2xl border border-outline-variant/30">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bgMap[toast.type || 'success']}`}>
        <span className="material-symbols-outlined text-[18px]">
          {iconMap[toast.type || 'success']}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-label-md text-label-md text-on-surface font-semibold">{toast.title}</span>
        <span className="font-body-sm text-body-sm text-on-surface-variant">{toast.message}</span>
      </div>
      <button 
        onClick={hideToast}
        className="ml-3 text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
};

