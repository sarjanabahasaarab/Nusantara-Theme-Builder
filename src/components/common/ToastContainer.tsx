/**
 * Nusantara Theme Builder — Toast Container
 * Notifikasi sistem informatif untuk aksi simpan, hapus, impor, dan peringatan.
 */

import React from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, removeToast } = useProjectStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      {notifications.map((toast) => {
        let bgClass = 'bg-neutral-900 border-neutral-700 text-neutral-100';
        let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;

        if (toast.type === 'success') {
          bgClass = 'bg-emerald-950/90 border-emerald-700/80 text-emerald-100';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
        } else if (toast.type === 'error') {
          bgClass = 'bg-rose-950/90 border-rose-700/80 text-rose-100';
          icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
        } else if (toast.type === 'warning') {
          bgClass = 'bg-amber-950/90 border-amber-700/80 text-amber-100';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-xl backdrop-blur-md text-sm transition-all animate-in fade-in slide-in-from-bottom-2 ${bgClass}`}
          >
            {icon}
            <div className="flex-1 text-xs sm:text-sm leading-relaxed">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
