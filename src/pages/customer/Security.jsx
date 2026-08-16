import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyRound, Lock, ShieldCheck, Monitor, Smartphone, Globe } from 'lucide-react';
import PageHeader from '../../components/customer/PageHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Switch from '../../components/ui/Switch';
import Badge from '../../components/ui/Badge';
import { useToast } from '../../contexts/ToastContext';
import { changePassword } from '../../services/authService';
import { formatFaDate, formatFaTime, toFaDigits } from '../../utils/format';

const RECENT_LOGINS = [
  { id: 1, device: 'مرورگر کروم · ویندوز', location: 'تهران، ایران', ip: '192.168.1.12', date: '2026-07-25T10:30:00', current: true },
  { id: 2, device: 'اپلیکیشن موبایل · اندروید', location: 'تهران، ایران', ip: '10.0.0.8', date: '2026-07-22T18:12:00', current: false },
  { id: 3, device: 'مرورگر سافاری · مک‌اواس', location: 'اصفهان، ایران', ip: '192.168.1.44', date: '2026-07-15T09:45:00', current: false },
  { id: 4, device: 'اپلیکیشن موبایل · iOS', location: 'تهران، ایران', ip: '172.16.4.3', date: '2026-07-02T21:03:00', current: false },
];

export default function Security() {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await changePassword({
        current_password: data.currentPassword,
        password: data.newPassword,
        password_confirmation: data.confirmPassword,
      });
      toast.success('رمز عبور با موفقیت تغییر کرد');
      reset();
    } catch (e) {
      toast.error(e?.message || 'خطا در تغییر رمز عبور');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="امنیت"
        title="امنیت حساب"
        description="رمز عبور خود را تغییر دهید و امنیت ورود به حساب را مدیریت کنید."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="card-elevated p-6">
          <h2 className="mb-1 flex items-center gap-2 font-morabba font-bold text-lg text-foreground">
            <KeyRound size={20} className="text-brand-500" />
            تغییر رمز عبور
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            رمز عبور جدید باید حداقل ۶ کاراکتر و شامل حروف و اعداد باشد.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="رمز عبور فعلی"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              {...register('currentPassword', { required: 'رمز فعلی الزامی است' })}
              error={errors.currentPassword?.message}
            />
            <Input
              label="رمز عبور جدید"
              type="password"
              placeholder="••••••••"
              icon={KeyRound}
              {...register('newPassword', {
                required: 'رمز جدید الزامی است',
                minLength: { value: 6, message: 'رمز جدید باید حداقل ۶ کاراکتر باشد' },
              })}
              error={errors.newPassword?.message}
            />
            <Input
              label="تأیید رمز عبور جدید"
              type="password"
              placeholder="••••••••"
              icon={ShieldCheck}
              {...register('confirmPassword', {
                required: 'تأیید رمز الزامی است',
                validate: (v) => v === newPassword || 'رمز عبور مطابقت ندارد',
              })}
              error={errors.confirmPassword?.message}
            />
            <Button type="submit" loading={saving} icon={KeyRound}>
              به‌روزرسانی رمز عبور
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="card-elevated p-6">
            <h2 className="mb-1 font-morabba font-bold text-lg text-foreground">تأیید دو مرحله‌ای</h2>
            <p className="mb-5 text-sm text-muted-foreground">
              برای افزایش امنیت، پس از ورود با رمز عبور، یک کد تأیید پیامک‌شده دریافت می‌کنید.
            </p>
            <div className="flex items-center justify-between rounded-2xl bg-surface p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
                  <Smartphone size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">تأیید دو مرحله‌ای</p>
                  <p className="text-xs text-muted-foreground">ارسال کد از طریق پیامک</p>
                </div>
              </div>
              <Switch
                checked={twoFactor}
                onChange={() => {
                  setTwoFactor((v) => !v);
                  toast.info(twoFactor ? 'تأیید دو مرحله‌ای غیرفعال شد' : 'تأیید دو مرحله‌ای فعال شد');
                }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-surface p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Monitor size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">هشدار ورود جدید</p>
                  <p className="text-xs text-muted-foreground">پیامک هشدار هنگام ورود از دستگاه جدید</p>
                </div>
              </div>
              <Switch
                checked={smsAlerts}
                onChange={() => setSmsAlerts((v) => !v)}
              />
            </div>
          </div>

          <div className="card-elevated overflow-hidden">
            <div className="border-b border-border/60 px-6 py-4">
              <h2 className="font-morabba font-bold text-lg text-foreground">ورودهای اخیر</h2>
            </div>
            <div className="divide-y divide-border/60">
              {RECENT_LOGINS.map((login) => (
                <div key={login.id} className="flex items-center gap-4 px-6 py-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-muted/50 text-muted-foreground">
                    <Globe size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
                      {login.device}
                      {login.current && <Badge variant="success">جلسه فعلی</Badge>}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {login.location} · IP: {toFaDigits(login.ip)}
                    </p>
                  </div>
                  <div className="shrink-0 text-left text-xs text-muted-foreground">
                    <p>{formatFaDate(login.date)}</p>
                    <p className="mt-0.5">{formatFaTime(login.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
