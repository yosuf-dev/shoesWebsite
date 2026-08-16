import { motion } from 'framer-motion';
import { cn } from '../../utils/format';

export default function Switch({ checked, onChange, label, className = '' }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={cn('flex items-center gap-3', className)}
    >
      <motion.span
        animate={{ backgroundColor: checked ? 'rgb(var(--brand-600))' : 'rgb(var(--muted))' }}
        className="relative h-7 w-12 shrink-0 rounded-full transition-colors"
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            'absolute top-1 h-5 w-5 rounded-full bg-white shadow',
            checked ? 'right-6' : 'right-1'
          )}
        />
      </motion.span>
      {label && <span className="text-sm text-foreground">{label}</span>}
    </button>
  );
}
