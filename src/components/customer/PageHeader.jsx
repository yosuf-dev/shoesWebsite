import { cn } from '../../utils/format';

export default function PageHeader({
  title,
  description,
  eyebrow,
  action,
  className = '',
}) {
  return (
    <div className={cn('mb-7 flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        {eyebrow && (
          <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-600 dark:text-brand-300">
            {eyebrow}
          </span>
        )}
        <h1 className="font-morabba font-bold text-2xl text-foreground sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
