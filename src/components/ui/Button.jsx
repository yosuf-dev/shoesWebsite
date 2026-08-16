import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/format';

const VARIANTS = {
  primary: 'btn-gradient rounded-xl',
  secondary: 'bg-surface text-foreground border border-border hover:bg-muted/40 rounded-xl',
  outline: 'border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-xl',
  ghost: 'text-foreground hover:bg-muted/50 rounded-xl',
  danger: 'bg-red-500 text-white hover:bg-red-600 rounded-xl shadow-glow-sm',
  dark: 'bg-foreground text-background hover:opacity-90 rounded-xl',
  accent: 'bg-accent-gradient text-white rounded-xl shadow-glow-sm',
};

const SIZES = {
  xs: 'h-8 px-3 text-xs gap-1.5',
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-6 text-sm gap-2',
  lg: 'h-13 px-8 text-base gap-2',
  xl: 'h-14 px-10 text-lg gap-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  icon: Icon,
  fullWidth = false,
  as: Tag = 'button',
  ...props
}) {
  const content = (
    <>
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        Icon && <Icon size={18} strokeWidth={2.2} />
      )}
      <span>{children}</span>
    </>
  );

  const cls = cn(
    'inline-flex items-center justify-center font-dana font-semibold select-none',
    'transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50',
    'active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className
  );

  if (Tag !== 'button') {
    return (
      <Tag className={cls} {...props}>
        {content}
      </Tag>
    );
  }

  return (
    <motion.button whileTap={{ scale: 0.97 }} className={cls} disabled={loading || props.disabled} {...props}>
      {content}
    </motion.button>
  );
}
