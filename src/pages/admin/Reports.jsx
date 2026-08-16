import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  Calendar, BarChart3, Trophy, Boxes, Ticket, Download, FileText, Printer, ArrowDownToLine,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { PageHeader } from '../../layouts/AdminLayout';
import { useToast } from '../../contexts/ToastContext';
import { useTheme } from '../../contexts/ThemeContext';
import { SALES_CHART, TOP_PRODUCTS, SALES_BY_CATEGORY } from '../../data/mockData';
import { cn, toFaDigits, formatToman } from '../../utils/format';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

const REPORTS = [
  { key: 'daily', title: 'فروش روزانه', desc: 'گزارش دقیق فروش به تفکیک روزهای هفته جاری', icon: Calendar, color: 'from-brand-500/15 to-brand-600/5 text-brand-500' },
  { key: 'monthly', title: 'فروش ماهانه', desc: 'مقایسه فروش و درآمد ماه‌های سال', icon: BarChart3, color: 'from-accent-500/15 to-accent-600/5 text-accent-500' },
  { key: 'best', title: 'پرفروش‌ترین محصولات', desc: 'محصولات برتر بر اساس تعداد فروش و درآمد', icon: Trophy, color: 'from-emerald-500/15 to-emerald-600/5 text-emerald-500' },
  { key: 'inventory', title: 'گزارش موجودی', desc: 'وضعیت موجودی انبار و محصولات کم‌موجود', icon: Boxes, color: 'from-sky-500/15 to-sky-600/5 text-sky-500' },
  { key: 'coupons', title: 'گزارش کوپن‌ها', desc: 'کارایی و آمار استفاده از کوپن‌های تخفیف', icon: Ticket, color: 'from-rose-500/15 to-rose-600/5 text-rose-500' },
];

export default function Reports() {
  const toast = useToast();
  const { theme } = useTheme();
  const [range, setRange] = useState('12');
  const tick = theme === 'dark' ? '#94a3b8' : '#64748b';
  const grid = theme === 'dark' ? 'rgba(148,163,184,0.12)' : 'rgba(100,116,139,0.12)';

  const slice = 12 - Number(range);
  const barData = {
    labels: SALES_CHART.months.slice(slice),
    datasets: [
      {
        label: 'درآمد (میلیون تومان)',
        data: SALES_CHART.revenue.slice(slice),
        backgroundColor: 'rgba(99,102,241,0.85)',
        hoverBackgroundColor: '#6366f1',
        borderRadius: 8,
        barPercentage: 0.6,
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
        callbacks: { label: (ctx) => ` درآمد: ${toFaDigits(ctx.parsed.y)} میلیون تومان` },
      },
    },
    scales: {
      x: { ticks: { color: tick, font: { family: 'Dana' } }, grid: { display: false } },
      y: { beginAtZero: true, ticks: { color: tick, font: { family: 'Dana' } }, grid: { color: grid } },
    },
  };

  const downloadCsv = (report) => {
    let csv = '';
    if (report.key === 'monthly') {
      csv = 'ماه,درآمد (میلیون تومان)\n' + SALES_CHART.months.map((m, i) => `${m},${SALES_CHART.revenue[i]}`).join('\n');
    } else if (report.key === 'best') {
      csv = 'محصول,تعداد فروش,درآمد\n' + TOP_PRODUCTS.map((p) => `${p.name},${p.sales},${p.revenue}`).join('\n');
    } else if (report.key === 'coupons') {
      csv = 'دسته,سهم (درصد)\n' + SALES_BY_CATEGORY.map((c) => `${c.label},${c.value}`).join('\n');
    } else {
      csv = 'بازدید,سفارش\n' + SALES_CHART.visitors.map((v, i) => `${v},${SALES_CHART.orders[i]}`).join('\n');
    }
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kafshino-report-${report.key}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('گزارش دانلود شد', report.title);
  };

  return (
    <div>
      <PageHeader
        title="گزارش‌ها"
        subtitle="گزارش‌های آماده فروش، موجودی و عملکرد را دانلود یا چاپ کنید"
        actions={
          <div className="flex items-center gap-1 rounded-xl bg-muted/40 p-1">
            {[
              { key: '6', label: '۶ ماه' },
              { key: '12', label: '۱۲ ماه' },
            ].map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                  range === r.key ? 'bg-brand-gradient text-white shadow-glow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((r) => (
          <div key={r.key} className="card-elevated flex flex-col p-5">
            <div className={cn('grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br', r.color)}>
              <r.icon size={22} />
            </div>
            <h3 className="mt-4 font-morabba font-bold text-base text-foreground">{r.title}</h3>
            <p className="mt-1 flex-1 text-sm leading-6 text-muted-foreground">{r.desc}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="xs" variant="secondary" onClick={() => downloadCsv(r)}>
                <ArrowDownToLine size={14} />
                اکسل
              </Button>
              <Button size="xs" variant="secondary" onClick={() => toast.success('گزارش PDF آماده دانلود شد', r.title)}>
                <FileText size={14} />
                PDF
              </Button>
              <Button size="xs" variant="secondary" onClick={() => window.print()}>
                <Printer size={14} />
                چاپ
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="card-elevated mt-5 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-morabba font-bold text-base text-foreground">درآمد ماهانه</h3>
            <p className="mt-1 text-xs text-muted-foreground">روند درآمد فروشگاه بر حسب میلیون تومان</p>
          </div>
          <Badge variant="success" className="px-3 py-1.5">
            <Download size={14} />
            {toFaDigits(SALES_CHART.revenue.reduce((s, v) => s + v, 0))} میلیون تومان در سال
          </Badge>
        </div>
        <div className="relative h-80">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className="card-elevated mt-5 overflow-hidden p-0">
        <div className="border-b border-border/70 p-5">
          <h3 className="font-morabba font-bold text-base text-foreground">پرفروش‌ترین محصولات</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>رتبه</th>
                <th>محصول</th>
                <th>تعداد فروش</th>
                <th>درآمد</th>
                <th className="w-40">سهم</th>
              </tr>
            </thead>
            <tbody>
              {TOP_PRODUCTS.map((p, i) => {
                const max = TOP_PRODUCTS[0].sales;
                return (
                  <tr key={p.name}>
                    <td>
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/10 text-sm font-bold text-brand-600 dark:text-brand-300">
                        {toFaDigits(i + 1)}
                      </span>
                    </td>
                    <td className="font-medium text-foreground">{p.name}</td>
                    <td className="text-foreground">{toFaDigits(p.sales)}</td>
                    <td className="font-morabba font-bold text-foreground">{formatToman(p.revenue)}</td>
                    <td>
                      <div className="h-2.5 overflow-hidden rounded-full bg-muted/60">
                        <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${(p.sales / max) * 100}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
