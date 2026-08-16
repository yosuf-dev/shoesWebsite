import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search, Pencil, Trash2, Tag } from 'lucide-react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Switch from '../../components/ui/Switch';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { PageHeader } from '../../layouts/AdminLayout';
import { useToast } from '../../contexts/ToastContext';
import { COUPONS } from '../../data/mockData';
import { toFaDigits, formatToman, formatFaDate, formatPercent } from '../../utils/format';

const today = new Date().toISOString().slice(0, 10);

const isActive = (c) => c.usedCount < c.usageLimit && c.expiresAt >= today;

export default function Coupons() {
  const toast = useToast();
  const [rows, setRows] = useState(COUPONS.map((c) => ({ ...c, active: isActive(c) })));
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '', code: '', type: 'percentage', value: '', minOrder: '', expiresAt: '', usageLimit: '',
    },
  });

  const filtered = useMemo(
    () =>
      rows.filter(
        (c) =>
          !search.trim() ||
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          c.title.includes(search)
      ),
    [rows, search]
  );

  const openAdd = () => {
    setEditTarget(null);
    reset({
      title: '', code: '', type: 'percentage', value: '', minOrder: '', expiresAt: '', usageLimit: '',
    });
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditTarget(c);
    reset({
      title: c.title,
      code: c.code,
      type: c.type,
      value: c.value,
      minOrder: c.minOrder,
      expiresAt: c.expiresAt,
      usageLimit: c.usageLimit,
    });
    setModalOpen(true);
  };

  const onSubmit = (data) => {
    if (editTarget) {
      setRows((prev) => prev.map((c) => (c.id === editTarget.id ? { ...c, ...data, value: Number(data.value), minOrder: Number(data.minOrder || 0), usageLimit: Number(data.usageLimit || 0) } : c)));
      toast.success('کوپن ویرایش شد', data.code);
    } else {
      setRows((prev) => [
        { id: Math.max(...prev.map((c) => c.id)) + 1, ...data, value: Number(data.value), minOrder: Number(data.minOrder || 0), usageLimit: Number(data.usageLimit || 0), usedCount: 0, active: true },
        ...prev,
      ]);
      toast.success('کوپن جدید ایجاد شد', data.code);
    }
    setModalOpen(false);
  };

  const toggleActive = (id) => {
    setRows((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    toast.success('وضعیت کوپن تغییر کرد');
  };

  const remove = () => {
    setRows((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success('کوپن حذف شد', deleteTarget.code);
  };

  const valueLabel = (c) => (c.type === 'percentage' ? formatPercent(c.value) : formatToman(c.value));

  return (
    <div>
      <PageHeader
        title="کوپن‌های تخفیف"
        subtitle="مدیریت کدهای تخفیف و کمپین‌های فروش"
        actions={
          <Button onClick={openAdd}>
            <Plus size={18} />
            افزودن کوپن
          </Button>
        }
      />

      <div className="card-elevated p-5">
        <Input
          className="w-full sm:w-72"
          icon={Search}
          placeholder="جستجوی کد یا عنوان کوپن..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mt-4 overflow-x-auto">
          {filtered.length === 0 ? (
            <EmptyState icon="search" title="کوپنی یافت نشد" />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>کوپن</th>
                  <th>نوع</th>
                  <th>مقدار</th>
                  <th>حداقل سفارش</th>
                  <th>سقف استفاده</th>
                  <th>استفاده‌شده</th>
                  <th>انقضا</th>
                  <th>وضعیت</th>
                  <th className="text-left">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const active = c.active;
                  return (
                    <tr key={c.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-gradient text-white">
                            <Tag size={17} />
                          </span>
                          <div>
                            <p className="font-morabba font-bold text-foreground">{c.code}</p>
                            <p className="text-xs text-muted-foreground">{c.title}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge variant={c.type === 'percentage' ? 'brand' : 'info'}>
                          {c.type === 'percentage' ? 'درصدی' : 'ثابت'}
                        </Badge>
                      </td>
                      <td className="font-morabba font-bold text-foreground">{valueLabel(c)}</td>
                      <td className="text-muted-foreground">{c.minOrder ? formatToman(c.minOrder) : '—'}</td>
                      <td className="text-foreground">{toFaDigits(c.usageLimit)}</td>
                      <td className="text-foreground">
                        {toFaDigits(c.usedCount)}
                        <span className="ms-1 text-xs text-muted-foreground">
                          ({toFaDigits(Math.round((c.usedCount / c.usageLimit) * 100))}٪)
                        </span>
                      </td>
                      <td className="text-muted-foreground">{formatFaDate(c.expiresAt)}</td>
                      <td>
                        <Switch checked={active} onChange={() => toggleActive(c.id)} />
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(c)}
                            className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-brand-500/10 hover:text-brand-600"
                            aria-label="ویرایش"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(c)}
                            className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                            aria-label="حذف"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'ویرایش کوپن' : 'افزودن کوپن'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              انصراف
            </Button>
            <Button type="submit" form="coupon-form">
              {editTarget ? 'ذخیره تغییرات' : 'ایجاد کوپن'}
            </Button>
          </>
        }
      >
        <form id="coupon-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="عنوان کوپن" placeholder="مثلاً: تخفیف زمستانه" {...register('title', { required: true })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="کد کوپن" placeholder="WINTER20" {...register('code', { required: true })} />
            <Select
              label="نوع تخفیف"
              options={[
                { value: 'percentage', label: 'درصدی' },
                { value: 'fixed', label: 'مبلغ ثابت' },
              ]}
              {...register('type')}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="مقدار تخفیف"
              type="number"
              placeholder="مثلاً ۲۵"
              {...register('value', { required: true })}
            />
            <Input label="حداقل مبلغ سفارش" type="number" placeholder="۰" {...register('minOrder')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="تاریخ انقضا" type="date" {...register('expiresAt', { required: true })} />
            <Input label="سقف تعداد استفاده" type="number" placeholder="مثلاً ۵۰۰" {...register('usageLimit', { required: true })} />
          </div>
          {!editTarget && (
            <p className="text-xs text-muted-foreground">
              کوپن به‌صورت پیش‌فرض فعال ایجاد می‌شود و «استفاده‌شده» آن صفر است.
            </p>
          )}
        </form>
      </Modal>

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="حذف کوپن"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              انصراف
            </Button>
            <Button variant="danger" onClick={remove}>
              حذف
            </Button>
          </>
        }
      >
        <p className="text-sm leading-7 text-muted-foreground">
          آیا از حذف کوپن «{deleteTarget?.code}» مطمئن هستید؟
        </p>
      </Modal>
    </div>
  );
}
