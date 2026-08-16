import { cn } from '../../utils/format';

export default function Skeleton({ className = '', variant = 'rect' }) {
  return (
    <div
      className={cn(
        'skeleton',
        variant === 'circle' ? 'rounded-full' : 'rounded-xl',
        className
      )}
    />
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={cn('rounded-3xl border border-border/60 bg-card p-4', className)}>
      <Skeleton className="aspect-square w-full" />
      <div className="mt-4 space-y-2.5">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonProductGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 6, cols = 5 }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-6" />
          ))}
        </div>
      ))}
    </div>
  );
}
