import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { MousePointerClick, Eye, Users, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import { PageHeader } from '../../layouts/AdminLayout';
import { useTheme } from '../../contexts/ThemeContext';
import { cn, toFaDigits, formatPercent } from '../../utils/format';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

const WEEKLY_VISITS = {
  labels: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
  visits: [9200, 11400, 10300, 12800, 11900, 15200, 9800],
  orders: [430, 520, 490, 610, 580, 720, 470],
};

const CHANNELS = [
  { name: 'جستجوی گوگل', visitors: 48200, conversions: 1320, rate: 2.7, bar: 'w-[72%]', color: 'bg-brand-500' },
  { name: 'شبکه‌های اجتماعی', visitors: 31200, conversions: 780, rate: 2.5, bar: 'w-[55%]', color: 'bg-sky-500' },
  { name: 'دسترسی مستقیم', visitors: 24800, conversions: 850, rate: 3.4, bar: 'w-[80%]', color: 'bg-emerald-500' },
  { name: 'ایمیل مارکتینگ', visitors: 11800, conversions: 540, rate: 4.6, bar: 'w-[92%]', color: 'bg-accent-500' },
  { name: 'تبلیغات کلیکی', visitors: 8800, conversions: 210, rate: 2.4, bar: 'w-[48%]', color: 'bg-rose-500' },
];

const FUNNEL = [
  { label: 'بازدید', value: 124800, pct: 100 },
  { label: 'مشاهده محصول', value: 62400, pct: 50 },
  { label: 'افزودن به سبد', value: 31200, pct: 25 },
  { label: 'تسویه حساب', value: 12480, pct: 10 },
  { label: 'خرید موفق', value: 8736, pct: 7 },
];

const Card = ({ title, subtitle, children, className }) => (
  <div className={cn('card-elevated p-5', className)}>
    <div className="mb-4">
      <h3 className="font-morabba font-bold text-base text-foreground">{title}</h3>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
    {children}
  </div>
);

export default function Analytics() {
  const { theme } = useTheme();
  const tick = theme === 'dark' ? '#94a3b8' : '#64748b';
  const grid = theme === 'dark' ? 'rgba(148,163,184,0.12)' : 'rgba(100,116,139,0.12)';

  const barData = {
    labels: WEEKLY_VISITS.labels,
    datasets: [
      {
        label: 'بازدید',
        data: WEEKLY_VISITS.visits,
        backgroundColor: 'rgba(99,102,241,0.85)',
        hoverBackgroundColor: '#6366f1',
        borderRadius: 8,
        barPercentage: 0.65,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        rtl: true,
        backgroundColor: 'rgb(var(--card))',
        titleColor: 'rgb(var(--foreground))',
        bodyColor: 'rgb(var(--muted-foreground))',
        borderColor: 'rgb(var(--border))',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        bodyFont: { family: 'Dana' },
        callbacks: { label: (ctx) => ` بازدید: ${toFaDigits(ctx.parsed.y)}` },
      },
    },
    scales: {
      x: { ticks: { color: tick, font: { family: 'Dana' } }, grid: { display: false } },
      y: { beginAtZero: true, ticks: { color: tick, font: { family: 'Dana' } }, grid: { color: grid } },
    },
  };

  const genderData = {
    labels: ['مرد', 'زن'],
    datasets: [
      {
        data: [58, 42],
        backgroundColor: ['#6366f1', '#f59e0b'],
        borderWidth: 2,
        borderColor: 'rgb(var(--card))',
        hoverOffset: 8,
      },
    ],
  };

  const genderOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: tick, usePointStyle: true, pointStyle: 'circle', padding: 14, font: { family: 'Dana' } },
      },
      tooltip: {
        rtl: true,
        backgroundColor: 'rgb(var(--card))',
        titleColor: 'rgb(var(--foreground))',
        bodyColor: 'rgb(var(--muted-foreground))',
        borderColor: 'rgb(var(--border))',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        bodyFont: { family: 'Dana' },
        callbacks: { label: (ctx) => ` ${toFaDigits(ctx.parsed)}٪` },
      },
    },
  };

  const kpis = [
    { title: 'بازدید کل', value: toFaDigits(124800), change: 12.4, icon: Eye, gradient: 'brand' },
    { title: 'بازدیدکننده یکتا', value: toFaDigits(89250), change: 8.2, icon: Users, gradient: 'sky' },
    { title: 'نرخ تبدیل', value: formatPercent(2.8), change: 4.6, icon: MousePointerClick, gradient: 'emerald' },
    { title: 'میانگین زمان نشست', value: '۴:۳۲ دقیقه', change: 2.1, icon: Clock, gradient: 'accent', trend: 'down' },
  ];

  return (
    <div>
      <PageHeader title="تحلیل‌ها" subtitle="بررسی عملکرد، رفتار کاربران و نرخ تبدیل فروشگاه" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <StatCard key={k.title} {...k} trend={k.trend || 'up'} />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="بازدید هفتگی" subtitle="آمار بازدیدهای هفت روز گذشته">
          <div className="relative h-72">
            <Bar data={barData} options={barOptions} />
          </div>
        </Card>

        <Card title="جنسیت مشتریان" subtitle="ترکیب جنسیتی خریداران">
          <div className="relative h-72">
            <Doughnut data={genderData} options={genderOptions} />
          </div>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="قیف تبدیل" subtitle="از بازدید تا خرید موفق">
          <div className="space-y-4">
            {FUNNEL.map((step, i) => (
              <div key={step.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-foreground">
                    <span className="grid h-6 w-6 place-items-center rounded-lg bg-brand-500/10 text-[11px] font-bold text-brand-600 dark:text-brand-300">
                      {toFaDigits(i + 1)}
                    </span>
                    {step.label}
                  </span>
                  <span className="font-dana text-muted-foreground">
                    {toFaDigits(step.value)} — {toFaDigits(step.pct)}٪
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted/60">
                  <div
                    className="h-full rounded-full bg-brand-gradient"
                    style={{ width: `${step.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2" title="کانال‌های ورود" subtitle="منابع ترافیک و نرخ تبدیل هر کانال">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>کانال</th>
                  <th>بازدید</th>
                  <th>تبدیل</th>
                  <th>نرخ تبدیل</th>
                  <th className="w-[26%]">سهم</th>
                </tr>
              </thead>
              <tbody>
                {CHANNELS.map((c) => (
                  <tr key={c.name}>
                    <td>
                      <span className="font-medium text-foreground">{c.name}</span>
                    </td>
                    <td className="text-foreground">{toFaDigits(c.visitors)}</td>
                    <td className="text-foreground">{toFaDigits(c.conversions)}</td>
                    <td>
                      <Badge variant={c.rate >= 3 ? 'success' : 'info'}>{formatPercent(c.rate)}</Badge>
                    </td>
                    <td>
                      <div className="h-2 overflow-hidden rounded-full bg-muted/60">
                        <div className={cn('h-full rounded-full', c.color)} style={{ width: `${c.rate * 18}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: 'بهترین نرخ تبدیل', value: 'ایمیل مارکتینگ', up: true },
              { label: 'بیشترین ترافیک', value: 'جستجوی گوگل', up: true },
              { label: 'نرخ کلیک', value: '۴.۱٪', up: false },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-muted/30 p-3.5">
                <p className="text-[11px] text-muted-foreground">{item.label}</p>
                <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-foreground">
                  {item.value}
                  {item.up ? (
                    <ArrowUpRight size={14} className="text-emerald-500" />
                  ) : (
                    <ArrowDownRight size={14} className="text-red-500" />
                  )}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
