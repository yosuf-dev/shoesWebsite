import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ProductImage from '../../components/ui/ProductImage';
import { PageHeader } from '../../layouts/AdminLayout';
import { useToast } from '../../contexts/ToastContext';
import { PRODUCTS, CATEGORIES, BRANDS, getProductById } from '../../data/mockData';
import { GENDERS, SIZES } from '../../constants/config';
import { cn, toFaDigits, formatToman, formatPercent } from '../../utils/format';

const STATUS_OPTIONS = [
  { value: 'active', label: 'فعال' },
  { value: 'draft', label: 'پیش‌نویس' },
  { value: 'out', label: 'ناموجود' },
];

const SIZE_NUMS = SIZES.map((s) => s.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const editing = Boolean(id);
  const existing = id ? getProductById(id) : null;

  const [colors, setColors] = useState(
    existing ? existing.colors.map((c) => ({ name: c.name, hex: c.hex })) : [{ name: 'مشکی', hex: '#1e293b' }]
  );
  const [sizes, setSizes] = useState(existing ? existing.sizes.map(String) : []);
  const [specs, setSpecs] = useState(
    existing ? Object.entries(existing.specs).map(([key, value]) => ({ key, value })) : []
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: existing
      ? {
          name: existing.name,
          brand: existing.brand.slug,
          category: existing.category.slug,
          gender: existing.gender,
          price: existing.price,
          compareAtPrice: existing.compareAtPrice || '',
          sku: `KFN-${String(existing.id).padStart(4, '0')}`,
          stock: existing.stock,
          description: existing.description,
          status: 'active',
        }
      : {
          name: '',
          brand: '',
          category: '',
          gender: 'men',
          price: '',
          compareAtPrice: '',
          sku: `KFN-${String(PRODUCTS.length + 1).padStart(4, '0')}`,
          stock: 10,
          description: '',
          status: 'active',
        },
  });

  const watchVals = watch();
  const firstHex = colors[0]?.hex || '#6366f1';
  const previewProduct = {
    name: watchVals.name || 'نام محصول',
    brand: { name: BRANDS.find((b) => b.slug === watchVals.brand)?.name || 'برند' },
    category: { name: CATEGORIES.find((c) => c.slug === watchVals.category)?.name || 'دسته‌بندی' },
    colors: colors.map((c) => ({
      ...c,
      palette: { from: c.hex, to: c.hex, accent: '#ffffff' },
      images: ['side'],
    })),
    palette: { from: firstHex, to: firstHex, accent: '#ffffff' },
    images: ['side'],
    price: Number(watchVals.price) || 0,
    compareAtPrice: Number(watchVals.compareAtPrice) || null,
    stock: Number(watchVals.stock) || 0,
  };

  const discount = previewProduct.compareAtPrice
    ? Math.round(((previewProduct.compareAtPrice - previewProduct.price) / previewProduct.compareAtPrice) * 100)
    : 0;

  const addColor = () => setColors((c) => [...c, { name: '', hex: '#6366f1' }]);
  const updateColor = (i, field, value) =>
    setColors((c) => c.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));
  const removeColor = (i) => setColors((c) => c.filter((_, idx) => idx !== i));

  const toggleSize = (s) =>
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const addSpec = () => setSpecs((s) => [...s, { key: '', value: '' }]);
  const updateSpec = (i, field, value) =>
    setSpecs((s) => s.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));
  const removeSpec = (i) => setSpecs((s) => s.filter((_, idx) => idx !== i));

  const onSubmit = () => {
    toast.success(editing ? 'محصول ویرایش شد' : 'محصول جدید ثبت شد', watchVals.name || 'بدون نام');
    navigate('/admin/products');
  };

  const sectionTitle = 'mb-4 font-morabba font-bold text-sm text-foreground';

  return (
    <div>
      <PageHeader
        title={editing ? 'ویرایش محصول' : 'افزودن محصول'}
        subtitle={editing ? `در حال ویرایش «${existing?.name}»` : 'محصول جدیدی به فروشگاه اضافه کنید'}
        actions={
          <Button variant="secondary" onClick={() => navigate('/admin/products')}>
            <ArrowRight size={17} />
            بازگشت به لیست
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="space-y-4 xl:col-span-2">
            <div className="card-elevated p-5">
              <h3 className={sectionTitle}>اطلاعات پایه</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    label="نام محصول"
                    placeholder="مثلاً: ایر مکس ۲۰۲۶"
                    error={errors.name && 'نام محصول الزامی است'}
                    {...register('name', { required: true })}
                  />
                </div>
                <Select
                  label="برند"
                  placeholder="انتخاب برند"
                  error={errors.brand && 'برند الزامی است'}
                  options={BRANDS.map((b) => ({ value: b.slug, label: b.name }))}
                  {...register('brand', { required: true })}
                />
                <Select
                  label="دسته‌بندی"
                  placeholder="انتخاب دسته"
                  error={errors.category && 'دسته الزامی است'}
                  options={CATEGORIES.map((c) => ({ value: c.slug, label: c.name }))}
                  {...register('category', { required: true })}
                />
                <Select
                  label="جنسیت"
                  options={GENDERS}
                  {...register('gender')}
                />
                <Input
                  label="SKU"
                  placeholder="کد محصول"
                  {...register('sku')}
                />
                <Input
                  label="قیمت (تومان)"
                  type="number"
                  placeholder="مثلاً ۴۸۹۰۰۰۰"
                  error={errors.price && 'قیمت الزامی است'}
                  {...register('price', { required: true })}
                />
                <Input
                  label="قیمت قبل از تخفیف (تومان)"
                  type="number"
                  placeholder="اختیاری"
                  {...register('compareAtPrice')}
                />
                <Input
                  label="موجودی"
                  type="number"
                  {...register('stock', { valueAsNumber: true })}
                />
                <Select
                  label="وضعیت"
                  options={STATUS_OPTIONS}
                  {...register('status')}
                />
              </div>
            </div>

            <div className="card-elevated p-5">
              <h3 className={sectionTitle}>رنگ‌بندی</h3>
              <div className="space-y-3">
                {colors.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-2xl bg-muted/30 p-3">
                    <input
                      type="color"
                      value={c.hex}
                      onChange={(e) => updateColor(i, 'hex', e.target.value)}
                      className="h-11 w-11 shrink-0 cursor-pointer rounded-xl border border-border bg-surface"
                      aria-label="رنگ"
                    />
                    <Input
                      className="flex-1"
                      placeholder="نام رنگ (مثلاً مشکی)"
                      value={c.name}
                      onChange={(e) => updateColor(i, 'name', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeColor(i)}
                      disabled={colors.length === 1}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:opacity-30"
                      aria-label="حذف رنگ"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <Button type="button" variant="secondary" size="sm" onClick={addColor}>
                  <Plus size={16} />
                  افزودن رنگ
                </Button>
              </div>
            </div>

            <div className="card-elevated p-5">
              <h3 className={sectionTitle}>سایزها</h3>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s, i) => {
                  const active = sizes.includes(SIZE_NUMS[i]);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(SIZE_NUMS[i])}
                      className={cn(
                        'h-11 w-12 rounded-xl border text-sm font-medium transition-all',
                        active
                          ? 'border-brand-600 bg-brand-gradient text-white shadow-glow-sm'
                          : 'border-border bg-surface text-foreground hover:border-brand-500'
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="card-elevated p-5">
              <h3 className={sectionTitle}>توضیحات و مشخصات</h3>
              <label className="label-app">توضیحات محصول</label>
              <textarea
                className="input-app min-h-28 resize-y"
                placeholder="توضیحات کامل محصول..."
                {...register('description')}
              />
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">مشخصات فنی</p>
                  <Button type="button" variant="secondary" size="sm" onClick={addSpec}>
                    <Plus size={15} />
                    افزودن مشخصه
                  </Button>
                </div>
                {specs.map((sp, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Input
                      className="flex-1"
                      placeholder="عنوان (مثلاً جنس رویه)"
                      value={sp.key}
                      onChange={(e) => updateSpec(i, 'key', e.target.value)}
                    />
                    <Input
                      className="flex-1"
                      placeholder="مقدار (مثلاً چرم مصنوعی)"
                      value={sp.value}
                      onChange={(e) => updateSpec(i, 'value', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(i)}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                      aria-label="حذف مشخصه"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {specs.length === 0 && (
                  <p className="text-xs text-muted-foreground">مشخصه‌ای ثبت نشده است.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card-elevated sticky top-24 overflow-hidden p-0">
              <div className="border-b border-border/70 p-5">
                <h3 className="font-morabba font-bold text-sm text-foreground">پیش‌نمایش زنده</h3>
              </div>
              <div className="p-5">
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500/10 to-accent-500/10 p-6">
                  <div className="mx-auto h-36 w-48">
                    <ProductImage product={previewProduct} variant="side" className="h-full w-full drop-shadow-lg" />
                  </div>
                </div>
                <div className="mt-4 space-y-2.5">
                  <p className="font-morabba font-bold text-lg leading-7 text-foreground">
                    {previewProduct.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {previewProduct.brand.name} — {previewProduct.category.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {colors.length > 0 && (
                      <span className="flex -space-x-1.5">
                        {colors.slice(0, 4).map((c, i) => (
                          <span
                            key={i}
                            className="h-5 w-5 rounded-full border-2 border-card"
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                      </span>
                    )}
                    {sizes.length > 0 && (
                      <span className="text-xs text-muted-foreground">{toFaDigits(sizes.length)} سایز</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-morabba font-bold text-xl text-foreground">
                      {formatToman(previewProduct.price)}
                    </span>
                    {discount > 0 && (
                      <>
                        <span className="text-sm text-muted-foreground line-through">
                          {formatToman(previewProduct.compareAtPrice)}
                        </span>
                        <Badge variant="warning">{formatPercent(discount)}</Badge>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Badge variant={previewProduct.stock > 0 ? 'success' : 'danger'}>
                      {previewProduct.stock > 0 ? `موجود (${toFaDigits(previewProduct.stock)} عدد)` : 'ناموجود'}
                    </Badge>
                    <Badge variant="brand">
                      {STATUS_OPTIONS.find((s) => s.value === watchVals.status)?.label || '—'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 border-t border-border/70 p-5">
                <Button type="submit" fullWidth>
                  {editing ? 'ذخیره تغییرات' : 'ثبت محصول'}
                </Button>
                <Button type="button" variant="ghost" fullWidth onClick={() => navigate('/admin/products')}>
                  انصراف
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
