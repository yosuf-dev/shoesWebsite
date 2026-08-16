import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  Eye, EyeOff, Mail, Lock, LogIn, Sparkles, Truck, RotateCcw, ShieldCheck, Headphones,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Checkbox from '../components/ui/Checkbox';
import Badge from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { isValidEmail, toFaDigits, cn } from '../utils/format';

const FEATURES = [
  { icon: Truck, title: 'ارسال سریع', text: 'تحویل ۱ تا ۵ روز کاری' },
  { icon: RotateCcw, title: '۷ روز مرجوعی', text: 'ضمانت بازگشت وجه' },
  { icon: ShieldCheck, title: 'گارانتی اصالت', text: '۶ ماه ضمانت تعویض' },
  { icon: Headphones, title: 'پشتیبانی ۲۴/۷', text: 'پاسخگویی همیشگی' },
];

const DEMO_ACCOUNTS = [
  { role: 'admin', label: 'مدیر فروشگاه', email: 'admin@kafshino.ir', password: 'admin123', desc: 'پنل مدیریت', variant: 'brand' },
  { role: 'customer', label: 'مشتری', email: 'test@kafshino.ir', password: 'test1234', desc: 'پنل کاربری', variant: 'warning' },
];

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.state?.from || new URLSearchParams(location.search).get('redirect') || null;

  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await login({ email: data.email, password: data.password });
      const isAdmin = res?.user?.role === 'admin' || res?.user?.role === 'super-admin';
      const fallback = isAdmin ? '/admin' : '/panel';
      navigate(redirect || fallback, { replace: true });
    } catch (e) {
      toast.error(e?.message || 'ورود ناموفق بود.');
      setError('root', { message: e?.message || 'ایمیل یا رمز عبور اشتباه است.' });
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (acc) => {
    setLoading(true);
    try {
      const res = await login({ email: acc.email, password: acc.password });
      navigate(res?.user?.role === 'admin' || res?.user?.role === 'super-admin' ? '/admin' : '/panel', {
        replace: true,
      });
    } catch (e) {
      toast.error(e?.message || 'ورود ناموفق بود.');
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = () => toast.info('ورود با شبکه‌های اجتماعی به‌زودی فعال می‌شود.');

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />

      <div className="container-app relative grid min-h-[calc(100vh-110px)] items-center gap-12 py-12 lg:grid-cols-2 lg:gap-16">
        {/* فرم */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-md"
        >
          <Badge variant="brand" className="mb-4">خوش آمدید</Badge>
          <h1 className="font-morabba font-bold text-3xl text-foreground sm:text-4xl">ورود به حساب کفشینو</h1>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            برای ادامه خرید، پیگیری سفارش‌ها و دسترسی به پنل کاربری وارد شوید.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
            <Input
              label="ایمیل"
              placeholder="you@example.com"
              icon={Mail}
              dir="ltr"
              error={errors.email?.message}
              {...register('email', {
                required: 'ایمیل الزامی است',
                validate: (v) => isValidEmail(v) || 'فرمت ایمیل معتبر نیست',
              })}
            />

            <div>
              <label className="label-app">رمز عبور</label>
              <div className="relative">
                <Lock size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={cn(
                    'input-app pl-11 pr-11',
                    errors.password && 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
                  )}
                  {...register('password', {
                    required: 'رمز عبور الزامی است',
                    minLength: { value: 4, message: 'رمز عبور باید حداقل ۴ کاراکتر باشد' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPass ? 'پنهان‌کردن رمز' : 'نمایش رمز'}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <Checkbox checked={rememberMe} onChange={setRememberMe} label="مرا به خاطر بسپار" />
              <Link to="/forgot-password" className="text-sm text-brand-600 hover:underline dark:text-brand-300">
                فراموشی رمز عبور؟
              </Link>
            </div>

            {errors.root && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {errors.root.message}
              </p>
            )}

            <Button type="submit" fullWidth size="lg" loading={loading} icon={LogIn}>
              ورود به حساب
            </Button>
          </form>

          {/* حساب‌های تستی */}
          <div className="mt-6 rounded-2xl border border-dashed border-brand-500/40 bg-brand-500/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-500/10 text-brand-500">
                <Sparkles size={15} />
              </span>
              <p className="text-sm font-semibold text-foreground">ورود سریع با حساب‌های تستی</p>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => quickLogin(acc)}
                  disabled={loading}
                  className={cn(
                    'group rounded-xl border bg-surface p-3 text-right transition-all hover:-translate-y-0.5 hover:shadow-soft',
                    acc.role === 'admin'
                      ? 'border-brand-500/30 hover:border-brand-500'
                      : 'border-accent-500/30 hover:border-accent-500'
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">{acc.label}</span>
                    <Badge variant={acc.variant}>{acc.desc}</Badge>
                  </span>
                  <span className="mt-1.5 block text-xs text-muted-foreground" dir="ltr">
                    {acc.email}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground" dir="ltr">
                    رمز: {acc.password}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">یا ادامه با</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={socialLogin} fullWidth>گوگل</Button>
            <Button variant="secondary" onClick={socialLogin} fullWidth>اپل</Button>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            حساب کاربری ندارید؟{' '}
            <Link to="/register" state={{ from: redirect }} className="font-semibold text-brand-600 hover:underline dark:text-brand-300">
              ثبت‌نام رایگان
            </Link>
          </p>
        </motion.div>

        {/* بنر */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="relative hidden overflow-hidden rounded-4xl bg-brand-gradient p-10 text-white shadow-lift lg:block"
        >
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-accent-500/20 blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                <Sparkles size={24} />
              </span>
              <div>
                <p className="font-morabba font-extrabold text-2xl">کفشینو</p>
                <p className="text-xs text-white/70">KAFSHINO</p>
              </div>
            </div>

            <h2 className="mt-12 font-morabba font-extrabold text-4xl leading-[1.3]">قدم‌هایت را<br />لوکس کن</h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/80">
              تجربه‌ای بی‌نظیر از خرید کفش اصل با ضمانت اصالت، بسته‌بندی لوکس و ارسال سریع به سراسر کشور.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <f.icon size={20} className="mb-3 text-accent-300" />
                  <p className="text-sm font-semibold">{f.title}</p>
                  <p className="mt-0.5 text-xs text-white/70">{f.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-between rounded-2xl bg-black/20 px-5 py-4 backdrop-blur">
              <div className="text-center">
                <p className="font-morabba font-extrabold text-2xl">{toFaDigits('۱۲۰+')}</p>
                <p className="text-xs text-white/70">برند معتبر</p>
              </div>
              <div className="h-10 w-px bg-white/15" />
              <div className="text-center">
                <p className="font-morabba font-extrabold text-2xl">{toFaDigits('۲۴۰+')}</p>
                <p className="text-xs text-white/70">محصول منتخب</p>
              </div>
              <div className="h-10 w-px bg-white/15" />
              <div className="text-center">
                <p className="font-morabba font-extrabold text-2xl">{toFaDigits('۱۰۰٪')}</p>
                <p className="text-xs text-white/70">گارانتی اصالت</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
