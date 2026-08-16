import { cn } from '../../utils/format';

const VARIANTS = {
  brand: 'bg-brand-500/10 text-brand-600 dark:text-brand-300 border-brand-500/30',
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
  danger: 'bg-red-500/10 text-red-600 dark:text-red-300 border-red-500/30',
  warning: 'bg-accent-500/15 text-accent-600 dark:text-accent-300 border-accent-500/30',
  info: 'bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-500/30',
  muted: 'bg-muted/50 text-muted-foreground border-border',
  dark: 'bg-foreground text-background border-foreground',
};

export default function Badge({ children, variant = 'brand', className = '', dot = false, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
