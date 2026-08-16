import { forwardRef } from 'react';
import { cn } from '../../utils/format';

const Input = forwardRef(
  ({ label, error, icon: Icon, hint, className = '', leftIcon = false, ...props }, ref) => {
    return (
      <div className={cn('w-full', className)}>
        {label && <label className="label-app">{label}</label>}
        <div className="relative">
          {Icon && (
            <Icon
              size={18}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 text-muted-foreground',
                leftIcon ? 'right-3.5' : 'left-3.5'
              )}
            />
          )}
          <input
            ref={ref}
            className={cn(
              'input-app',
              Icon && (leftIcon ? 'pr-11' : 'pl-11'),
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
            )}
            {...props}
          />
        </div>
        {hint && !error && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
