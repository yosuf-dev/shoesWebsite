import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Zap,
  Heart,
  Scale,
  Share2,
  Truck,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  Wallet,
  Banknote,
  Ruler,
} from 'lucide-react';
import Button from '../ui/Button';
import PriceTag from '../ui/PriceTag';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';
import QuantityStepper from '../ui/QuantityStepper';
import Modal from '../ui/Modal';
import Tooltip from '../ui/Tooltip';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCompare } from '../../contexts/CompareContext';
import { useToast } from '../../contexts/ToastContext';
import { cn, toFaDigits } from '../../utils/format';
import { PAYMENT_METHODS } from '../../constants/config';

const SIZE_GUIDE = {
  30: '۱۸٫۵', 31: '۱۹٫۵', 32: '۲۰٫۵', 33: '۲۱٫۵', 34: '۲۲', 35: '۲۳',
  36: '۲۲٫۵', 37: '۲۳٫۵', 38: '۲۴', 39: '۲۴٫۵', 40: '۲۵',
  41: '۲۵٫۵', 42: '۲۶', 43: '۲۶٫۵', 44: '۲۷', 45: '۲۷٫۵', 46: '۲۸',
};

const PAY_ICONS = { zarinpal: CreditCard, wallet: Wallet, cod: Banknote };

const SERVICES = [
  { icon: Truck, title: 'ارسال اکسپرس', text: 'تحویل ۱ تا ۲ روز کاری' },
  { icon: RotateCcw, title: '۷ روز ضمانت بازگشت', text: 'بازگشت وجه بدون قید و شرط' },
  { icon: ShieldCheck, title: 'ضمانت اصالت', text: '۶ ماه ضمانت تعویض کفشینو' },
];

/**
 * جعبه خرید — قیمت، امتیاز، موجودی، رنگ، سایز، تعداد، افزودن به سبد، خرید فوری و خدمات
 */
export default function ProductBuyBox({ product, colorIndex = 0, onColorChange }) {
  const navigate = useNavigate();
  const [size, setSize] = useState(product?.sizes?.[Math.floor(product?.sizes?.length / 2)] || null);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuide, setSizeGuide] = useState(false);

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();
  const toast = useToast();

  const color = product.colors?.[colorIndex];
  const inStock = product.stock > 0;
  const wishlisted = isInWishlist(product.id);
  const compared = isInCompare(product.id);
  const maxQty = Math.max(1, Math.min(10, product.stock || 10));

  const handleAdd = () => {
    if (!size) return toast.error('ابتدا سایز را انتخاب کنید');
    addItem(product, { color: colorIndex, size, quantity });
  };

  const handleBuyNow = () => {
    if (!size) return toast.error('ابتدا سایز را انتخاب کنید');
    addItem(product, { color: colorIndex, size, quantity });
    navigate('/checkout');
  };

  const handleWishlist = () => {
    const added = toggleWishlist(product.id);
    toast[added ? 'success' : 'info'](
      added ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد',
      product.name
    );
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `${product.name} از فروشگاه کفشینو`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // کاربر انصراف داد
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('لینک محصول کپی شد');
      } catch {
        toast.error('کپی لینک ناموفق بود');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* برند و نام */}
      <div>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-brand-600 dark:text-brand-300">{product.brand.name}</span>
          <span className="text-xs text-muted-foreground">|</span>
          <span className="text-xs text-muted-foreground">{product.category.name}</span>
          {product.limited && <Badge variant="warning">نسخه محدود</Badge>}
          {product.flashSale && <Badge variant="danger">فروش ویژه</Badge>}
        </div>
        <h1 className="font-morabba font-bold text-2xl text-foreground sm:text-3xl">{product.name}</h1>
        <div className="mt-2.5 flex items-center gap-2">
          <Rating value={product.rating} count={product.reviewCount} size={17} />
        </div>
      </div>

      {/* قیمت */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-surface p-4">
        <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="xl" />
        {product.discountPercent > 0 && (
          <Badge variant="danger">{toFaDigits(product.discountPercent)}٪ تخفیف</Badge>
        )}
      </div>

      {/* موجودی */}
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold',
            inStock
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
              : 'bg-red-500/10 text-red-600 dark:text-red-300'
          )}
        >
          <span className={cn('h-2 w-2 rounded-full', inStock ? 'bg-emerald-500' : 'bg-red-500')} />
          {inStock ? `موجود در انبار (${toFaDigits(product.stock)} عدد)` : 'ناموجود'}
        </span>
      </div>

      {/* انتخاب رنگ */}
      {product.colors?.length > 0 && (
        <div>
          <p className="label-app">رنگ: <span className="font-medium text-foreground">{color?.name}</span></p>
          <div className="flex gap-2.5">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                onClick={() => onColorChange?.(i)}
                aria-label={c.name}
                className={cn(
                  'h-10 w-10 rounded-full border-2 transition-all',
                  colorIndex === i
                    ? 'scale-110 border-brand-600 shadow-glow-sm'
                    : 'border-border hover:scale-105'
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {/* انتخاب سایز */}
      <div>
        <div className="flex items-center justify-between">
          <p className="label-app">سایز: <span className="font-medium text-foreground">{size ? toFaDigits(size) : 'انتخاب کنید'}</span></p>
          <button
            onClick={() => setSizeGuide(true)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300"
          >
            <Ruler size={14} />
            راهنمای سایز
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={cn(
                'h-11 min-w-12 rounded-xl border px-3 text-sm font-semibold transition-all',
                size === s
                  ? 'border-brand-600 bg-brand-gradient text-white shadow-glow-sm'
                  : 'border-border bg-surface text-foreground hover:border-brand-500'
              )}
            >
              {toFaDigits(s)}
            </button>
          ))}
        </div>
      </div>

      {/* تعداد و دکمه‌ها */}
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper value={quantity} onChange={setQuantity} min={1} max={maxQty} size="lg" />
        <div className="flex flex-1 gap-3">
          <Button onClick={handleAdd} icon={ShoppingBag} className="flex-1" disabled={!inStock}>
            افزودن به سبد خرید
          </Button>
          <Button onClick={handleBuyNow} variant="accent" icon={Zap} className="flex-1" disabled={!inStock}>
            خرید فوری
          </Button>
        </div>
      </div>

      {/* علاقه‌مندی / مقایسه / اشتراک‌گذاری */}
      <div className="flex items-center gap-2.5">
        <Tooltip content={wishlisted ? 'حذف از علاقه‌مندی' : 'افزودن به علاقه‌مندی'}>
          <button
            onClick={handleWishlist}
            aria-label="علاقه‌مندی"
            className={cn(
              'grid h-11 w-11 place-items-center rounded-full border transition-all duration-300',
              wishlisted
                ? 'border-rose-500 bg-rose-500 text-white shadow-glow-sm'
                : 'border-border bg-surface text-foreground hover:border-rose-500 hover:bg-rose-500 hover:text-white'
            )}
          >
            <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
        </Tooltip>
        <Tooltip content={compared ? 'حذف از مقایسه' : 'افزودن به مقایسه'}>
          <button
            onClick={() => toggleCompare(product.id)}
            aria-label="مقایسه"
            className={cn(
              'grid h-11 w-11 place-items-center rounded-full border transition-all duration-300',
              compared
                ? 'border-brand-600 bg-brand-600 text-white shadow-glow-sm'
                : 'border-border bg-surface text-foreground hover:border-brand-600 hover:bg-brand-600 hover:text-white'
            )}
          >
            <Scale size={17} />
          </button>
        </Tooltip>
        <Tooltip content="اشتراک‌گذاری">
          <button
            onClick={handleShare}
            aria-label="اشتراک‌گذاری"
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-foreground transition-all duration-300 hover:border-brand-600 hover:bg-brand-600 hover:text-white"
          >
            <Share2 size={17} />
          </button>
        </Tooltip>
      </div>

      {/* تحویل و بازگشت */}
      <div className="grid gap-3 rounded-2xl border border-border/60 bg-surface p-4 sm:grid-cols-3">
        {SERVICES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
              <Icon size={19} strokeWidth={2} />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* روش‌های پرداخت */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-surface px-4 py-3">
        <span className="text-sm font-medium text-muted-foreground">پرداخت امن با:</span>
        <div className="flex flex-wrap items-center gap-4">
          {PAYMENT_METHODS.map(({ id, label, icon }) => {
            const Icon = PAY_ICONS[id] || CreditCard;
            return (
              <span key={id} className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Icon size={16} className="text-brand-600 dark:text-brand-300" />
                {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* راهنمای سایز */}
      <Modal open={sizeGuide} onClose={() => setSizeGuide(false)} title="راهنمای انتخاب سایز" size="sm">
        <p className="mb-4 text-sm leading-7 text-muted-foreground">
          طول کف پای خود را با متر اندازه بگیرید و نزدیک‌ترین سایز را انتخاب کنید. در صورت نیاز پشتیبانی رایگان کمک می‌کند.
        </p>
        <table className="data-table">
          <thead>
            <tr>
              <th>سایز اروپا</th>
              <th>طول کف پا (سانتی‌متر)</th>
              <th>سایز آمریکا</th>
            </tr>
          </thead>
          <tbody>
            {product.sizes.map((s) => (
              <tr key={s}>
                <td>{toFaDigits(s)}</td>
                <td>{SIZE_GUIDE[s] || '—'}</td>
                <td>{toFaDigits(s - 33)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </div>
  );
}
