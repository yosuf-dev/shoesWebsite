import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, Trash2, ShoppingBag, X, PackageOpen } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import ProductImage from '../components/ui/ProductImage';
import PriceTag from '../components/ui/PriceTag';
import Rating from '../components/ui/Rating';
import Badge from '../components/ui/Badge';
import { useCompare } from '../contexts/CompareContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { PRODUCTS } from '../data/mockData';
import { toFaDigits, cn } from '../utils/format';

const GENDER_LABELS = { men: 'مردانه', women: 'زنانه', kids: 'بچه‌گانه', unisex: 'یونیسکس' };

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addItem } = useCart();
  const toast = useToast();

  const products = useMemo(
    () => PRODUCTS.filter((p) => compareList.includes(p.id)),
    [compareList]
  );

  const handleClear = () => {
    clearCompare();
    toast.info('لیست مقایسه پاک شد');
  };

  const handleAdd = (p) => {
    addItem(p, { size: p.sizes[Math.floor(p.sizes.length / 2)] });
  };

  if (products.length === 0) {
    return (
      <div className="container-app py-8 lg:py-12">
        <Breadcrumb items={['مقایسه محصولات']} className="mb-6" />
        <h1 className="mb-8 font-morabba font-bold text-2xl text-foreground sm:text-3xl">مقایسه محصولات</h1>
        <EmptyState
          title="محصولی برای مقایسه وجود ندارد"
          description="حداکثر ۴ محصول را از طریق دکمه مقایسه روی کارت محصولات، اینجا اضافه کنید."
          icon="package"
          action={
            <Link to="/shop">
              <Button icon={Scale}>انتخاب محصول برای مقایسه</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const rows = [
    {
      label: 'قیمت',
      render: (p) => <PriceTag price={p.price} compareAtPrice={p.compareAtPrice} size="sm" />,
    },
    {
      label: 'امتیاز',
      render: (p) => <Rating value={p.rating} count={p.reviewCount} />,
    },
    {
      label: 'رنگ‌ها',
      render: (p) => (
        <div className="flex flex-wrap justify-center gap-2">
          {p.colors.map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="h-6 w-6 rounded-full border border-border shadow-sm"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      ),
    },
    {
      label: 'سایزها',
      render: (p) => (
        <div className="flex flex-wrap justify-center gap-1.5">
          {p.sizes.slice(0, 5).map((s) => (
            <span key={s} className="rounded-md border border-border bg-surface px-2 py-0.5 text-xs text-foreground">
              {toFaDigits(s)}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: 'موجودی',
      render: (p) =>
        p.stock > 0 ? (
          <Badge variant="success">موجود ({toFaDigits(p.stock)})</Badge>
        ) : (
          <Badge variant="danger">ناموجود</Badge>
        ),
    },
    {
      label: 'تخفیف',
      render: (p) =>
        p.discountPercent > 0 ? (
          <Badge variant="danger">{toFaDigits(p.discountPercent)}٪ تخفیف</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      label: 'دسته‌بندی',
      render: (p) => <span className="text-sm text-foreground">{p.category.name}</span>,
    },
    {
      label: 'جنسیت',
      render: (p) => <span className="text-sm text-foreground">{GENDER_LABELS[p.gender] || p.gender}</span>,
    },
    {
      label: 'جنس رویه',
      render: (p) => <span className="text-sm text-foreground">{p.material}</span>,
    },
    {
      label: 'برند',
      render: (p) => <span className="text-sm font-medium text-brand-600 dark:text-brand-300">{p.brand.name}</span>,
    },
  ];

  return (
    <div className="container-app py-8 lg:py-12">
      <Breadcrumb items={['مقایسه محصولات']} className="mb-6" />

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-morabba font-bold text-2xl text-foreground sm:text-3xl">مقایسه محصولات</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            مقایسه {toFaDigits(products.length)} محصول از {toFaDigits(4)} محصول مجاز
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/shop">
            <Button variant="secondary" icon={Scale}>انتخاب محصول</Button>
          </Link>
          <Button variant="danger" onClick={handleClear} icon={Trash2}>پاک‌کردن همه</Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-border/60 bg-card shadow-soft">
        <table className="w-full min-w-[720px] border-collapse text-right text-sm">
          <thead>
            <tr>
              <th className="w-32 bg-muted/40 px-4 py-5 text-xs font-medium text-muted-foreground">
                ویژگی
              </th>
              {products.map((p) => (
                <th key={p.id} className="bg-muted/40 px-4 py-5">
                  <div className="relative">
                    <button
                      onClick={() => {
                        removeFromCompare(p.id);
                        toast.info('از مقایسه حذف شد', p.name);
                      }}
                      className="absolute -left-1 -top-1 z-10 grid h-8 w-8 place-items-center rounded-full bg-surface text-muted-foreground shadow border border-border transition-colors hover:bg-red-500 hover:text-white"
                      aria-label="حذف از مقایسه"
                    >
                      <X size={15} />
                    </button>
                    <div className="mx-auto h-28 w-28 overflow-hidden rounded-2xl bg-muted/30">
                      <ProductImage product={p} className="h-full w-full object-cover" />
                    </div>
                    <Link to={`/product/${p.slug}`}>
                      <p className="mt-3 truncate font-morabba font-semibold text-sm text-foreground transition-colors hover:text-brand-600 dark:hover:text-brand-300">
                        {p.name}
                      </p>
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">{p.brand.name}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.label} className={cn('border-t border-border/60', ri % 2 === 0 && 'bg-surface/40')}>
                <td className="whitespace-nowrap bg-muted/30 px-4 py-4 text-xs font-medium text-muted-foreground">
                  {row.label}
                </td>
                {products.map((p) => (
                  <td key={p.id} className="px-4 py-4 text-center">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-border/60">
              <td className="bg-muted/30 px-4 py-5 text-xs font-medium text-muted-foreground">عملیات</td>
              {products.map((p) => (
                <td key={p.id} className="px-4 py-5 text-center">
                  <Button size="sm" icon={ShoppingBag} onClick={() => handleAdd(p)}>
                    افزودن به سبد
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border/60 bg-brand-500/5 px-5 py-4 text-sm text-muted-foreground">
        <PackageOpen size={18} className="shrink-0 text-brand-500" />
        <span>
          می‌توانید تا {toFaDigits(4)} محصول را هم‌زمان مقایسه کنید. برای افزودن محصول جدید، از دکمه «انتخاب محصول» استفاده کنید.
        </span>
      </div>
    </div>
  );
}
