import { useState } from 'react';
import { ChevronRight, ChevronLeft, ZoomIn } from 'lucide-react';
import ProductImage from '../ui/ProductImage';
import Badge from '../ui/Badge';
import { cn, toFaDigits } from '../../utils/format';

const VARIANTS = ['side', 'angle', 'front', 'top'];
const VARIANT_LABELS = {
  side: 'نمای کناری',
  angle: 'نمای زاویه‌دار',
  front: 'نمای جلو',
  top: 'نمای بالا',
};

/**
 * گالری محصول — تصویر اصلی با زوم هاور، بندانگشتی واریانت‌ها، انتخاب رنگ و نشان‌ها
 */
export default function ProductGallery({ product, colorIndex = 0, onColorChange }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');

  const variant = VARIANTS[variantIndex];
  const color = product.colors?.[colorIndex];

  const goPrev = () => setVariantIndex((i) => (i - 1 + VARIANTS.length) % VARIANTS.length);
  const goNext = () => setVariantIndex((i) => (i + 1) % VARIANTS.length);

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* تصویر اصلی */}
      <div
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMove}
        className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-muted/30 to-transparent shadow-softer"
      >
        <div
          className="h-full w-full transition-transform duration-200 ease-out will-change-transform"
          style={{ transformOrigin: origin, transform: zoom ? 'scale(1.9)' : 'scale(1)' }}
        >
          <ProductImage
            product={product}
            colorIndex={colorIndex}
            variant={variant}
            className="h-full w-full object-cover"
          />
        </div>

        {/* نشان تخفیف و جدید */}
        <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
          {product.discountPercent > 0 && (
            <Badge variant="danger" className="shadow">{toFaDigits(product.discountPercent)}٪ تخفیف</Badge>
          )}
          {product.isNew && <Badge variant="success" className="shadow">جدید</Badge>}
        </div>

        {/* نشان زوم */}
        <div
          className={cn(
            'absolute bottom-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-card/85 text-muted-foreground shadow-softer backdrop-blur-md transition-opacity duration-300',
            zoom ? 'opacity-0' : 'opacity-100'
          )}
        >
          <ZoomIn size={18} />
        </div>

        {/* قبلی / بعدی */}
        <button
          onClick={goPrev}
          aria-label="تصویر قبلی"
          className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-card/85 text-foreground shadow-softer backdrop-blur-md transition-all hover:bg-brand-600 hover:text-white"
        >
          <ChevronRight size={20} />
        </button>
        <button
          onClick={goNext}
          aria-label="تصویر بعدی"
          className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-card/85 text-foreground shadow-softer backdrop-blur-md transition-all hover:bg-brand-600 hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>

        {/* شمارنده تصویر */}
        <div className="absolute bottom-4 left-4 z-10 rounded-full bg-card/85 px-3 py-1 text-xs font-medium text-muted-foreground shadow-softer backdrop-blur-md">
          {toFaDigits(variantIndex + 1)} / {toFaDigits(VARIANTS.length)}
        </div>
      </div>

      {/* بندانگشتی واریانت‌ها */}
      <div className="flex gap-3">
        {VARIANTS.map((v, i) => (
          <button
            key={v}
            onClick={() => setVariantIndex(i)}
            title={VARIANT_LABELS[v]}
            className={cn(
              'relative aspect-square w-[22%] overflow-hidden rounded-2xl border-2 bg-surface transition-all',
              variantIndex === i
                ? 'scale-[1.02] border-brand-600 shadow-glow-sm'
                : 'border-border/70 hover:border-brand-400'
            )}
          >
            <ProductImage product={product} colorIndex={colorIndex} variant={v} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {/* انتخاب رنگ */}
      {product.colors?.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">رنگ:</span>
          <div className="flex gap-2.5">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                onClick={() => onColorChange?.(i)}
                aria-label={c.name}
                className={cn(
                  'h-9 w-9 rounded-full border-2 transition-all',
                  colorIndex === i
                    ? 'scale-110 border-brand-600 shadow-glow-sm'
                    : 'border-border hover:scale-105'
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-foreground">{color?.name}</span>
        </div>
      )}
    </div>
  );
}
