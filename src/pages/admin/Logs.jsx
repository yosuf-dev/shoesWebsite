import { useMemo, useState } from 'react';
import { Search, LogIn, LogOut, PlusCircle, Pencil, Trash2, Settings, ScrollText } from 'lucide-react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import { PageHeader } from '../../layouts/AdminLayout';
import { cn, toFaDigits, formatFaDate, formatFaTime } from '../../utils/format';

const LOGS = [
  { id: 1, time: '2026-07-25T12:03:00', user: 'مدیر کل', action: 'login', detail: 'ورود به پنل مدیریت', ip: '185.20.31.4', status: 'success' },
  { id: 2, time: '2026-07-25T11:58:00', user: 'ادمین فروش', action: 'logout', detail: 'خروج از پنل', ip: '185.20.31.9', status: 'info' },
  { id: 3, time: '2026-07-25T11:40:00', user: 'مدیر کل', action: 'create', detail: 'افزودن محصول «پگاسوس ۴۱»', ip: '185.20.31.4', status: 'success' },
  { id: 4, time: '2026-07-25T10:02:00', user: 'ادمین فروش', action: 'create', detail: 'ایجاد کوپن SUMMER25', ip: '185.20.31.9', status: 'success' },
  { id: 5, time: '2026-07-25T09:45:00', user: 'سیستم', action: 'update', detail: 'به‌روزرسانی خودکار قیمت‌ها', ip: '127.0.0.1', status: 'warning' },
  { id: 6, time: '2026-07-24T16:33:00', user: 'سیستم', action: 'update', detail: 'تغییر وضعیت سفارش ORD-1003', ip: '127.0.0.1', status: 'info' },
  { id: 7, time: '2026-07-24T14:10:00', user: 'مدیر کل', action: 'update', detail: 'به‌روزرسانی موجودی «اولترابوست ۲۵»', ip: '185.20.31.4', status: 'success' },
  { id: 8, time: '2026-07-24T11:22:00', user: 'ادمین فروش', action: 'delete', detail: 'حذف نظر کاربر به دلیل نامناسب', ip: '185.20.31.9', status: 'danger' },
  { id: 9, time: '2026-07-23T20:05:00', user: 'مدیر کل', action: 'settings', detail: 'تغییر تنظیمات امنیتی', ip: '185.20.31.4', status: 'warning' },
  { id: 10, time: '2026-07-23T13:20:00', user: 'مدیر کل', action: 'create', detail: 'افزودن بنر کمپین تابستانه', ip: '185.20.31.4', status: 'success' },
  { id: 11, time: '2026-07-23T09:00:00', user: 'سیستم', action: 'login', detail: 'ورود خودکار سرویس همگام‌سازی', ip: '127.0.0.1', status: 'info' },
  { id: 12, time: '2026-07-22T18:40:00', user: 'ادمین فروش', action: 'delete', detail: 'حذف محصول منسوخ', ip: '185.20.31.9', status: 'danger' },
];

const ACTION_META = {
  login: { label: 'ورود', icon: LogIn, variant: 'success' },
  logout: { label: 'خروج', icon: LogOut, variant: 'muted' },
  create: { label: 'افزودن', icon: PlusCircle, variant: 'brand' },
  update: { label: 'ویرایش', icon: Pencil, variant: 'info' },
  delete: { label: 'حذف', icon: Trash2, variant: 'danger' },
  settings: { label: 'تنظیمات', icon: Settings, variant: 'warning' },
};

const PER_PAGE = 8;

export default function Logs() {
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return LOGS.filter((l) => {
      const matchQ = !q || l.user.toLowerCase().includes(q) || l.detail.includes(q) || l.ip.includes(q);
      const matchAction = !action || l.action === action;
      return matchQ && matchAction;
    });
  }, [search, action]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <div>
      <PageHeader
        title="لاگ‌های سیستم"
        subtitle="ثبت و بررسی تمام رویدادهای امنیتی و عملیات انجام‌شده در پنل"
        actions={
          <Badge variant="muted" className="px-3 py-1.5">
            <ScrollText size={14} />
            {toFaDigits(LOGS.length)} رکورد لاگ
          </Badge>
        }
      />

      <div className="card-elevated p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            className="w-full sm:w-64"
            icon={Search}
            placeholder="جستجوی کاربر، جزئیات یا آی‌پی..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <Select
            className="w-full sm:w-44"
            placeholder="همه عملیات‌ها"
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setPage(1);
            }}
            options={Object.entries(ACTION_META).map(([key, m]) => ({ value: key, label: m.label }))}
          />
        </div>

        <div className="mt-4 overflow-x-auto">
          {pageRows.length === 0 ? (
            <EmptyState icon="search" title="لاگی یافت نشد" />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>زمان</th>
                  <th>کاربر</th>
                  <th>عملیات</th>
                  <th>جزئیات</th>
                  <th>آی‌پی</th>
                  <th>وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((l) => {
                  const meta = ACTION_META[l.action] || ACTION_META.update;
                  const Icon = meta.icon;
                  return (
                    <tr key={l.id}>
                      <td className="text-muted-foreground">
                        <p>{formatFaDate(l.time, true)}</p>
                        <p className="text-[11px] text-muted-foreground/70">{formatFaTime(l.time)}</p>
                      </td>
                      <td className="font-medium text-foreground">{l.user}</td>
                      <td>
                        <Badge variant={meta.variant}>
                          <Icon size={13} />
                          {meta.label}
                        </Badge>
                      </td>
                      <td className="text-muted-foreground">{l.detail}</td>
                      <td>
                        <span className="rounded-lg bg-muted/50 px-2 py-1 font-mono text-xs text-muted-foreground" dir="ltr">
                          {l.ip}
                        </span>
                      </td>
                      <td>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                            l.status === 'success' && 'bg-emerald-500/10 text-emerald-500',
                            l.status === 'danger' && 'bg-red-500/10 text-red-500',
                            l.status === 'warning' && 'bg-accent-500/15 text-accent-600',
                            l.status === 'info' && 'bg-sky-500/10 text-sky-500'
                          )}
                        >
                          <span
                            className={cn(
                              'h-1.5 w-1.5 rounded-full bg-current',
                              l.status === 'danger' && 'animate-pulse'
                            )}
                          />
                          {l.status === 'success' ? 'موفق' : l.status === 'danger' ? 'خطا' : l.status === 'warning' ? 'هشدار' : 'اطلاع'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            نمایش {toFaDigits((safePage - 1) * PER_PAGE + 1)} تا {toFaDigits(Math.min(safePage * PER_PAGE, filtered.length))} از {toFaDigits(filtered.length)} لاگ
          </p>
          <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}
