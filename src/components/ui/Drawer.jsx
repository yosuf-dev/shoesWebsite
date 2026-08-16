import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '../../utils/format';

export default function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  side = 'left',
  size = 'md',
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

  const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  const isLeft = side === 'left';

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1000]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: isLeft ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isLeft ? '-100%' : '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className={cn(
              'absolute top-0 bottom-0 flex flex-col bg-card border-border/70 shadow-lift',
              isLeft ? 'left-0 border-r' : 'right-0 border-l',
              widths[size]
            )}
          >
            <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
              <h3 className="font-morabba font-bold text-lg text-foreground">{title}</h3>
              <button
                onClick={onClose}
                className="h-9 w-9 grid place-items-center rounded-full hover:bg-muted/50 text-muted-foreground transition-colors"
                aria-label="بستن"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
            {footer && (
              <div className="border-t border-border/70 p-5">{footer}</div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
