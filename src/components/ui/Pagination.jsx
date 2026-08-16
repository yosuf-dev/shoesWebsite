import { ChevronRight, ChevronLeft } from 'lucide-react';
import { toFaDigits } from '../../utils/format';
import { cn } from '../../utils/format';

export default function Pagination({ page, totalPages, onChange, className = '' }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== '...') pages.push('...');
  }

  return (
    <div className={cn('flex items-center justify-center gap-2', className)} dir="ltr">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-foreground transition-all hover:border-brand-500 hover:text-brand-500 disabled:opacity-40 disabled:pointer-events-none"
        aria-label="قبلی"
      >
        <ChevronRight size={18} />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} className="px-1 text-muted-foreground">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={cn(
              'grid h-10 w-10 place-items-center rounded-xl text-sm font-medium transition-all',
              p === page
                ? 'bg-brand-gradient text-white shadow-glow-sm'
                : 'border border-border bg-surface text-foreground hover:border-brand-500'
            )}
          >
            {toFaDigits(p)}
          </button>
        )
      )}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-foreground transition-all hover:border-brand-500 hover:text-brand-500 disabled:opacity-40 disabled:pointer-events-none"
        aria-label="بعدی"
      >
        <ChevronLeft size={18} />
      </button>
    </div>
  );
}
