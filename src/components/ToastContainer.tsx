import React from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-amber-950/90 text-amber-50 dark:bg-amber-100 dark:text-amber-950 shadow-xl border border-amber-500/30 backdrop-blur-md text-xs sm:text-sm font-semibold"
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-amber-400 dark:text-amber-600 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-rose-400 dark:text-rose-600 shrink-0" />}
            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
