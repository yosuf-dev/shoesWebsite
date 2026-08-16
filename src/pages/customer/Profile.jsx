import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Calendar, Save, MapPin, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/customer/PageHeader';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { updateProfile } from '../../services/authService';
import { formatFaDate, toFaDigits, formatPhone, isValidEmail, isValidPhone } from '../../utils/format';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      gender: user?.gender || '',
      birthDate: user?.birthDate || '',
    },
  });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const updated = await updateProfile(data);
      updateUser(updated);
      toast.success('اطلاعات حساب به‌روزرسانی شد');
    } catch (e) {
      toast.error(e?.message || 'خطا در ذخیره اطلاعات');
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    { label: 'تاریخ عضویت', value: formatFaDate(user?.joinedAt) },
    { label: 'تعداد سفارش', value: `${toFaDigits(user?.ordersCount ?? 0)} سفارش` },
    { label: 'شهر', value: user?.city || 'تهران' },
    { label: 'وضعیت', value: 'فعال' },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="پروفایل"
        title="اطلاعات حساب"
        description="مشخصات فردی خود را مدیریت کنید؛ این اطلاعات در فاکتورها و ارسال سفارش‌ها استفاده می‌شود."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6">
          <div className="card-elevated overflow-hidden">
            <div className="relative overflow-hidden p-6 text-white">
              <div className="absolute inset-0 bg-brand-gradient opacity-95" />
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
              <div className="relative flex flex-col items-center text-center">
                <span className="grid h-20 w-20 place-items-center rounded-3xl bg-white/20 text-3xl font-bold backdrop-blur">
                  {user?.name?.[0] || 'ک'}
                </span>
                <h3 className="mt-4 font-morabba font-bold text-xl">{user?.name || 'کاربر'}</h3>
                <p className="mt-1 text-sm text-white/85">{user?.email || '—'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border/60">
              {stats.map((s) => (
                <div key={s.label} className="bg-card p-4 text-center">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-elevated p-5">
            <h3 className="mb-4 font-morabba font-bold text-base text-foreground">راه‌های ارتباطی</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail size={16} className="text-brand-500" />
                {user?.email || '—'}
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone size={16} className="text-brand-500" />
                {formatPhone(user?.phone)}
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <MapPin size={16} className="text-brand-500" />
                {user?.city || 'تهران'}
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <ShieldCheck size={16} className="text-emerald-500" />
                حساب تأییدشده
              </li>
            </ul>
          </div>
        </div>

        <div className="card-elevated p-6 xl:col-span-2">
          <h2 className="mb-1 font-morabba font-bold text-lg text-foreground">ویرایش اطلاعات</h2>
          <p className="mb-6 text-sm text-muted-foreground">تغییرات خود را ذخیره کنید.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="نام و نام خانوادگی"
              placeholder="مثال: سارا محمدی"
              icon={User}
              {...register('name', { required: 'نام الزامی است' })}
              error={errors.name?.message}
            />
            <Input
              label="ایمیل"
              type="email"
              placeholder="example@email.com"
              icon={Mail}
              dir="ltr"
              className="[direction:rtl]"
              {...register('email', {
                required: 'ایمیل الزامی است',
                validate: (v) => isValidEmail(v) || 'ایمیل معتبر نیست',
              })}
              error={errors.email?.message}
            />
            <Input
              label="شماره موبایل"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              icon={Phone}
              dir="ltr"
              className="[direction:rtl]"
              {...register('phone', {
                required: 'شماره موبایل الزامی است',
                validate: (v) => isValidPhone(v) || 'شماره موبایل معتبر نیست',
              })}
              error={errors.phone?.message}
            />
            <Select
              label="جنسیت"
              options={[
                { value: '', label: 'انتخاب کنید' },
                { value: 'male', label: 'مرد' },
                { value: 'female', label: 'زن' },
              ]}
              {...register('gender')}
            />
            <Input
              label="تاریخ تولد"
              type="date"
              icon={Calendar}
              dir="ltr"
              className="[direction:rtl]"
              {...register('birthDate')}
            />
            <div className="flex items-end sm:col-span-2">
              <Button type="submit" loading={saving} icon={Save} className="w-full sm:w-auto">
                ذخیره تغییرات
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
