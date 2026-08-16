import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { toFaDigits } from '../../utils/format';

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  trend = 'up',
  gradient = 'brand',
  className = '',
}) {
  const gradients = {
    brand: 'from-brand-500/15 to-brand-600/5 text-brand-500',
    accent: 'from-accent-500/15 to-accent-600/5 text-accent-500',
    emerald: 'from-emerald-500/15 to-emerald-600/5 text-emerald-500',
    rose: 'from-rose-500/15 to-rose-600/5 text-rose-500',
    sky: 'from-sky-500/15 to-sky-600/5 text-sky-500',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`card-elevated relative overflow-hidden p-5 ${className}`}
    >
      <div
        className={`absolute -left-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${gradients[gradient]} opacity-60 blur-2xl`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1.5">{title}</p>
          <p className="font-morabba font-bold text-2xl text-foreground">{value}</p>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${gradients[gradient]}`}>
          <Icon size={22} strokeWidth={2} />
        </div>
      </div>
      {change != null && (
        <div className="relative mt-4 flex items-center gap-1.5 text-xs font-medium">
          {trend === 'up' ? (
            <TrendingUp size={14} className="text-emerald-500" />
          ) : (
            <TrendingDown size={14} className="text-red-500" />
          )}
          <span className={trend === 'up' ? 'text-emerald-500' : 'text-red-500'}>
            {toFaDigits(Math.abs(change))}٪
          </span>
          <span className="text-muted-foreground">نسبت به ماه قبل</span>
        </div>
      )}
    </motion.div>
  );
}
