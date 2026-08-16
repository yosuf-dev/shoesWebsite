import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../../data/mockData';
import SectionHeading from '../ui/SectionHeading';
import { Stagger, StaggerItem } from '../ui/Reveal';
import { toFaDigits } from '../../utils/format';

const EMOJI = {
  running: '🏃',
  sport: '💪',
  basketball: '🏀',
  walking: '🚶',
  casual: '👟',
  formal: '💼',
  football: '⚽',
  medical: '❤️',
};

const GRADIENTS = [
  'from-indigo-500 to-violet-500',
  'from-sky-500 to-indigo-500',
  'from-rose-500 to-pink-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-fuchsia-500 to-purple-500',
  'from-slate-600 to-slate-800',
  'from-cyan-500 to-sky-600',
];

export default function CategoryShowcase() {
  return (
    <section className="container-app py-16">
      <SectionHeading
        eyebrow="خرید بر اساس نیاز"
        title="دسته‌بندی‌های محبوب"
        subtitle="از پیاده‌روی تا بسکتبال، کفش مناسب هر فعالیت را پیدا کنید."
        link="/shop"
      />
      <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {CATEGORIES.map((c, i) => (
          <StaggerItem key={c.id}>
            <Link
              to={`/shop?category=${c.slug}`}
              className="group flex flex-col items-center gap-3 rounded-3xl border border-border/60 bg-card p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
            >
              <span
                className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
              >
                {EMOJI[c.slug] || '👟'}
              </span>
              <span>
                <span className="block font-medium text-sm text-foreground">{c.name}</span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">
                  {toFaDigits(c.id * 3 + 4)} محصول
                </span>
              </span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
