import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, AlertTriangle, Info, X, ShoppingBag, Heart, Sparkles,
} from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
  cart: ShoppingBag,
  wishlist: Heart,
  promo: Sparkles,
};

const COLORS = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-sky-500',
  cart: 'text-brand-500',
  wishlist: 'text-rose-500',
  promo: 'text-accent-500',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message, type = 'success', title = null) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev.slice(-4), { id, message, type, title }]);
      setTimeout(() => dismiss(id), 3800);
    },
    [dismiss]
  );

  const toast = {
    show,
    success: (m, t) => show(m, 'success', t),
    error: (m, t) => show(m, 'error', t),
    info: (m, t) => show(m, 'info', t),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-3 w-[min(92vw,380px)]">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type] || Info;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: -60, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -60, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="glass rounded-2xl px-4 py-3.5 shadow-lift flex items-start gap-3 border border-border/70"
              >
                <span className={`mt-0.5 shrink-0 ${COLORS[t.type] || 'text-brand-500'}`}>
                  <Icon size={22} strokeWidth={2.2} />
                </span>
                <div className="flex-1 min-w-0">
                  {t.title && (
                    <p className="font-medium text-sm text-foreground">{t.title}</p>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.message}</p>
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="بستن"
                >
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast باید داخل ToastProvider استفاده شود.');
  return ctx;
}
