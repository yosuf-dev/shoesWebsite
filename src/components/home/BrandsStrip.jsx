import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BRANDS, BRAND_LOGO_COLORS } from '../../data/mockData';
import SectionHeading from '../ui/SectionHeading';
import { Stagger, StaggerItem } from '../ui/Reveal';

export default function BrandsStrip() {
  return (
    <section className="container-app py-16">
      <SectionHeading
        eyebrow="برندهای معتبر"
        title="همکاری با بهترین‌های دنیا"
        subtitle="محصولات اصل و دارای گارانتی از معتبرترین برندهای جهانی."
      />
      <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {BRANDS.map((b, i) => (
          <StaggerItem key={b.id}>
            <Link
              to={`/shop?brand=${b.slug}`}
              className="group flex flex-col items-center gap-3 rounded-3xl border border-border/60 bg-card p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-brand-500/40"
            >
              <span
                className="grid h-14 w-14 place-items-center rounded-full text-white font-morabba font-extrabold text-xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: BRAND_LOGO_COLORS[b.slug] || '#6366f1' }}
              >
                {b.name[0]}
              </span>
              <span className="text-sm font-medium text-foreground">{b.name}</span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
