import { Link } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';
import { toFaDigits } from '../../utils/format';

export default function Breadcrumb({ items = [], className = '' }) {
  return (
    <nav className={`flex flex-wrap items-center gap-1.5 text-sm ${className}`} aria-label="مسیر">
      <Link
        to="/"
        className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-brand-500"
      >
        <Home size={15} />
        خانه
      </Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        const label = typeof item === 'string' ? item : item.label;
        const to = typeof item === 'string' ? null : item.to;
        return (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronLeft size={14} className="text-muted-foreground/60" />
            {isLast || !to ? (
              <span className="font-medium text-foreground">{toFaDigits(label)}</span>
            ) : (
              <Link to={to} className="text-muted-foreground transition-colors hover:text-brand-500">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
