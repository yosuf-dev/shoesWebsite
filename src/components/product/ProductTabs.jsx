import { Truck, RotateCcw, ShieldCheck, CreditCard, Wallet, Banknote } from 'lucide-react';
import Tabs from '../ui/Tabs';
import ReviewSection from './ReviewSection';
import Badge from '../ui/Badge';
import { toFaDigits } from '../../utils/format';

function DescriptionTab({ product }) {
  return (
    <div className="space-y-5">
      <p className="text-sm leading-8 text-muted-foreground">{product.description}</p>
      <div>
        <h4 className="mb-3 font-morabba font-semibold text-lg text-foreground">ویژگی‌های کلیدی</h4>
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {Object.entries(product.specs || {}).slice(0, 6).map(([key, value]) => (
            <li key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gradient" />
              {key}: <span className="font-medium text-foreground">{value}</span>
            </li>
          ))}
        </ul>
      </div>
      {product.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((t) => (
            <Badge key={t} variant="muted">{t}</Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function SpecsTab({ product }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70">
      <table className="data-table">
        <tbody>
          {Object.entries(product.specs || {}).map(([key, value], i) => (
            <tr key={key} className={i % 2 === 0 ? 'bg-muted/25' : ''}>
              <td className="!py-4 px-5 font-medium text-muted-foreground whitespace-nowrap">{key}</td>
              <td className="!py-4 px-5 text-foreground">{value}</td>
            </tr>
          ))}
          <tr>
            <td className="!py-4 px-5 font-medium text-muted-foreground whitespace-nowrap">دسته‌بندی</td>
            <td className="!py-4 px-5 text-foreground">{product.category.name}</td>
          </tr>
          <tr>
            <td className="!py-4 px-5 font-medium text-muted-foreground whitespace-nowrap">دسته‌بندی جنسیت</td>
            <td className="!py-4 px-5 text-foreground">
              {product.gender === 'men' ? 'مردانه' : product.gender === 'women' ? 'زنانه' : product.gender === 'kids' ? 'بچه‌گانه' : 'یونیسکس'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ShippingTab() {
  const items = [
    { icon: Truck, title: 'ارسال سریع', text: 'سفارش‌های اکسپرس ۱ تا ۲ روز کاری و سفارش‌های عادی ۳ تا ۵ روز کاری تحویل داده می‌شوند.' },
    { icon: RotateCcw, title: 'ضمانت بازگشت', text: 'تا ۷ روز کاری پس از تحویل و در صورت سالم بودن کالا، امکان مرجوعی و بازگشت وجه وجود دارد.' },
    { icon: ShieldCheck, title: 'ضمانت اصالت', text: 'تمام محصولات دارای گارانتی اصالت کفشینو و ۶ ماه ضمانت تعویض هستند.' },
    { icon: CreditCard, title: 'پرداخت امن', text: 'پرداخت آنلاین امن با زرین‌پال، پرداخت با کیف پول کفشینو و پرداخت در محل تحویل.' },
    { icon: Wallet, title: 'کیف پول کفشینو', text: 'با اعتبار کیف پول خود پرداخت کنید و از تخفیف‌های ویژه استفاده کنید.' },
    { icon: Banknote, title: 'پرداخت در محل', text: 'امکان پرداخت نقدی هنگام تحویل سفارش در سراسر کشور.' },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ icon: Icon, title, text }) => (
        <div key={title} className="rounded-2xl border border-border/60 bg-surface p-5">
          <span className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
            <Icon size={21} strokeWidth={2} />
          </span>
          <h4 className="mb-1.5 font-morabba font-semibold text-base text-foreground">{title}</h4>
          <p className="text-sm leading-7 text-muted-foreground">{text}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * تب‌های محصول — توضیحات، مشخصات، نظرات و ارسال/بازگشت
 */
export default function ProductTabs({ product }) {
  const tabs = [
    { label: 'توضیحات', content: <DescriptionTab product={product} /> },
    { label: 'مشخصات', content: <SpecsTab product={product} /> },
    { label: `نظرات (${toFaDigits(product.reviewCount || 0)})`, content: <ReviewSection product={product} /> },
    { label: 'ارسال و بازگشت', content: <ShippingTab /> },
  ];

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-softer sm:p-8">
      <Tabs tabs={tabs} />
    </div>
  );
}
