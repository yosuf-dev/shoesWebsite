import { Activity as ActivityIcon, PackagePlus, TicketPercent, Truck, Boxes, ShoppingBag, ImagePlus } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import { PageHeader } from '../../layouts/AdminLayout';
import { ACTIVITY_LOG } from '../../data/mockData';
import { cn, toFaDigits, formatFaDate, formatFaTime, relativeTime } from '../../utils/format';

const ICON_MAP = [
  { icon: PackagePlus, color: 'bg-brand-500/10 text-brand-500' },
  { icon: TicketPercent, color: 'bg-accent-500/10 text-accent-500' },
  { icon: Truck, color: 'bg-sky-500/10 text-sky-500' },
  { icon: Boxes, color: 'bg-emerald-500/10 text-emerald-500' },
  { icon: ShoppingBag, color: 'bg-violet-500/10 text-violet-500' },
  { icon: ImagePlus, color: 'bg-rose-500/10 text-rose-500' },
];

const stats = [
  { label: 'کل فعالیت‌ها', value: ACTIVITY_LOG.length },
  { label: 'فعالیت امروز', value: 2 },
  { label: 'این هفته', value: 6 },
];

export default function Activity() {
  return (
    <div>
      <PageHeader title="فعالیت‌ها" subtitle="تاریخچه کامل رویدادها و اقدامات انجام‌شده در پنل مدیریت" />

      <div className="mb-5 grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card-elevated p-4 text-center">
            <p className="font-morabba font-bold text-2xl text-foreground">{toFaDigits(s.value)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card-elevated p-6">
        <div className="relative">
          <span className="absolute right-[15px] top-2 bottom-2 w-px bg-border" />
          <div className="space-y-6">
            {ACTIVITY_LOG.map((log, i) => {
              const meta = ICON_MAP[i % ICON_MAP.length];
              const Icon = meta.icon;
              return (
                <div key={log.id} className="relative flex items-start gap-4 pr-0">
                  <span className={cn('z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ring-4 ring-card', meta.color)}>
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1 rounded-2xl border border-border/70 bg-surface p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge variant={log.user === 'سیستم' ? 'info' : log.user === 'مدیر فروش' ? 'warning' : 'brand'}>
                        {log.user}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatFaDate(log.date, true)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-foreground">{log.action}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground/70">{relativeTime(log.date)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-muted/30 py-3 text-xs text-muted-foreground">
          <ActivityIcon size={14} className="text-brand-500" />
          پایان تاریخچه فعالیت‌ها — ساعت {formatFaTime(new Date())}
        </div>
      </div>
    </div>
  );
}
