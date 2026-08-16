import { Check } from 'lucide-react';
import { cn } from '../../utils/format';

export default function Checkbox({ checked, onChange, label, className = '', ...props }) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-2.5 text-sm', className)}>
      <span
        onClick={(e) => {
          e.preventDefault();
          onChange?.(!checked);
        }}
        className={cn(
          'grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-all',
          checked
            ? 'border-brand-600 bg-brand-gradient text-white'
            : 'border-border bg-surface hover:border-brand-500'
        )}
      >
        {checked && <Check size={13} strokeWidth={3} />}
      </span>
      {label && <span className="text-foreground">{label}</span>}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="sr-only"
        {...props}
      />
    </label>
  );
}
