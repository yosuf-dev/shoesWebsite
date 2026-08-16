import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { PRODUCTS } from '../../data/mockData';
import { useCountdown } from '../../hooks/useCountdown';
import CountdownBox from '../ui/CountdownBox';
import ProductCard from '../product/ProductCard';
import SectionHeading from '../ui/SectionHeading';
import { toFaDigits } from '../../utils/format';

export default function FlashSale() {
  const saleEnd = '2026-08-15T23:59:59';
  const time = useCountdown(saleEnd);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(PRODUCTS.filter((p) => p.flashSale).slice(0, 5));
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-l from-accent-500/10 via-accent-500/5 to-transparent py-16">
      <div className="container-app">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={
              <span className="inline-flex items-center gap-1.5">
                <Zap size={13} className="fill-accent-400 text-accent-500" />
                پیشنهاد لحظه‌ای
              </span>
            }
            title="فروش ویژه با تخفیف‌های شگفت‌انگیز"
            subtitle="تا پایان زمان‌سنج، این محصولات با بهترین قیمت عرضه می‌شوند."
            className="mb-0"
          />
          <div className="shrink-0">
            <p className="mb-2 text-center text-xs font-medium text-muted-foreground lg:text-right">
              پایان پیشنهاد در
            </p>
            <CountdownBox
              days={time.days}
              hours={time.hours}
              minutes={time.minutes}
              seconds={time.seconds}
              size="lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
          {products.map((p, i) => (
            <div key={p.id} className="relative">
              <span className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-accent-gradient text-white shadow-glow-sm">
                <Zap size={18} className="fill-white/30" />
              </span>
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {toFaDigits(products.length)} محصول تخفیف‌دار در فروش ویژه • موجودی محدود
        </p>
      </div>
    </section>
  );
}
