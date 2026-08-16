import { useMemo, useState } from 'react';
import { Search, Eye, Ban, UserCheck, ShieldCheck, Mail, Phone, MapPin, ShoppingBag, Calendar } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { PageHeader } from '../../layouts/AdminLayout';
import { useToast } from '../../contexts/ToastContext';
import { USERS } from '../../data/mockData';
import { toFaDigits, formatFaDate, formatPhone } from '../../utils/format';

export default function Customers() {
  const toast = useToast();
  const [rows, setRows] = useState(USERS);
  const [search, setSearch] = useState('');
  const [viewTarget, setViewTarget] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(
      (u) => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q)
    );
  }, [rows, search]);

  const toggleStatus = (u) => {
    const next = u.status === 'banned' ? 'active' : 'banned';
    setRows((prev) => prev.map((x) => (x.id === u.id ? { ...x, status: next } : x)));
    if (next === 'banned') toast.success('حساب کاربر مسدود شد', u.name);
    else toast.success('حساب کاربر فعال شد', u.name);
  };

  const stats = [
    { label: 'کل مشتریان', value: rows.length },
    { label: 'مشتریان فعال', value: rows.filter((u) => u.status === 'active').length },
    { label: 'مسدودشده‌ها', value: rows.filter((u) => u.status === 'banned').length },
    { label: 'مجموع سفارش‌ها', value: rows.reduce((s, u) => s + u.ordersCount, 0) },
  ];

  return (
    <div>
      <PageHeader title="مشتریان" subtitle="مدیریت حساب‌ها و وضعیت مشتریان فروشگاه" />

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-elevated flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="mt-1 font-morabba font-bold text-xl text-foreground">{toFaDigits(s.value)}</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-500/10 text-brand-500">
              <ShoppingBag size={18} />
            </span>
          </div>
        ))}
      </div>

      <div className="card-elevated p-5">
        <Input
          className="w-full sm:w-72"
          icon={Search}
          placeholder="جستجوی نام، ایمیل یا موبایل..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mt-4 overflow-x-auto">
          {filtered.length === 0 ? (
            <EmptyState icon="search" title="مشتری‌ای یافت نشد" />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>مشتری</th>
                  <th>ایمیل</th>
                  <th>موبایل</th>
                  <th>شهر</th>
                  <th>سفارش‌ها</th>
                  <th>تاریخ عضویت</th>
                  <th>وضعیت</th>
                  <th className="text-left">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span
                          className={`grid h-10 w-10 place-items-center rounded-xl font-morabba font-bold text-white ${
                            u.status === 'banned' ? 'bg-muted text-muted-foreground' : 'bg-brand-gradient'
                          }`}
                        >
                          {u.name.slice(0, 1)}
                        </span>
                        <span className="font-medium text-foreground">{u.name}</span>
                      </div>
                    </td>
                    <td className="text-muted-foreground">{u.email}</td>
                    <td className="text-muted-foreground">{formatPhone(u.phone)}</td>
                    <td className="text-foreground">{u.city}</td>
                    <td className="text-foreground">{toFaDigits(u.ordersCount)}</td>
                    <td className="text-muted-foreground">{formatFaDate(u.joinedAt)}</td>
                    <td>
                      <Badge variant={u.status === 'active' ? 'success' : 'danger'}>
                        {u.status === 'active' ? 'فعال' : 'مسدود'}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewTarget(u)}
                          className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-brand-500/10 hover:text-brand-600"
                          aria-label="مشاهده"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => toggleStatus(u)}
                          className={`grid h-9 w-9 place-items-center rounded-xl transition-colors ${
                            u.status === 'banned'
                              ? 'text-emerald-500 hover:bg-emerald-500/10'
                              : 'text-red-500 hover:bg-red-500/10'
                          }`}
                          aria-label={u.status === 'banned' ? 'فعال‌سازی' : 'مسدودسازی'}
                        >
                          {u.status === 'banned' ? <UserCheck size={16} /> : <Ban size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        open={viewTarget !== null}
        onClose={() => setViewTarget(null)}
        title="پروفایل مشتری"
        footer={
          <Button variant="secondary" onClick={() => setViewTarget(null)}>
            بستن
          </Button>
        }
      >
        {viewTarget && (
          <div>
            <div className="flex items-center gap-4">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-gradient font-morabba text-2xl font-bold text-white">
                {viewTarget.name.slice(0, 1)}
              </span>
              <div>
                <p className="font-morabba font-bold text-lg text-foreground">{viewTarget.name}</p>
                <p className="text-sm text-muted-foreground">{viewTarget.email}</p>
              </div>
              <Badge variant={viewTarget.status === 'active' ? 'success' : 'danger'} className="ms-auto">
                {viewTarget.status === 'active' ? 'فعال' : 'مسدود'}
              </Badge>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl bg-muted/30 p-3.5 text-sm">
                <Mail size={17} className="text-brand-500" />
                <span className="min-w-0 truncate text-foreground">{viewTarget.email}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-muted/30 p-3.5 text-sm">
                <Phone size={17} className="text-brand-500" />
                <span className="text-foreground">{formatPhone(viewTarget.phone)}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-muted/30 p-3.5 text-sm">
                <MapPin size={17} className="text-brand-500" />
                <span className="text-foreground">{viewTarget.city}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-muted/30 p-3.5 text-sm">
                <Calendar size={17} className="text-brand-500" />
                <span className="text-foreground">{formatFaDate(viewTarget.joinedAt)}</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-brand-500/10 p-4 text-center">
                <p className="text-2xl font-morabba font-bold text-brand-600 dark:text-brand-300">
                  {toFaDigits(viewTarget.ordersCount)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">سفارش</p>
              </div>
              <div className="rounded-2xl bg-emerald-500/10 p-4 text-center">
                <p className="text-2xl font-morabba font-bold text-emerald-600 dark:text-emerald-300">
                  {toFaDigits(viewTarget.ordersCount * 2500000)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">تومان خرید</p>
              </div>
              <div className="rounded-2xl bg-accent-500/10 p-4 text-center">
                <p className="text-2xl font-morabba font-bold text-accent-600 dark:text-accent-300">
                  {toFaDigits(viewTarget.ordersCount * 1)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">امتیاز</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Badge variant="info">
                <ShieldCheck size={13} />
                خریدار تاییدشده
              </Badge>
              <Badge variant="muted">عضویت از {formatFaDate(viewTarget.joinedAt)}</Badge>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
