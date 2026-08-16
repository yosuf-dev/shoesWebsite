import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, ArrowLeft } from 'lucide-react';
import { PRODUCTS } from '../../data/mockData';
import ProductImage from '../ui/ProductImage';
import PriceTag from '../ui/PriceTag';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';
import { toFaDigits } from '../../utils/format';

export default function LimitedEdition() {
  const limited = PRODUCTS.filter((p) => p.limited).slice(0, 2);
  if (!limited.length) return null;

  return (
    <section className="container-app py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        className="relative overflow-hidden rounded-5xl bg-gradient-to-bl from-slate-900 via-slate-800 to-brand-900 p-8 text-white lg:p-14"
      >
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-md">
              <Crown size={14} className="text-accent-300" />
              کالکشن نسخه محدود
            </span>
            <h2 className="mt-5 font-morabba font-extrabold text-3xl leading-snug sm:text-4xl">
              انحصاری‌ترین اسنیکرهای فصل
            </h2>
            <p className="mt-4 max-w-md text-sm leading-8 text-white/70">
              تنها تعداد محدودی از این کلکسیون‌های ویژه در دسترس است. هر کفش با شماره سریال
              مخصوص و جعبه‌ای لوکس عرضه می‌شود.
            </p>
            <Link
              to="/shop?category=basketball"
              className="group mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition-all hover:shadow-glow"
            >
              مشاهده کالکشن محدود
              <ArrowLeft size={17} className="transition-transform group-hover:-translate-x-1.5" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {limited.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={i === 1 ? 'sm:mt-8' : ''}
              >
                <Link
                  to={`/product/${p.slug}`}
                  className="group block rounded-3xl bg-white/10 p-4 backdrop-blur-md ring-1 ring-white/15 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/15"
                >
                  <div className="overflow-hidden rounded-2xl">
                    <ProductImage
                      product={p}
                      className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white/60">{p.brand.name}</span>
                      <Badge variant="warning">فقط {toFaDigits(p.stock)} عدد</Badge>
                    </div>
                    <h3 className="mt-2 font-morabba font-bold text-lg">{p.name}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <PriceTag price={p.price} size="sm" light />
                      <Rating value={p.rating} size={13} showValue={false} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
