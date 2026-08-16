import { Star } from 'lucide-react';
import { toFaDigits } from '../../utils/format';

export default function Rating({ value = 0, count, size = 16, showValue = true, className = '' }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5" dir="ltr">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={
              i <= Math.round(value)
                ? 'fill-accent-400 text-accent-400'
                : 'fill-muted/40 text-muted/50'
            }
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-muted-foreground">
          {toFaDigits(value?.toFixed(1) ?? '0')}
          {count != null && <span className="text-xs text-muted-foreground/70"> ({toFaDigits(count)})</span>}
        </span>
      )}
    </div>
  );
}
