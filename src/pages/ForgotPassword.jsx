import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, MailCheck, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { useToast } from '../contexts/ToastContext';
import { isValidEmail } from '../utils/format';

export default function ForgotPassword() {
  const toast = useToast();
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    setEmail(data.email);
    setSent(true);
    toast.success('ایمیل بازیابی ارسال شد', `لینک بازیابی به ${data.email} ارسال شد.`);
  };

  if (sent) {
    return (
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="container-app relative flex min-h-[calc(100vh-110px)] items-center justify-center py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="card-elevated w-full max-w-md p-8 text-center sm:p-12"
          >
            <div className="relative mx-auto mb-6 grid h-24 w-24 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-500">
              <motion.span
                className="absolute inset-0 rounded-3xl border-2 border-emerald-500/30"
                animate={{ scale: [1, 1.25, 1], opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <MailCheck size={40} strokeWidth={1.8} />
            </div>
            <Badge variant="success" className="mb-3">ایمیل ارسال شد</Badge>
            <h1 className="font-morabba font-bold text-2xl text-foreground">بازیابی رمز عبور</h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              لینک بازیابی رمز عبور به ایمیل <span className="font-medium text-foreground" dir="ltr">{email}</span> ارسال شد.
              لطفاً صندوق ورودی خود را بررسی کنید.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              ایمیل را دریافت نکردید؟{' '}
              <button
                onClick={() => setSent(false)}
                className="font-medium text-brand-600 hover:underline dark:text-brand-300"
              >
                دوباره تلاش کنید
              </button>
            </p>
            <Link to="/login" className="mt-8 block">
              <Button fullWidth variant="secondary" icon={ArrowRight}>بازگشت به ورود</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />

      <div className="container-app relative flex min-h-[calc(100vh-110px)] items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid w-full max-w-4xl items-center gap-10 lg:grid-cols-[1fr_1.1fr]"
        >
          {/* بنر */}
          <div className="relative hidden overflow-hidden rounded-4xl bg-brand-gradient p-10 text-white shadow-lift lg:block">
            <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-accent-500/20 blur-2xl" />
            <div className="relative">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                <KeyRound size={24} />
              </span>
              <h2 className="mt-8 font-morabba font-extrabold text-3xl leading-[1.3]">رمز عبورتان را فراموش کرده‌اید؟</h2>
              <p className="mt-4 text-sm leading-7 text-white/80">
                نگران نباشید! کافی است ایمیل خود را وارد کنید تا لینک بازیابی رمز عبور را برایتان ارسال کنیم.
              </p>
              <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
                <Sparkles size={20} className="shrink-0 text-accent-300" />
                <p className="text-xs leading-6 text-white/80">
                  پس از دریافت لینک، رمز عبور جدید خود را انتخاب کنید و دوباره به سادگی وارد شوید.
                </p>
              </div>
            </div>
          </div>

          {/* فرم */}
          <div className="card-elevated w-full p-8 sm:p-10">
            <Badge variant="brand" className="mb-4">بازیابی رمز عبور</Badge>
            <h1 className="font-morabba font-bold text-2xl text-foreground sm:text-3xl">فراموشی رمز عبور</h1>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              ایمیل حساب خود را وارد کنید؛ لینک بازیابی برایتان ارسال می‌شود.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 space-y-5">
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
              <Button type="submit" fullWidth size="lg" icon={MailCheck}>
                ارسال لینک بازیابی
              </Button>
            </form>

            <Link to="/login" className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand-500">
              <ArrowRight size={16} />
              بازگشت به صفحه ورود
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
