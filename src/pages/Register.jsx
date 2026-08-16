import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  Eye, EyeOff, Mail, Lock, LogIn, Sparkles, Truck, RotateCcw, ShieldCheck, Headphones,
  User, Phone, Gift,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
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

const toEnDigits = (v) => String(v || '').replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));

export default function Register() {
  const { register: registerUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.state?.from || new URLSearchParams(location.search).get('redirect') || '/panel';

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, setError } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser({ name: data.name, email: data.email, phone: data.phone, password: data.password });
      toast.success('حساب کاربری شما ساخته شد', `خوش آمدید، ${data.name}`);
      navigate(redirect, { replace: true });
    } catch (e) {
      toast.error(e?.message || 'ثبت‌نام ناموفق بود.');
      setError('root', { message: e?.message || 'مشکلی در ثبت‌نام پیش آمد، دوباره تلاش کنید.' });
    } finally {
      setLoading(false);
    }
  };

  const socialRegister = () => toast.info('ثبت‌نام با شبکه‌های اجتماعی به‌زودی فعال می‌شود.');

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
          <Badge variant="success" className="mb-4">عضویت رایگان</Badge>
          <h1 className="font-morabba font-bold text-3xl text-foreground sm:text-4xl">ساخت حساب کاربری</h1>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            با ثبت‌نام در کفشینو از تخفیف‌های ویژه، پیگیری آنی سفارش‌ها و تاریخچه خرید بهره‌مند شوید.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="نام و نام خانوادگی"
                placeholder="مثال: سارا محمدی"
                icon={User}
                error={errors.name?.message}
                {...register('name', {
                  required: 'نام الزامی است',
                  minLength: { value: 3, message: 'نام باید حداقل ۳ حرف باشد' },
                })}
              />
              <Input
                label="شماره موبایل"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                icon={Phone}
                dir="ltr"
                error={errors.phone?.message}
                {...register('phone', {
                  required: 'شماره موبایل الزامی است',
                  validate: (v) => /^09\d{9}$/.test(toEnDigits(v)) || 'شماره موبایل معتبر نیست',
                })}
              />
            </div>

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

            <div className="grid gap-4 sm:grid-cols-2">
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

              <div>
                <label className="label-app">تکرار رمز عبور</label>
                <div className="relative">
                  <Lock size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={cn(
                      'input-app pl-11 pr-11',
                      errors.confirm && 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
                    )}
                    {...register('confirm', {
                      required: 'تکرار رمز عبور الزامی است',
                      validate: (v) => v === password || 'رمزهای عبور یکسان نیستند',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showConfirm ? 'پنهان‌کردن رمز' : 'نمایش رمز'}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirm && <p className="mt-1.5 text-xs text-red-500">{errors.confirm.message}</p>}
              </div>
            </div>

            {errors.root && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {errors.root.message}
              </p>
            )}

            <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-600 dark:text-emerald-300">
              <Gift size={16} className="shrink-0" />
              هدیه خوش‌آمدگویی: با اولین خرید خود {toFaDigits(10)}٪ تخفیف بگیرید. (کد: WELCOME10)
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading} icon={LogIn}>
              ساخت حساب کاربری
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">یا ثبت‌نام با</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={socialRegister} fullWidth>گوگل</Button>
            <Button variant="secondary" onClick={socialRegister} fullWidth>اپل</Button>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            قبلاً ثبت‌نام کرده‌اید؟{' '}
            <Link to="/login" state={{ from: redirect }} className="font-semibold text-brand-600 hover:underline dark:text-brand-300">
              ورود به حساب
            </Link>
          </p>
        </motion.div>

        {/* بنر */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="relative hidden overflow-hidden rounded-4xl bg-accent-gradient p-10 text-white shadow-lift lg:block"
        >
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-brand-500/20 blur-2xl" />

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

            <h2 className="mt-12 font-morabba font-extrabold text-4xl leading-[1.3]">به خانواده کفشینو<br />بپیوندید</h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/80">
              با ساخت حساب کاربری، از تخفیف‌های انحصاری، خبرهای جدیدترین کالکشن‌ها و خدمات ویژه مشتریان بهره‌مند شوید.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <f.icon size={20} className="mb-3 text-brand-200" />
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
