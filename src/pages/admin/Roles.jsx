import { useState } from 'react';
import { ShieldCheck, Pencil, Check, Users } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Checkbox from '../../components/ui/Checkbox';
import Modal from '../../components/ui/Modal';
import { PageHeader } from '../../layouts/AdminLayout';
import { useToast } from '../../contexts/ToastContext';
import { ROLES } from '../../data/mockData';
import { cn, toFaDigits } from '../../utils/format';

const PERMISSION_GROUPS = [
  { key: 'products', label: 'محصولات', items: ['مشاهده', 'افزودن', 'ویرایش', 'حذف'] },
  { key: 'orders', label: 'سفارش‌ها', items: ['مشاهده', 'تغییر وضعیت', 'لغو'] },
  { key: 'customers', label: 'مشتریان', items: ['مشاهده', 'مسدودسازی'] },
  { key: 'coupons', label: 'کوپن‌ها', items: ['مشاهده', 'افزودن', 'ویرایش'] },
  { key: 'inventory', label: 'موجودی', items: ['مشاهده', 'ویرایش'] },
  { key: 'reports', label: 'گزارش‌ها', items: ['مشاهده', 'دانلود'] },
];

const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((g) => g.items.map((it) => `${g.key}.${it}`));

const ROLE_COLORS = {
  'super-admin': { badge: 'danger', dot: 'bg-red-500' },
  admin: { badge: 'brand', dot: 'bg-brand-500' },
  'sales-manager': { badge: 'accent', dot: 'bg-accent-500' },
  customer: { badge: 'muted', dot: 'bg-slate-400' },
};

export default function Roles() {
  const toast = useToast();
  const [roles, setRoles] = useState(ROLES);
  const [editTarget, setEditTarget] = useState(null);
  const [permissions, setPermissions] = useState([]);

  const openEdit = (role) => {
    setEditTarget(role);
    setPermissions(role.permissions.includes('all') ? [...ALL_PERMISSIONS] : role.permissions);
  };

  const togglePerm = (perm) =>
    setPermissions((prev) => (prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]));

  const save = () => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === editTarget.id
          ? { ...r, permissions: permissions.length === ALL_PERMISSIONS.length ? ['all'] : permissions }
          : r
      )
    );
    toast.success('دسترسی‌های نقش به‌روزرسانی شد', editTarget.name);
    setEditTarget(null);
  };

  const permsFor = (role) =>
    role.permissions.includes('all') ? ALL_PERMISSIONS : role.permissions;

  return (
    <div>
      <PageHeader
        title="نقش‌ها و دسترسی‌ها"
        subtitle="تعریف نقش‌ها و کنترل سطح دسترسی هر نقش به بخش‌های پنل"
        actions={
          <Badge variant="info" className="px-3 py-1.5">
            <ShieldCheck size={14} />
            {toFaDigits(roles.length)} نقش تعریف‌شده
          </Badge>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {roles.map((role) => {
          const colors = ROLE_COLORS[role.slug] || ROLE_COLORS.customer;
          const all = role.permissions.includes('all');
          const permCount = all ? ALL_PERMISSIONS.length : role.permissions.length;
          const pct = Math.round((permCount / ALL_PERMISSIONS.length) * 100);
          return (
            <div key={role.id} className="card-elevated flex flex-col p-5">
              <div className="flex items-start justify-between">
                <span className={cn('grid h-11 w-11 place-items-center rounded-2xl', all ? 'bg-accent-gradient text-white' : 'bg-brand-500/10 text-brand-500')}>
                  <ShieldCheck size={20} />
                </span>
                <Badge variant={colors.badge}>{all ? 'دسترسی کامل' : role.slug === 'customer' ? 'نقش پایه' : 'نقش مدیریتی'}</Badge>
              </div>
              <h3 className="mt-4 font-morabba font-bold text-lg text-foreground">{role.name}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users size={14} />
                {toFaDigits(role.users)} کاربر فعال
              </p>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">سطح دسترسی</span>
                  <span className="font-semibold text-foreground">{toFaDigits(pct)}٪</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted/60">
                  <div
                    className={cn('h-full rounded-full', all ? 'bg-accent-gradient' : 'bg-brand-gradient')}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {role.permissions.slice(0, 4).map((p) => (
                  <span key={p} className="rounded-full bg-muted/50 px-2.5 py-1 text-[11px] text-muted-foreground">
                    {p === 'all' ? 'همه بخش‌ها' : p}
                  </span>
                ))}
                {permCount > 4 && (
                  <span className="rounded-full bg-muted/50 px-2.5 py-1 text-[11px] text-muted-foreground">
                    +{toFaDigits(permCount - 4)}
                  </span>
                )}
              </div>

              {role.slug !== 'super-admin' && (
                <Button variant="secondary" size="sm" className="mt-5" onClick={() => openEdit(role)}>
                  <Pencil size={15} />
                  ویرایش دسترسی‌ها
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <Modal
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        title={`دسترسی‌های نقش «${editTarget?.name}»`}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditTarget(null)}>
              انصراف
            </Button>
            <Button onClick={save}>
              <Check size={17} />
              ذخیره دسترسی‌ها
            </Button>
          </>
        }
      >
        {editTarget && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PERMISSION_GROUPS.map((group) => {
              const groupPerms = group.items.map((it) => `${group.key}.${it}`);
              const allChecked = groupPerms.every((p) => permissions.includes(p));
              const someChecked = groupPerms.some((p) => permissions.includes(p));
              return (
                <div key={group.key} className="rounded-2xl border border-border/70 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{group.label}</p>
                    <Checkbox
                      checked={allChecked}
                      onChange={(checked) =>
                        setPermissions((prev) => {
                          const next = new Set(prev);
                          if (checked) groupPerms.forEach((p) => next.add(p));
                          else groupPerms.forEach((p) => next.delete(p));
                          return [...next];
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    {group.items.map((item) => {
                      const perm = `${group.key}.${item}`;
                      return (
                        <Checkbox
                          key={perm}
                          label={item}
                          checked={permissions.includes(perm)}
                          onChange={() => togglePerm(perm)}
                        />
                      );
                    })}
                  </div>
                  {someChecked && !allChecked && (
                    <p className="mt-2 text-[11px] text-muted-foreground">دسترسی انتخابی است.</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}
