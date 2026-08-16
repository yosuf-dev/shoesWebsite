import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '../../utils/format';

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[94vw]',
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className={cn(
              'relative w-full rounded-3xl bg-card border border-border/60 shadow-lift overflow-hidden',
              sizes[size],
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between border-b border-border/70 px-6 py-4">
                <h3 className="font-morabba font-bold text-lg text-foreground">{title}</h3>
                <button
                  onClick={onClose}
                  className="h-9 w-9 grid place-items-center rounded-full hover:bg-muted/50 text-muted-foreground transition-colors"
                  aria-label="بستن"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="max-h-[80vh] overflow-y-auto px-6 py-5">{children}</div>
            {footer && (
              <div className="flex items-center justify-end gap-3 border-t border-border/70 px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
