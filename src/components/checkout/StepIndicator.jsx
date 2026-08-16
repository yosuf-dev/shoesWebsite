import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { toFaDigits, cn } from '../../utils/format';

const STEPS = ['آدرس تحویل', 'روش ارسال', 'پرداخت', 'بازبینی سفارش', 'تأیید'];

export default function StepIndicator({ current = 0, onStepClick }) {
  return (
    <ol className="grid grid-cols-5 gap-1 sm:gap-2">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-col items-center">
            <div className="flex w-full items-center">
              <div className={cn('h-0.5 flex-1 overflow-hidden rounded-full', i === 0 ? 'bg-transparent' : 'bg-border')}>
                {i > 0 && (
                  <motion.div
                    className="h-full bg-brand-gradient"
                    initial={false}
                    animate={{ width: done ? '100%' : '0%' }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => done && onStepClick?.(i)}
                disabled={!done}
                className={cn(
                  'relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-sm font-semibold transition-all duration-300 sm:h-10 sm:w-10',
                  done && 'cursor-pointer border-brand-600 bg-brand-gradient text-white shadow-glow-sm',
                  active && 'border-brand-600 bg-card text-brand-600 ring-4 ring-brand-500/15',
                  !done && !active && 'border-border bg-surface text-muted-foreground'
                )}
                aria-label={label}
              >
                {done ? <Check size={16} strokeWidth={3} /> : toFaDigits(i + 1)}
              </button>
              <div className={cn('h-0.5 flex-1 overflow-hidden rounded-full', i === STEPS.length - 1 ? 'bg-transparent' : 'bg-border')}>
                {i < STEPS.length - 1 && (
                  <motion.div
                    className="h-full bg-brand-gradient"
                    initial={false}
                    animate={{ width: done ? '100%' : '0%' }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  />
                )}
              </div>
            </div>
            <span
              className={cn(
                'mt-2 text-center text-[10px] font-medium leading-tight sm:text-xs',
                active ? 'text-brand-600 dark:text-brand-300' : done ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
