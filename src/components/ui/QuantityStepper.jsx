import { Minus, Plus } from 'lucide-react';
import { toFaDigits } from '../../utils/format';

export default function QuantityStepper({ value, onChange, min = 1, max = 10, size = 'md' }) {
  const btnSize = size === 'lg' ? 'h-10 w-10' : 'h-8 w-8';

  return (
    <div className="inline-flex items-center rounded-xl border border-border bg-surface overflow-hidden">
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`${btnSize} grid place-items-center text-foreground transition-colors hover:bg-muted/40 disabled:opacity-40`}
        aria-label="افزایش"
      >
        <Plus size={16} />
      </button>
      <span className={`w-10 text-center font-dana font-semibold text-foreground ${size === 'lg' ? 'text-base' : 'text-sm'}`}>
        {toFaDigits(value)}
      </span>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`${btnSize} grid place-items-center text-foreground transition-colors hover:bg-muted/40 disabled:opacity-40`}
        aria-label="کاهش"
      >
        <Minus size={16} />
      </button>
    </div>
  );
}
