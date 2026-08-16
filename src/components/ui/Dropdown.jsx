import { useState, useEffect, useRef, Children, cloneElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/format';

/**
 * منوی کشویی (Dropdown) — مدیریت باز/بسته با کلیک خارج
 */
export default function Dropdown({
  trigger,
  children,
  align = 'right',
  className = '',
  menuClassName = '',
  triggerClassName = '',
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const alignCls =
    align === 'left' ? 'left-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'right-0';

  return (
    <div ref={ref} className={cn('relative', className)}>
      {typeof trigger === 'function'
        ? trigger({ open, toggle: () => setOpen((o) => !o) })
        : cloneElement(trigger, {
            onClick: () => setOpen((o) => !o),
            className: cn(trigger.props?.className, triggerClassName),
          })}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className={cn(
              'absolute z-50 mt-2 min-w-52 rounded-2xl bg-card border border-border/70 shadow-lift p-2',
              alignCls,
              menuClassName
            )}
          >
            {typeof children === 'function' ? children({ close: () => setOpen(false) }) : children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DropdownItem({ icon: Icon, children, onClick, active, danger, className }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors',
        active && 'bg-brand-500/10 text-brand-600 dark:text-brand-300',
        danger ? 'text-red-500 hover:bg-red-500/10' : 'text-foreground hover:bg-muted/40',
        className
      )}
    >
      {Icon && <Icon size={17} />}
      <span className="flex-1 text-right">{children}</span>
      {active && <ChevronDown size={14} className="rotate-180 opacity-60" />}
    </button>
  );
}
