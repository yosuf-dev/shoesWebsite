import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserPlus, Search, ShieldCheck } from 'lucide-react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { PageHeader } from '../../layouts/AdminLayout';
import { useToast } from '../../contexts/ToastContext';
import { USERS, ROLES } from '../../data/mockData';
import { toFaDigits, formatFaDate, formatPhone } from '../../utils/format';

const ROLE_BADGE = {
  'super-admin': 'danger',
  admin: 'brand',
  'sales-manager': 'accent',
  customer: 'muted',
};

const ROLE_LABEL = Object.fromEntries(ROLES.map((r) => [r.slug, r.name]));

export default function Users() {
  const toast = useToast();
  const [rows, setRows] = useState(USERS);
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: '', email: '', phone: '', role: 'customer' } });

  const filtered = rows.filter(
    (u) =>
      !search.trim() ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const changeRole = (id, role) => {
    setRows((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    toast.success('نقش کاربر تغییر کرد');
  };

  const toggleStatus = (id) => {
    setRows((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u))
    );
    toast.success('وضعیت کاربر به‌روزرسانی شد');
  };

  const onSubmit = (data) => {
    setRows((prev) => [
      {
        id: Math.max(...prev.map((u) => u.id)) + 1,
        ...data,
        status: 'active',
        joinedAt: new Date().toISOString().slice(0, 10),
        city: 'تهران',
        ordersCount: 0,
      },
      ...prev,
    ]);
    setAddOpen(false);
    reset();
    toast.success('کاربر جدید اضافه شد', data.name);
  };

  return (
    <div>
      <PageHeader
        title="کاربران"
        subtitle="مدیریت کاربران سیستم و سطح دسترسی آن‌ها"
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <UserPlus size={18} />
            افزودن کاربر
          </Button>
        }
      />

      <div className="card-elevated p-5">
        <Input
          className="w-full sm:w-72"
          icon={Search}
          placeholder="جستجوی کاربر..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mt-4 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>کاربر</th>
                <th>ایمیل</th>
                <th>موبایل</th>
                <th>شهر</th>
                <th>نقش</th>
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
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-gradient font-morabba font-bold text-white">
                        {u.name.slice(0, 1)}
                      </span>
                      <span className="font-medium text-foreground">{u.name}</span>
                    </div>
                  </td>
                  <td className="text-muted-foreground">{u.email}</td>
                  <td className="text-muted-foreground">{formatPhone(u.phone)}</td>
                  <td className="text-foreground">{u.city}</td>
                  <td>
                    <Select
                      className="w-40"
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      options={ROLES.map((r) => ({ value: r.slug, label: r.name }))}
                    />
                  </td>
                  <td className="text-muted-foreground">{formatFaDate(u.joinedAt)}</td>
                  <td>
                    <Badge variant={u.status === 'active' ? 'success' : 'danger'}>
                      {u.status === 'active' ? 'فعال' : 'مسدود'}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <Badge variant={ROLE_BADGE[u.role] || 'muted'} className="hidden lg:inline-flex">
                        <ShieldCheck size={13} />
                        {ROLE_LABEL[u.role] || u.role}
                      </Badge>
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className={`h-9 rounded-xl px-3 text-xs font-semibold transition-colors ${
                          u.status === 'active'
                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                        }`}
                      >
                        {u.status === 'active' ? 'مسدودسازی' : 'فعال‌سازی'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">کاربری یافت نشد.</p>
          )}
        </div>
      </div>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="افزودن کاربر جدید"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>
              انصراف
            </Button>
            <Button type="submit" form="add-user-form">
              افزودن کاربر
            </Button>
          </>
        }
      >
        <form id="add-user-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="نام و نام خانوادگی"
            placeholder="مثلاً: مریم حسینی"
            error={errors.name && 'نام الزامی است'}
            {...register('name', { required: true })}
          />
          <Input
            label="ایمیل"
            type="email"
            placeholder="user@example.com"
            error={errors.email && 'ایمیل معتبر وارد کنید'}
            {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
          />
          <Input
            label="موبایل"
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            error={errors.phone && 'شماره موبایل الزامی است'}
            {...register('phone', { required: true })}
          />
          <Select
            label="نقش"
            options={ROLES.map((r) => ({ value: r.slug, label: r.name }))}
            {...register('role')}
          />
          <p className="text-xs leading-6 text-muted-foreground">
            برای کاربر جدید به‌صورت پیش‌فرض ایمیل فعال‌سازی ارسال می‌شود.
          </p>
        </form>
      </Modal>
    </div>
  );
}
