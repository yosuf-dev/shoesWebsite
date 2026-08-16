import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Headphones, MessageSquare } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb';
import SectionHeading from '../components/ui/SectionHeading';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../contexts/ToastContext';
import { isValidEmail, toFaDigits } from '../utils/format';

const CONTACT_ITEMS = [
  { icon: MapPin, title: 'آدرس', lines: ['تهران، خیابان ولیعصر، مرکز خرید کفشینو'] },
  { icon: Phone, title: 'تلفن تماس', lines: ['۰۲۱-۹۱۰۰۹۱۰۰', '۰۹۱۲۰۰۰۰۰۰۱'] },
  { icon: Mail, title: 'ایمیل', lines: ['info@kafshino.ir', 'support@kafshino.ir'] },
  { icon: Clock, title: 'ساعات کاری', lines: ['شنبه تا پنجشنبه: ۹ تا ۲۱', 'جمعه: ۱۰ تا ۱۸'] },
];

export default function ContactPage() {
  const toast = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    toast.success('پیام شما ارسال شد', 'کارشناسان ما به‌زودی پاسخگوی شما خواهند بود.');
    reset({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container-app py-8 lg:py-12">
      <Breadcrumb items={['تماس با ما']} className="mb-6" />

      <SectionHeading
        eyebrow="ارتباط با کفشینو"
        title="تماس با ما"
        subtitle="تیم پشتیبانی کفشینو آماده پاسخگویی به سوالات، انتقادات و پیشنهادهای شماست."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CONTACT_ITEMS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="card-elevated p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow-sm">
              <item.icon size={22} />
            </span>
            <h3 className="mb-2 font-morabba font-bold text-base text-foreground">{item.title}</h3>
            {item.lines.map((line) => (
              <p key={line} className="text-sm leading-6 text-muted-foreground" dir="auto">
                {toFaDigits(line)}
              </p>
            ))}
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* نقشه ساختگی */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative min-h-[320px] overflow-hidden rounded-3xl border border-border/60 bg-[radial-gradient(circle_at_30%_30%,#6366f1_0%,transparent_55%),radial-gradient(circle_at_75%_75%,#f59e0b_0%,transparent_50%)] shadow-soft lg:min-h-full"
        >
          <div className="absolute inset-0 opacity-20 dark:opacity-30" style={{ backgroundImage: 'linear-gradient(rgb(255 255 255 / 0.15) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.15) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

          <div className="relative flex h-full flex-col items-center justify-center p-8 text-center">
            <div className="relative mb-4">
              <motion.span
                className="absolute inset-0 rounded-full bg-accent-400/50"
                animate={{ scale: [1, 2], opacity: [0.7, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
              <span className="relative grid h-16 w-16 place-items-center rounded-full bg-brand-gradient text-white shadow-lift">
                <MapPin size={28} />
              </span>
            </div>
            <h3 className="font-morabba font-bold text-xl text-white drop-shadow">کفشینو — شعبه مرکزی تهران</h3>
            <p className="mt-2 max-w-xs text-sm leading-7 text-white/85">
              تهران، خیابان ولیعصر، مرکز خرید کفشینو
            </p>
            <p className="mt-4 rounded-full bg-white/15 px-4 py-1.5 text-xs text-white backdrop-blur" dir="ltr">
              {toFaDigits('35.6892° N, 51.3890° E')}
            </p>
          </div>
        </motion.div>

        {/* فرم پیام */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card-elevated p-6 sm:p-8"
        >
          <div className="mb-6 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
              <MessageSquare size={18} />
            </span>
            <div>
              <h3 className="font-morabba font-bold text-lg text-foreground">ارسال پیام</h3>
              <p className="text-xs text-muted-foreground">فرم زیر را پر کنید؛ در کوتاه‌ترین زمان پاسخ می‌دهیم.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>
            <Input
              label="موضوع"
              placeholder="موضوع پیام"
              icon={Headphones}
              error={errors.subject?.message}
              {...register('subject', {
                required: 'موضوع الزامی است',
                minLength: { value: 5, message: 'موضوع باید حداقل ۵ حرف باشد' },
              })}
            />
            <div>
              <label className="label-app">متن پیام</label>
              <textarea
                rows={5}
                placeholder="پیام خود را بنویسید..."
                className={errors.message ? 'input-app border-red-500 focus:border-red-500 focus:ring-red-500/15' : 'input-app'}
                {...register('message', {
                  required: 'متن پیام الزامی است',
                  minLength: { value: 10, message: 'پیام باید حداقل ۱۰ حرف باشد' },
                })}
              />
              {errors.message && <p className="mt-1.5 text-xs text-red-500">{errors.message.message}</p>}
            </div>
            <Button type="submit" fullWidth size="lg" icon={Send}>ارسال پیام</Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
