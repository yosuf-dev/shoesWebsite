import { useState } from 'react';
import {
  Store, CreditCard, Truck, Search, ShieldCheck, Palette, Save,
  Globe, Mail, Phone, MapPin, Instagram, Send, KeyRound, Lock,
} from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Switch from '../../components/ui/Switch';
import Tabs from '../../components/ui/Tabs';
import { PageHeader } from '../../layouts/AdminLayout';
import { useToast } from '../../contexts/ToastContext';
import { PAYMENT_METHODS, SHIPPING_METHODS } from '../../constants/config';
import { cn, toFaDigits, formatToman } from '../../utils/format';

const PALETTES = [
  { name: 'نیلی بنفش', brand: '99 102 241', brand600: '79 70 229' },
  { name: 'بنفش', brand: '168 85 247', brand600: '147 51 234' },
  { name: 'سبز زمردی', brand: '16 185 129', brand600: '5 150 105' },
  { name: 'نارنجی', brand: '249 115 22', brand600: '234 88 12' },
  { name: 'قرمز', brand: '239 68 68', brand600: '220 38 38' },
  { name: 'آبی آسمانی', brand: '14 165 233', brand600: '2 132 199' },
];

const Section = ({ title, desc, icon: Icon, children, onSave, saveLabel = 'ذخیره تغییرات' }) => {
  const toast = useToast();
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-500/10 text-brand-500">
          <Icon size={20} />
        </span>
        <div>
          <h3 className="font-morabba font-bold text-base text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <div className="mt-5 space-y-4">{children}</div>
      <Button
        className="mt-6"
        onClick={() => {
          onSave?.();
          toast.success('تنظیمات ذخیره شد', title);
        }}
      >
        <Save size={17} />
        {saveLabel}
      </Button>
    </div>
  );
};

const Row = ({ children }) => <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;

export default function Settings() {
  const [store, setStore] = useState({
    name: 'کفشینو',
    slogan: 'قدم‌هایت را لوکس کن',
    phone: '۰۲۱-۹۱۰۰۴۵۶۷',
    email: 'info@kafshino.ir',
    address: 'تهران، خیابان ولیعصر، مرکز خرید لوکس، طبقه ۳',
    instagram: '@kafshino',
    telegram: '@kafshino_shop',
  });

  const [payments, setPayments] = useState(() =>
    Object.fromEntries(PAYMENT_METHODS.map((p) => [p.id, true]))
  );

  const [shipping, setShipping] = useState(() =>
    Object.fromEntries(SHIPPING_METHODS.map((s) => [s.id, { enabled: true, price: s.price }]))
  );

  const [seo, setSeo] = useState({
    title: 'کفشینو | فروشگاه اینترنتی کفش',
    description: 'فروشگاه اینترنتی کفش؛ تجربه‌ای لوکس و مدرن از خرید کفش با گارانتی اصالت',
    keywords: 'کفش, کفش ورزشی, اسنیکر, خرید کفش, کفشینو',
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    captcha: true,
    adminAlert: true,
    session: 60,
  });

  const [appearance, setAppearance] = useState({ palette: PALETTES[0], theme: 'auto', radius: 16 });

  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  const applyPalette = (p) => {
    setAppearance((a) => ({ ...a, palette: p }));
    const root = document.documentElement;
    root.style.setProperty('--brand-500', p.brand);
    root.style.setProperty('--brand-600', p.brand600);
  };

  const set = (obj, setter) => (key, value) => setter((s) => ({ ...s, [key]: value }));

  const tab = (key, title, icon, content) => ({ key, label: title, icon, content });

  const tabs = [
    tab(
      'info',
      'اطلاعات فروشگاه',
      <Store size={16} />,
      <Section
        title="اطلاعات فروشگاه"
        desc="اطلاعات عمومی فروشگاه که در صفحات عمومی نمایش داده می‌شود"
        icon={Store}
        onSave={() => {}}
      >
        <Row>
          <Input label="نام فروشگاه" value={store.name} onChange={(e) => set(store, setStore)('name', e.target.value)} />
          <Input label="شعار فروشگاه" value={store.slogan} onChange={(e) => set(store, setStore)('slogan', e.target.value)} />
        </Row>
        <Row>
          <Input label="تلفن تماس" icon={Phone} value={store.phone} onChange={(e) => set(store, setStore)('phone', e.target.value)} />
          <Input label="ایمیل" type="email" icon={Mail} value={store.email} onChange={(e) => set(store, setStore)('email', e.target.value)} />
        </Row>
        <Input
          label="آدرس"
          icon={MapPin}
          value={store.address}
          onChange={(e) => set(store, setStore)('address', e.target.value)}
        />
        <Row>
          <Input label="اینستاگرام" icon={Instagram} value={store.instagram} onChange={(e) => set(store, setStore)('instagram', e.target.value)} />
          <Input label="تلگرام" icon={Send} value={store.telegram} onChange={(e) => set(store, setStore)('telegram', e.target.value)} />
        </Row>
      </Section>
    ),
    tab(
      'payment',
      'روش‌های پرداخت',
      <CreditCard size={16} />,
      <Section
        title="روش‌های پرداخت"
        desc="فعال یا غیرفعال کردن درگاه‌های پرداخت فروشگاه"
        icon={CreditCard}
        onSave={() => {}}
      >
        <div className="space-y-3">
          {PAYMENT_METHODS.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 p-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{p.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{p.description}</p>
              </div>
              <Switch checked={payments[p.id]} onChange={(v) => setPayments((s) => ({ ...s, [p.id]: v }))} />
            </div>
          ))}
        </div>
      </Section>
    ),
    tab(
      'shipping',
      'حمل و نقل',
      <Truck size={16} />,
      <Section
        title="روش‌های ارسال"
        desc="فعال‌سازی روش‌ها و ویرایش هزینه ارسال سفارش‌ها"
        icon={Truck}
        onSave={() => {}}
      >
        <div className="space-y-3">
          {SHIPPING_METHODS.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 p-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{s.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <Input
                  className="w-32"
                  type="number"
                  value={shipping[s.id].price}
                  onChange={(e) =>
                    setShipping((st) => ({
                      ...st,
                      [s.id]: { ...st[s.id], price: Number(e.target.value) || 0 },
                    }))
                  }
                />
                <Switch
                  checked={shipping[s.id].enabled}
                  onChange={(v) =>
                    setShipping((st) => ({ ...st, [s.id]: { ...st[s.id], enabled: v } }))
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          هزینه‌ها به تومان ثبت می‌شوند؛ ارسال رایگان بالای {formatToman(5000000)} اعمال می‌شود.
        </p>
      </Section>
    ),
    tab(
      'seo',
      'سئو',
      <Search size={16} />,
      <Section
        title="تنظیمات سئو"
        desc="بهبود رتبه‌بندی فروشگاه در موتورهای جستجو"
        icon={Search}
        onSave={() => {}}
      >
        <Input
          label="عنوان صفحه"
          icon={Globe}
          value={seo.title}
          onChange={(e) => set(seo, setSeo)('title', e.target.value)}
        />
        <label className="label-app">توضیحات متا</label>
        <textarea
          className="input-app min-h-24 resize-y"
          value={seo.description}
          onChange={(e) => set(seo, setSeo)('description', e.target.value)}
        />
        <Input
          label="کلمات کلیدی"
          value={seo.keywords}
          onChange={(e) => set(seo, setSeo)('keywords', e.target.value)}
          hint="با ویرگول جدا کنید"
        />
      </Section>
    ),
    tab(
      'security',
      'امنیت',
      <ShieldCheck size={16} />,
      <Section
        title="امنیت حساب و پنل"
        desc="پیکربندی امنیت ورود و هشدارهای پنل مدیریت"
        icon={ShieldCheck}
        onSave={() => {}}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">ورود دو مرحله‌ای</p>
              <p className="mt-0.5 text-xs text-muted-foreground">ارسال کد تایید پیامکی هنگام ورود</p>
            </div>
            <Switch checked={security.twoFactor} onChange={(v) => set(security, setSecurity)('twoFactor', v)} />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">کپچای فرم‌ها</p>
              <p className="mt-0.5 text-xs text-muted-foreground">محافظت فرم‌ها در برابر ربات‌ها</p>
            </div>
            <Switch checked={security.captcha} onChange={(v) => set(security, setSecurity)('captcha', v)} />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">هشدار ورود به پنل</p>
              <p className="mt-0.5 text-xs text-muted-foreground">اعلان هنگام ورود ادمین‌ها</p>
            </div>
            <Switch checked={security.adminAlert} onChange={(v) => set(security, setSecurity)('adminAlert', v)} />
          </div>
          <Input
            label="مدت زمان نشست (دقیقه)"
            type="number"
            value={security.session}
            onChange={(e) => set(security, setSecurity)('session', Number(e.target.value))}
          />
          <div className="rounded-2xl bg-muted/30 p-4">
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <KeyRound size={16} className="text-brand-500" />
              تغییر رمز عبور
            </p>
            <div className="space-y-4">
              <Input
                label="رمز فعلی"
                type="password"
                icon={Lock}
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
              />
              <Row>
                <Input
                  label="رمز جدید"
                  type="password"
                  icon={Lock}
                  value={passwords.next}
                  onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                />
                <Input
                  label="تکرار رمز جدید"
                  type="password"
                  icon={Lock}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                />
              </Row>
            </div>
          </div>
        </div>
      </Section>
    ),
    tab(
      'appearance',
      'ظاهر',
      <Palette size={16} />,
      <Section
        title="رنگ و ظاهر پنل"
        desc="انتخاب رنگ اصلی برند و پوسته پیش‌فرض"
        icon={Palette}
        onSave={() => {}}
        saveLabel="اعمال و ذخیره"
      >
        <p className="label-app">رنگ اصلی برند</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {PALETTES.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPalette(p)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-all',
                appearance.palette.name === p.name ? 'border-brand-500 bg-brand-500/5' : 'border-border hover:border-brand-500/50'
              )}
            >
              <span
                className="h-9 w-9 rounded-xl shadow-sm"
                style={{ background: `linear-gradient(135deg, rgb(${p.brand}), rgb(${p.brand600}))` }}
              />
              <span className="text-[10px] text-muted-foreground">{p.name}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-border/70 p-4">
          <div>
            <p className="text-sm font-semibold text-foreground">پوسته پیش‌فرض</p>
            <p className="mt-0.5 text-xs text-muted-foreground">تم پیش‌فرض نمایش پنل</p>
          </div>
          <select
            value={appearance.theme}
            onChange={(e) => set(appearance, setAppearance)('theme', e.target.value)}
            className="input-app w-36 cursor-pointer"
          >
            <option value="auto">همراه با سیستم</option>
            <option value="light">روشن</option>
            <option value="dark">تیره</option>
          </select>
        </div>
        <div>
          <label className="label-app">گردی گوشه‌ها (پیکسل)</label>
          <input
            type="range"
            min={8}
            max={24}
            value={appearance.radius}
            onChange={(e) => set(appearance, setAppearance)('radius', Number(e.target.value))}
            className="w-full accent-brand-600"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            مقدار فعلی: {toFaDigits(appearance.radius)} پیکسل
          </p>
        </div>
      </Section>
    ),
  ];

  return (
    <div>
      <PageHeader
        title="تنظیمات فروشگاه"
        subtitle="پیکربندی اطلاعات، پرداخت، ارسال، سئو و امنیت کفشینو"
      />
      <div className="card-elevated p-5">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
}
