import { motion } from 'framer-motion';
import { SearchX, PackageOpen, HeartCrack, Inbox } from 'lucide-react';

const ICONS = { search: SearchX, package: PackageOpen, wishlist: HeartCrack, inbox: Inbox };

export default function EmptyState({
  title = 'موردی یافت نشد',
  description,
  icon = 'inbox',
  action,
  className = '',
}) {
  const Icon = ICONS[icon] || Inbox;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/50 px-8 py-16 text-center ${className}`}
    >
      <div className="grid h-20 w-20 place-items-center rounded-3xl bg-brand-gradient/10 text-brand-500 mb-5">
        <Icon size={36} strokeWidth={1.6} />
      </div>
      <h3 className="font-morabba font-bold text-lg text-foreground mb-1.5">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm leading-7 text-muted-foreground mb-6">{description}</p>
      )}
      {action}
    </motion.div>
  );
}
