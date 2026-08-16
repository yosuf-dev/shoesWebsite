import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { Wallet, ShoppingBag, Eye, Users, ArrowLeft } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Skeleton, { SkeletonTable } from '../../components/ui/Skeleton';
import { PageHeader } from '../../layouts/AdminLayout';
import { useTheme } from '../../contexts/ThemeContext';
import { SALES_CHART, SALES_BY_CATEGORY, TOP_PRODUCTS, ACTIVITY_LOG, ORDERS } from '../../data/mockData';
import { PAYMENT_METHODS } from '../../constants/config';
import { toFaDigits, formatToman, relativeTime, cn } from '../../utils/format';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

const PERIODS = [
  { key: '3', label: '۳ ماه' },
  { key: '6', label: '۶ ماه' },
  { key: '12', label: '۱۲ ماه' },
];

const DOUGHNUT_COLORS = ['#6366f1', '#8b5cf6', '#f59e0b', '#0ea5e9', '#10b981', '#94a3b8'];

const paymentLabel = (id) => PAYMENT_METHODS.find((p) => p.id === id)?.label || id;

const Card = ({ title, action, children, className }) => (
  <div className={cn('card-elevated p-5', className)}>
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="font-morabba font-bold text-base text-foreground">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('12');
  const { theme } = useTheme();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const tick = theme === 'dark' ? '#94a3b8' : '#64748b';
  const grid = theme === 'dark' ? 'rgba(148,163,184,0.12)' : 'rgba(100,116,139,0.12)';
  const slice = 12 - Number(period);

  const lineData = {
    labels: SALES_CHART.months.slice(slice),
    datasets: [
      {
        label: 'درآمد (میلیون تومان)',
        data: SALES_CHART.revenue.slice(slice),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.12)',
        fill: true,
        tension: 0.42,
        pointRadius: 3,
        pointBackgroundColor: '#6366f1',
        yAxisID: 'y',
      },
      {
        label: 'تعداد سفارش',
        data: SALES_CHART.orders.slice(slice),
        borderColor: '#f59e0b',
        borderDash: [6, 6],
        tension: 0.42,
        pointRadius: 0,
        yAxisID: 'y1',
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        labels: { color: tick, usePointStyle: true, pointStyle: 'circle', padding: 16, font: { family: 'Dana' } },
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
        titleFont: { family: 'Dana' },
        callbacks: {
          label: (ctx) => (ctx.datasetIndex === 0 ? ` درآمد: ${toFaDigits(ctx.parsed.y)} میلیون تومان` : ` سفارش: ${toFaDigits(ctx.parsed.y)} عدد`),
        },
      },
    },
    scales: {
      x: { ticks: { color: tick, font: { family: 'Dana' } }, grid: { color: grid } },
      y: {
        beginAtZero: true,
        ticks: { color: tick, font: { family: 'Dana' } },
        grid: { color: grid },
        title: { display: true, text: 'درآمد', color: tick, font: { family: 'Dana' } },
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: tick, font: { family: 'Dana' } },
      },
    },
  };

  const doughnutData = {
    labels: SALES_BY_CATEGORY.map((c) => c.label),
    datasets: [
      {
        data: SALES_BY_CATEGORY.map((c) => c.value),
        backgroundColor: DOUGHNUT_COLORS,
        borderWidth: 2,
        borderColor: 'rgb(var(--card))',
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '64%',
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

  const stats = [
    { title: 'درآمد کل', value: `${toFaDigits(189)} میلیون تومان`, change: 12.5, icon: Wallet, gradient: 'brand' },
    { title: 'سفارش‌های ثبت‌شده', value: toFaDigits(1020), change: 8.5, icon: ShoppingBag, gradient: 'accent' },
    { title: 'بازدیدکنندگان', value: toFaDigits(21000), change: 14.1, icon: Eye, gradient: 'sky' },
    { title: 'مشتریان فعال', value: toFaDigits(1248), change: 9.2, icon: Users, gradient: 'emerald' },
  ];

  const totalSales = SALES_BY_CATEGORY.reduce((s, c) => s + c.value, 0);

  return (
    <div>
      <PageHeader
        title="داشبورد"
        subtitle="نمای کلی عملکرد فروشگاه کفشینو در یک نگاه"
        actions={
          <Link
            to="/admin/reports"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-gradient px-4 text-sm font-semibold text-white shadow-glow-sm transition-all hover:opacity-90"
          >
            مشاهده گزارش‌ها
            <ArrowLeft size={16} />
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) =>
          loading ? (
            <Skeleton key={s.title} className="h-36" />
          ) : (
            <StatCard key={s.title} {...s} trend="up" />
          )
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="روند درآمد و سفارش"
          action={
            <div className="flex items-center gap-1 rounded-xl bg-muted/40 p-1">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                    period === p.key ? 'bg-brand-gradient text-white shadow-glow-sm' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          }
        >
          {loading ? (
            <Skeleton className="h-72 w-full" />
          ) : (
            <div className="relative h-72">
              <Line data={lineData} options={lineOptions} />
            </div>
          )}
        </Card>

        <Card title="فروش بر اساس دسته‌بندی">
          {loading ? (
            <Skeleton className="h-72 w-full" />
          ) : (
            <div className="relative h-72">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div className="pointer-events-none absolute inset-0 grid place-items-center pt-4">
                <div className="text-center">
                  <p className="font-morabba font-bold text-xl text-foreground">{toFaDigits(totalSales)}٪</p>
                  <p className="text-[11px] text-muted-foreground">سهم فروش</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="پرفروش‌ترین محصولات"
          action={
            <Link to="/admin/products" className="text-xs font-medium text-brand-600 transition-colors hover:text-brand-500 dark:text-brand-300">
              همه محصولات
            </Link>
          }
        >
          {loading ? (
            <SkeletonTable rows={5} cols={4} />
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>رتبه</th>
                    <th>محصول</th>
                    <th>تعداد فروش</th>
                    <th>درآمد</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_PRODUCTS.map((p, i) => (
                    <tr key={p.name}>
                      <td>
                        <span
                          className={cn(
                            'grid h-8 w-8 place-items-center rounded-lg text-sm font-bold',
                            i === 0 ? 'bg-accent-gradient text-white' : 'bg-muted/50 text-muted-foreground'
                          )}
                        >
                          {toFaDigits(i + 1)}
                        </span>
                      </td>
                      <td>
                        <span className="font-medium text-foreground">{p.name}</span>
                      </td>
                      <td className="font-dana text-foreground">{toFaDigits(p.sales)}</td>
                      <td className="font-morabba font-bold text-foreground">{formatToman(p.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card title="فعالیت‌های اخیر">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : (
            <div className="space-y-0">
              {ACTIVITY_LOG.map((log, i) => (
                <div key={log.id} className="relative flex gap-3 pb-4 last:pb-0">
                  {i !== ACTIVITY_LOG.length - 1 && (
                    <span className="absolute right-[9px] top-5 h-full w-px bg-border" />
                  )}
                  <span className="mt-1.5 h-[18px] w-[18px] shrink-0 rounded-full border-2 border-brand-500 bg-background" />
                  <div className="min-w-0">
                    <p className="text-sm leading-6 text-foreground">
                      <span className="font-semibold">{log.user}</span>
                      <span className="text-muted-foreground"> — {log.action}</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/70">{relativeTime(log.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card
        className="mt-5"
        title="سفارش‌های اخیر"
        action={
          <Link to="/admin/orders" className="text-xs font-medium text-brand-600 transition-colors hover:text-brand-500 dark:text-brand-300">
            همه سفارش‌ها
          </Link>
        }
      >
        {loading ? (
          <SkeletonTable rows={5} cols={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>شماره سفارش</th>
                  <th>مشتری</th>
                  <th>تاریخ</th>
                  <th>اقلام</th>
                  <th>مبلغ</th>
                  <th>پرداخت</th>
                  <th>وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td className="font-medium text-brand-600 dark:text-brand-300">{o.id}</td>
                    <td className="text-foreground">{o.userName}</td>
                    <td className="text-muted-foreground">{relativeTime(o.date)}</td>
                    <td className="text-foreground">{toFaDigits(o.items)} قلم</td>
                    <td className="font-morabba font-bold text-foreground">{formatToman(o.total)}</td>
                    <td>
                      <span className="text-xs text-muted-foreground">{paymentLabel(o.payment)}</span>
                    </td>
                    <td>
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
