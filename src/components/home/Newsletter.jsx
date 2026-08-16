import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail } from 'lucide-react';
import Button from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';
import { isValidEmail } from '../../utils/format';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const toast = useToast();

  const submit = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      return toast.error('لطفاً یک ایمیل معتبر وارد کنید.');
    }
    toast.success('عضویت موفق', 'به خبرنامه کفشینو پیوستید.');
    setEmail('');
  };

  return (
    <section className="container-app py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        className="relative overflow-hidden rounded-5xl bg-brand-gradient p-10 text-center text-white lg:p-16"
      >
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-xl">
          <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-white/15 backdrop-blur-md">
            <Mail size={26} />
          </span>
          <h2 className="font-morabba font-extrabold text-3xl sm:text-4xl">در جریان تخفیف‌ها باشید</h2>
          <p className="mt-4 text-sm leading-8 text-white/80">
            با عضویت در خبرنامه کفشینو، از جدیدترین محصولات، پیشنهادهای ویژه و کدهای تخفیف
            زودتر از همه باخبر شوید.
          </p>

          <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ایمیل خود را وارد کنید"
              className="h-13 flex-1 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm text-white placeholder:text-white/60 backdrop-blur-md outline-none transition-all focus:border-white/50 focus:ring-4 focus:ring-white/20"
            />
            <Button
              type="submit"
              className="!bg-white !text-brand-700 hover:!bg-white/90"
              icon={Send}
              size="lg"
            >
              عضویت
            </Button>
          </form>
          <p className="mt-4 text-xs text-white/60">
            با عضویت، قوانین و حریم خصوصی کفشینو را می‌پذیرید.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
