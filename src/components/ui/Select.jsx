import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/format';

const Select = forwardRef(
  ({ label, error, options = [], icon: Icon, placeholder = 'انتخاب کنید', className = '', ...props }, ref) => {
    return (
      <div className={cn('w-full', className)}>
        {label && <label className="label-app">{label}</label>}
        <div className="relative">
          {Icon && (
            <Icon size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          )}
          <select
            ref={ref}
            className={cn(
              'input-app appearance-none pl-10 cursor-pointer',
              Icon && 'pr-11',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => {
              const value = typeof opt === 'object' ? opt.value : opt;
              const labelText = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={value} value={value}>
                  {labelText}
                </option>
              );
            })}
          </select>
          <ChevronDown size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
