import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-hero-mesh dark:bg-dark-mesh px-4">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="mb-6 inline-grid h-28 w-28 place-items-center rounded-[2rem] bg-brand-gradient text-white shadow-glow"
        >
          <Compass size={56} strokeWidth={1.5} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-morabba font-extrabold text-8xl text-foreground"
        >
          ۴۰۴
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-4 font-morabba font-bold text-2xl text-foreground"
        >
          صفحه مورد نظر پیدا نشد
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground"
        >
          صفحه‌ای که دنبال آن هستید حذف شده یا آدرس آن تغییر کرده است. به فروشگاه بازگردید و
          از جدیدترین کالکشن‌ها دیدن کنید.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/">
            <Button icon={ArrowLeft} size="lg">بازگشت به خانه</Button>
          </Link>
          <Link to="/shop">
            <Button variant="secondary" size="lg">رفتن به فروشگاه</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
