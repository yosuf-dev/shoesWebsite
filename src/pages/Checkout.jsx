import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Truck, Store, CreditCard, Wallet, Banknote,
  MapPin, ChevronLeft, ChevronRight, LogIn, ShieldCheck, Lock,
  User, Phone, MapPinned, Home, Briefcase, PackageCheck, Sparkles,
  ClipboardCheck, ShoppingBag, Plus,
} from 'lucide-react';
import StepIndicator from '../components/checkout/StepIndicator';
import Breadcrumb from '../components/ui/Breadcrumb';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import EmptyState from '../components/ui/EmptyState';
import ProductImage from '../components/ui/ProductImage';
import Badge from '../components/ui/Badge';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { SHIPPING_METHODS, PAYMENT_METHODS } from '../constants/config';
import { ADDRESSES } from '../data/mockData';
import { formatToman, toFaDigits, cn } from '../utils/format';

const SHIPPING_ICONS = { Zap, Truck, Store };
const PAYMENT_ICONS = { CreditCard, Wallet, Banknote };

const PROVINCES = ['تهران', 'البرز', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی', 'گیلان', 'مازندران', 'قم', 'کرمان'];
const CITIES = ['تهران', 'کرج', 'اصفهان', 'شیراز', 'مشهد', 'تبریز', 'رشت', 'ساری', 'قم', 'کرمان'];

const toEnDigits = (v) => String(v || '').replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));

const defaultAddress = ADDRESSES.find((a) => a.isDefault) || ADDRESSES[0];

function StepHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-500/10 text-brand-500">
        <Icon size={20} />
      </span>
      <div>
        <h2 className="font-morabba font-bold text-lg text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function OrderSummary({ items, subtotal, discount, shipping, tax, total }) {
  return (
    <aside className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft lg:sticky lg:top-28">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
          <ClipboardCheck size={16} />
        </span>
        <h3 className="font-morabba font-bold text-lg text-foreground">خلاصه سفارش</h3>
      </div>

      <div className="max-h-56 space-y-3 overflow-y-auto pe-1 no-scrollbar">
        {items.map((it) => (
          <div key={it.key} className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted/30">
              <ProductImage product={it.product} colorIndex={it.colorIndex} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{it.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {it.size && <>سایز {toFaDigits(it.size)} • </>}
                تعداد {toFaDigits(it.quantity)}
              </p>
            </div>
            <span className="whitespace-nowrap text-sm font-semibold text-foreground">
              {formatToman(it.price * it.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2.5 border-t border-border/60 pt-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>جمع کالاها</span>
          <span>{formatToman(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-500">
            <span>تخفیف</span>
            <span>- {formatToman(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-muted-foreground">
          <span>هزینه ارسال</span>
          <span>{shipping === 0 ? 'رایگان' : formatToman(shipping)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>مالیات بر ارزش افزوده</span>
          <span>{formatToman(tax)}</span>
        </div>
        <div className="flex justify-between border-t border-border/60 pt-3 text-base font-bold text-foreground">
          <span>مبلغ قابل پرداخت</span>
          <span className="font-morabba text-lg">{formatToman(total)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-3 text-xs text-emerald-600 dark:text-emerald-300">
        <ShieldCheck size={16} className="shrink-0" />
        پرداخت امن با ضمانت اصالت کالا
      </div>
    </aside>
  );
}

function SuccessCheck() {
  return (
    <div className="relative mx-auto h-28 w-28">
      <motion.span
        className="absolute inset-0 rounded-full border-4 border-emerald-500/30"
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative grid h-full w-full place-items-center rounded-full bg-emerald-500/10">
        <svg className="h-24 w-24" viewBox="0 0 52 52">
          <motion.circle
            cx="26" cy="26" r="23"
            fill="none" stroke="#10b981" strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <motion.path
            fill="none" stroke="#10b981" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"
            d="M14 27l8 8 16-16"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.35, delay: 0.45, ease: 'easeOut' }}
          />
        </svg>
      </div>
    </div>
  );
}

function SuccessView({ orderId }) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        <SuccessCheck />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
      >
        <Badge variant="success" className="mb-3">پرداخت با موفقیت انجام شد</Badge>
        <h1 className="font-morabba font-bold text-2xl text-foreground sm:text-3xl">سفارش شما ثبت شد!</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-muted-foreground">
          سپاس از خرید شما؛ سفارش پس از بررسی، در سریع‌ترین زمان ممکن برایتان ارسال می‌شود.
        </p>
        <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-border/60 bg-surface p-4">
          <p className="text-xs text-muted-foreground">شماره سفارش</p>
          <p className="mt-1 font-morabba font-bold text-xl text-brand-600 dark:text-brand-300" dir="ltr">
            {toFaDigits(orderId)}
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/panel/orders">
            <Button icon={PackageCheck}>پیگیری سفارش</Button>
          </Link>
          <Link to="/shop">
            <Button variant="secondary" icon={Sparkles}>بازگشت به فروشگاه</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function Checkout() {
  const {
    items, clearCart, subtotal, discount, shipping, tax, total,
    shippingMethod, setShippingMethod,
  } = useCart();
  const { user } = useAuth();
  const toast = useToast();

  const [step, setStep] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?.id ?? null);
  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id);
  const [ordering, setOrdering] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      recipient: defaultAddress?.recipient || '',
      phone: defaultAddress?.phone || '',
      province: defaultAddress?.province || '',
      city: defaultAddress?.city || '',
      street: defaultAddress?.street || '',
      postalCode: defaultAddress?.postalCode || '',
    },
  });

  const selectedShipping = useMemo(
    () => SHIPPING_METHODS.find((m) => m.id === shippingMethod) || SHIPPING_METHODS[1],
    [shippingMethod]
  );
  const selectedPayment = useMemo(
    () => PAYMENT_METHODS.find((m) => m.id === paymentMethod) || PAYMENT_METHODS[0],
    [paymentMethod]
  );

  useEffect(() => {
    const addr = ADDRESSES.find((a) => a.id === selectedAddressId);
    if (addr) {
      reset({
        recipient: addr.recipient,
        phone: addr.phone,
        province: addr.province,
        city: addr.city,
        street: addr.street,
        postalCode: addr.postalCode,
      });
    }
  }, [selectedAddressId, reset]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  const onAddressSubmit = (data) => {
    setAddress(data);
    setStep(1);
    toast.info('آدرس تحویل ثبت شد');
  };

  const placeOrder = () => {
    setOrdering(true);
    setTimeout(() => {
      const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderId(id);
      clearCart();
      setStep(4);
      setOrdering(false);
      toast.success('سفارش شما ثبت شد', `کد پیگیری: ${toFaDigits(id)}`);
    }, 1400);
  };

  const addressStep = (
    <div className="card-elevated p-5 sm:p-7">
      <StepHeader icon={MapPin} title="آدرس تحویل" subtitle="مشخصات محل تحویل سفارش را وارد کنید" />

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {ADDRESSES.map((a) => {
          const active = selectedAddressId === a.id;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelectedAddressId(a.id)}
              className={cn(
                'relative rounded-2xl border-2 p-4 text-right transition-all',
                active
                  ? 'border-brand-600 bg-brand-500/5 shadow-soft'
                  : 'border-border bg-surface hover:border-brand-500/50'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                  {a.title === 'خانه' ? <Home size={16} className="text-brand-500" /> : <Briefcase size={16} className="text-brand-500" />}
                  {a.title}
                </span>
                {a.isDefault && <Badge variant="brand">پیش‌فرض</Badge>}
              </div>
              <p className="mt-2 truncate-2 text-xs leading-6 text-muted-foreground">
                {a.province}، {a.city}، {a.street}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground/80" dir="ltr">
                {toFaDigits(a.phone)}
              </p>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => {
            setSelectedAddressId(null);
            reset({ recipient: '', phone: '', province: '', city: '', street: '', postalCode: '' });
          }}
          className={cn(
            'grid min-h-[110px] place-items-center rounded-2xl border-2 border-dashed p-4 text-sm transition-all',
            selectedAddressId === null
              ? 'border-brand-600 bg-brand-500/5 text-brand-600'
              : 'border-border text-muted-foreground hover:border-brand-500/50 hover:text-brand-500'
          )}
        >
          <span className="flex items-center gap-2">
            <Plus size={16} /> ثبت آدرس جدید
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onAddressSubmit)} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="نام و نام خانوادگی"
            placeholder="مثال: سارا محمدی"
            icon={User}
            error={errors.recipient?.message}
            {...register('recipient', { required: 'نام و نام خانوادگی الزامی است' })}
          />
          <Input
            label="شماره موبایل"
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            icon={Phone}
            dir="ltr"
            error={errors.phone?.message}
            {...register('phone', {
              required: 'شماره موبایل الزامی است',
              validate: (v) => /^09\d{9}$/.test(toEnDigits(v)) || 'شماره موبایل معتبر نیست',
            })}
          />
          <Select
            label="استان"
            icon={MapPinned}
            options={PROVINCES.map((p) => ({ value: p, label: p }))}
            error={errors.province?.message}
            {...register('province', { required: 'استان الزامی است' })}
          />
          <Select
            label="شهر"
            options={CITIES.map((c) => ({ value: c, label: c }))}
            error={errors.city?.message}
            {...register('city', { required: 'شهر الزامی است' })}
          />
          <Input
            label="آدرس کامل"
            placeholder="خیابان، کوچه، پلاک، واحد"
            className="sm:col-span-2"
            error={errors.street?.message}
            {...register('street', {
              required: 'آدرس الزامی است',
              minLength: { value: 8, message: 'آدرس کامل را وارد کنید' },
            })}
          />
          <Input
            label="کد پستی"
            placeholder="۱۰ رقم"
            dir="ltr"
            error={errors.postalCode?.message}
            {...register('postalCode', {
              required: 'کد پستی الزامی است',
              validate: (v) => /^\d{10}$/.test(toEnDigits(v)) || 'کد پستی ۱۰ رقمی است',
            })}
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link to="/shop" className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand-500">
            <ChevronRight size={16} />
            ادامه خرید
          </Link>
          <Button type="submit" size="lg" icon={ChevronLeft} className="flex-row-reverse">
            ادامه و انتخاب روش ارسال
          </Button>
        </div>
      </form>
    </div>
  );

  const shippingStep = (
    <div className="card-elevated p-5 sm:p-7">
      <StepHeader icon={Truck} title="روش ارسال" subtitle="روش دلخواه خود را برای تحویل سفارش انتخاب کنید" />

      <div className="space-y-3">
        {SHIPPING_METHODS.map((m) => {
          const Icon = SHIPPING_ICONS[m.icon] || Truck;
          const active = shippingMethod === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setShippingMethod(m.id)}
              className={cn(
                'flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-right transition-all',
                active
                  ? 'border-brand-600 bg-brand-500/5 shadow-soft'
                  : 'border-border bg-surface hover:border-brand-500/40'
              )}
            >
              <span
                className={cn(
                  'grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-colors',
                  active ? 'bg-brand-gradient text-white shadow-glow-sm' : 'bg-brand-500/10 text-brand-500'
                )}
              >
                <Icon size={22} />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium text-foreground">{m.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{m.description}</span>
              </span>
              <span className={cn('font-morabba font-bold text-sm', m.price === 0 ? 'text-emerald-500' : 'text-foreground')}>
                {m.price === 0 ? 'رایگان' : formatToman(m.price)}
              </span>
              <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-full border-2', active ? 'border-brand-600' : 'border-border')}>
                {active && <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => setStep(0)} icon={ChevronRight}>بازگشت</Button>
        <Button size="lg" onClick={() => setStep(2)} icon={ChevronLeft} className="flex-row-reverse">
          ادامه و انتخاب روش پرداخت
        </Button>
      </div>
    </div>
  );

  const paymentStep = (
    <div className="card-elevated p-5 sm:p-7">
      <StepHeader icon={CreditCard} title="روش پرداخت" subtitle="گزینه‌ی پرداخت امن مورد نظر را انتخاب کنید" />

      <div className="space-y-3">
        {PAYMENT_METHODS.map((m) => {
          const Icon = PAYMENT_ICONS[m.icon] || CreditCard;
          const active = paymentMethod === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setPaymentMethod(m.id)}
              className={cn(
                'flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-right transition-all',
                active
                  ? 'border-brand-600 bg-brand-500/5 shadow-soft'
                  : 'border-border bg-surface hover:border-brand-500/40'
              )}
            >
              <span
                className={cn(
                  'grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-colors',
                  active ? 'bg-brand-gradient text-white shadow-glow-sm' : 'bg-brand-500/10 text-brand-500'
                )}
              >
                <Icon size={22} />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium text-foreground">{m.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{m.description}</span>
              </span>
              <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-full border-2', active ? 'border-brand-600' : 'border-border')}>
                {active && <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-border/60 bg-muted/30 p-4 sm:p-5">
        <p className="mb-3 text-sm font-medium text-foreground">خلاصه مبلغ</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>جمع کالاها</span>
            <span>{formatToman(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-500">
              <span>تخفیف</span>
              <span>- {formatToman(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>هزینه ارسال</span>
            <span>{shipping === 0 ? 'رایگان' : formatToman(shipping)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>مالیات بر ارزش افزوده</span>
            <span>{formatToman(tax)}</span>
          </div>
          <div className="flex justify-between border-t border-border/60 pt-2.5 font-bold text-foreground">
            <span>مبلغ قابل پرداخت</span>
            <span className="font-morabba">{formatToman(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => setStep(1)} icon={ChevronRight}>بازگشت</Button>
        <Button size="lg" onClick={() => setStep(3)} icon={ChevronLeft} className="flex-row-reverse">
          بررسی نهایی سفارش
        </Button>
      </div>
    </div>
  );

  const reviewStep = (
    <div className="space-y-6">
      <div className="card-elevated p-5 sm:p-7">
        <StepHeader icon={ShoppingBag} title="بررسی آیتم‌ها" subtitle={`${toFaDigits(items.length)} کالا در سبد خرید شما`} />
        <div className="divide-y divide-border/60">
          {items.map((it) => (
            <div key={it.key} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-muted/30">
                <ProductImage product={it.product} colorIndex={it.colorIndex} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{it.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {it.brand}
                  {it.size && <> • سایز {toFaDigits(it.size)}</>}
                  {it.colorName && <> • {it.colorName}</>}
                </p>
              </div>
              <div className="shrink-0 text-left">
                <p className="text-xs text-muted-foreground">تعداد {toFaDigits(it.quantity)}</p>
                <p className="mt-1 font-morabba font-bold text-sm text-foreground">{formatToman(it.price * it.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-elevated p-5 sm:p-7">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-morabba font-bold text-base text-foreground">
              <MapPin size={17} className="text-brand-500" /> آدرس تحویل
            </h3>
            <button onClick={() => setStep(0)} className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-300">
              ویرایش
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between gap-4">
              <span className="shrink-0 text-muted-foreground">گیرنده</span>
              <span className="text-foreground">{address?.recipient}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="shrink-0 text-muted-foreground">موبایل</span>
              <span className="text-foreground" dir="ltr">{toFaDigits(address?.phone)}</span>
            </p>
            <p className="flex gap-4">
              <span className="shrink-0 text-muted-foreground">آدرس</span>
              <span className="text-foreground">{address?.province}، {address?.city}، {address?.street}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="shrink-0 text-muted-foreground">کد پستی</span>
              <span className="text-foreground" dir="ltr">{toFaDigits(address?.postalCode)}</span>
            </p>
          </div>
        </div>

        <div className="card-elevated p-5 sm:p-7">
          <h3 className="mb-4 flex items-center gap-2 font-morabba font-bold text-base text-foreground">
            <Truck size={17} className="text-brand-500" /> روش ارسال
          </h3>
          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-surface p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
                {(() => {
                  const Icon = SHIPPING_ICONS[selectedShipping.icon] || Truck;
                  return <Icon size={18} />;
                })()}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{selectedShipping.label}</p>
                <p className="text-xs text-muted-foreground">{selectedShipping.description}</p>
              </div>
            </div>
            <span className="font-morabba font-bold text-sm text-foreground">
              {selectedShipping.price === 0 ? 'رایگان' : formatToman(selectedShipping.price)}
            </span>
          </div>
        </div>
      </div>

      <div className="card-elevated p-5 sm:p-7">
        <h3 className="mb-4 flex items-center gap-2 font-morabba font-bold text-base text-foreground">
          <CreditCard size={17} className="text-brand-500" /> روش پرداخت
        </h3>
        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-surface p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/10 text-brand-500">
              {(() => {
                const Icon = PAYMENT_ICONS[selectedPayment.icon] || CreditCard;
                return <Icon size={18} />;
              })()}
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{selectedPayment.label}</p>
              <p className="text-xs text-muted-foreground">{selectedPayment.description}</p>
            </div>
          </div>
          <Badge variant="success">امن</Badge>
        </div>
      </div>

      <div className="card-elevated p-5 sm:p-7">
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>جمع کالاها</span>
            <span>{formatToman(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-500">
              <span>تخفیف ({toFaDigits(subtotal - discount > 0 ? Math.round(((discount) / (subtotal)) * 100) : 0)}٪)</span>
              <span>- {formatToman(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>هزینه ارسال ({selectedShipping.label})</span>
            <span>{shipping === 0 ? 'رایگان' : formatToman(shipping)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>مالیات بر ارزش افزوده</span>
            <span>{formatToman(tax)}</span>
          </div>
          <div className="flex justify-between border-t border-border/60 pt-3 text-base font-bold text-foreground">
            <span>مبلغ قابل پرداخت</span>
            <span className="font-morabba text-xl text-brand-600 dark:text-brand-300">{formatToman(total)}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="ghost" onClick={() => setStep(2)} icon={ChevronRight}>بازگشت به پرداخت</Button>
          <Button size="lg" loading={ordering} onClick={placeOrder} icon={Lock}>
            ثبت نهایی سفارش
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-app py-8 lg:py-12">
      <Breadcrumb items={['تسویه حساب']} className="mb-6" />

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-morabba font-bold text-2xl text-foreground sm:text-3xl">تسویه حساب</h1>
        <p className="mt-1 text-sm text-muted-foreground">مراحل زیر را به ترتیب تکمیل کنید تا سفارش شما ثبت شود.</p>
      </motion.div>

      {step === 4 ? (
        <SuccessView orderId={orderId} />
      ) : items.length === 0 ? (
        <EmptyState
          title="سبد خرید شما خالی است"
          description="برای ثبت سفارش ابتدا محصولات مورد نظر خود را به سبد خرید اضافه کنید."
          icon="package"
          action={
            <Link to="/shop">
              <Button icon={ShoppingBag}>رفتن به فروشگاه</Button>
            </Link>
          }
        />
      ) : !user ? (
        <div className="card-elevated mx-auto max-w-xl p-8 text-center sm:p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-brand-500/10 text-brand-500"
          >
            <LogIn size={34} strokeWidth={1.6} />
          </motion.div>
          <h2 className="font-morabba font-bold text-xl text-foreground">برای ادامه، وارد حساب شوید</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-muted-foreground">
            برای ثبت سفارش باید وارد حساب کاربری خود شوید. اگر حساب ندارید، به‌سادگی ثبت‌نام کنید.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/login" state={{ from: '/checkout' }}>
              <Button fullWidth icon={LogIn}>ورود به حساب</Button>
            </Link>
            <Link to="/register" state={{ from: '/checkout' }}>
              <Button fullWidth variant="secondary" icon={User}>ثبت‌نام رایگان</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px]">
          <div>
            <div className="card-elevated p-4 sm:p-6">
              <StepIndicator current={step} onStepClick={setStep} />
            </div>
            <div className="mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 0 && addressStep}
                  {step === 1 && shippingStep}
                  {step === 2 && paymentStep}
                  {step === 3 && reviewStep}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <OrderSummary items={items} subtotal={subtotal} discount={discount} shipping={shipping} tax={tax} total={total} />
        </div>
      )}
    </div>
  );
}
