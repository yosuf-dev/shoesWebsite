import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HelpCircle, MessageSquare, Phone, Mail, Headphones } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb';
import SectionHeading from '../components/ui/SectionHeading';
import Accordion from '../components/ui/Accordion';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../contexts/ToastContext';
import { FAQS } from '../data/mockData';
import { isValidEmail, toFaDigits } from '../utils/format';

export default function FaqPage() {
  const toast = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    toast.success('پیام شما ارسال شد', 'کارشناسان ما به‌زودی با شما تماس می‌گیرند.');
    reset({ name: '', email: '', message: '' });
  };

  return (
    <div className="container-app py-8 lg:py-12">
      <Breadcrumb items={['سوالات متداول']} className="mb-6" />

      <SectionHeading
        eyebrow="پشتیبانی"
        title="سوالات متداول"
        subtitle="پاسخ پرسش‌های پرتکرار شما درباره خرید، ارسال، پرداخت و گارانتی کالاها را اینجا بیابید."
      />

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-5 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
              <HelpCircle size={18} />
            </span>
            <h2 className="font-morabba font-bold text-lg text-foreground">پرسش‌های پرتکرار</h2>
          </div>
          <Accordion items={FAQS} defaultOpen={0} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <div className="card-elevated p-6 sm:p-7">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
                <MessageSquare size={18} />
              </span>
              <div>
                <h2 className="font-morabba font-bold text-lg text-foreground">پرسش سریع</h2>
                <p className="text-xs text-muted-foreground">پاسخ سوال خود را نیافتید؟ از ما بپرسید</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <Input
                label="نام و نام خانوادگی"
                placeholder="نام شما"
                error={errors.name?.message}
                {...register('name', {
                  required: 'نام الزامی است',
                  minLength: { value: 3, message: 'نام باید حداقل ۳ حرف باشد' },
                })}
              />
              <Input
                label="ایمیل"
                placeholder="you@example.com"
                dir="ltr"
                error={errors.email?.message}
                {...register('email', {
                  required: 'ایمیل الزامی است',
                  validate: (v) => isValidEmail(v) || 'فرمت ایمیل معتبر نیست',
                })}
              />
              <div>
                <label className="label-app">پیام شما</label>
                <textarea
                  rows={4}
                  placeholder="سوال خود را بنویسید..."
                  className={errors.message ? 'input-app border-red-500 focus:border-red-500 focus:ring-red-500/15' : 'input-app'}
                  {...register('message', {
                    required: 'متن پیام الزامی است',
                    minLength: { value: 10, message: 'پیام باید حداقل ۱۰ حرف باشد' },
                  })}
                />
                {errors.message && <p className="mt-1.5 text-xs text-red-500">{errors.message.message}</p>}
              </div>
              <Button type="submit" fullWidth icon={MessageSquare}>ارسال پرسش</Button>
            </form>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <a
              href="tel:02191009100"
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
                <Phone size={18} />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">تلفن پشتیبانی</p>
                <p className="text-sm font-medium text-foreground" dir="ltr">{toFaDigits('021-91009100')}</p>
              </div>
            </a>
            <a
              href="mailto:support@kafshino.ir"
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
                <Mail size={18} />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">ایمیل پشتیبانی</p>
                <p className="text-sm font-medium text-foreground" dir="ltr">support@kafshino.ir</p>
              </div>
            </a>
          </div>
        </motion.div>
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-3xl border border-border/60 bg-brand-gradient p-8 text-white shadow-lift sm:flex-row sm:p-10">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur">
            <Headphones size={26} />
          </span>
          <div>
            <h3 className="font-morabba font-bold text-xl">پاسخگویی ۲۴ ساعته</h3>
            <p className="mt-1 text-sm text-white/80">تیم پشتیبانی کفشینو در تمام ساعات شبانه‌روز همراه شماست.</p>
          </div>
        </div>
        <a href="tel:02191009100" className="flex items-center gap-2.5 rounded-2xl bg-white/15 px-6 py-3.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/25">
          <Phone size={18} />
          <span dir="ltr">{toFaDigits('021-91009100')}</span>
        </a>
      </div>
    </div>
  );
}
