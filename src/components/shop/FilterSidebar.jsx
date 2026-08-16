import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, X, RotateCcw, SlidersHorizontal, Search,
} from 'lucide-react';
import Checkbox from '../ui/Checkbox';
import { CATEGORIES, BRANDS } from '../../data/mockData';
import { GENDERS, SIZES } from '../../constants/config';
import { toFaDigits, cn } from '../../utils/format';

const COLORS = [
  { name: 'آبی', hex: '#4f46e5' },
  { name: 'مشکی', hex: '#0f172a' },
  { name: 'سفید', hex: '#f8fafc' },
  { name: 'قرمز', hex: '#dc2626' },
  { name: 'صورتی', hex: '#e11d48' },
  { name: 'بنفش', hex: '#7c3aed' },
  { name: 'سبز', hex: '#059669' },
  { name: 'نارنجی', hex: '#ea580c' },
  { name: 'زرد', hex: '#f59e0b' },
  { name: 'آبی آسمانی', hex: '#0284c7' },
  { name: 'طلایی', hex: '#ca8a04' },
  { name: 'سرمه‌ای', hex: '#1e3a8a' },
];

const MATERIALS = ['چرم مصنوعی', 'پارچه مش', 'چرم طبیعی', 'لاستیک'];

function FilterGroup({ title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/60 py-4 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-right"
      >
        <span className="flex items-center gap-2 font-medium text-sm text-foreground">
          {Icon && <Icon size={16} className="text-brand-500" />}
          {title}
        </span>
        <ChevronDown
          size={16}
          className={cn('text-muted-foreground transition-transform duration-300', open && 'rotate-180')}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="pt-3.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FilterSidebar({ filters, onChange, onReset, activeCount }) {
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || '',
  });

  const toggle = (key, value) => {
    const current = filters[key] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const toggleSingle = (key, value) => {
    onChange({ ...filters, [key]: filters[key] === value ? undefined : value });
  };

  const applyPrice = () => {
    onChange({
      ...filters,
      minPrice: priceRange.min ? Number(priceRange.min) : undefined,
      maxPrice: priceRange.max ? Number(priceRange.max) : undefined,
    });
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-softer">
      <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-4">
        <span className="flex items-center gap-2 font-morabba font-bold text-lg text-foreground">
          <SlidersHorizontal size={18} className="text-brand-500" />
          فیلترها
        </span>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-medium text-red-500 transition-colors hover:text-red-600"
          >
            <RotateCcw size={13} />
            حذف همه ({toFaDigits(activeCount)})
          </button>
        )}
      </div>

      {/* قیمت */}
      <FilterGroup title="محدوده قیمت (تومان)" defaultOpen={true}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            placeholder="از"
            className="input-app h-9 !py-1.5 text-xs"
          />
          <span className="text-muted-foreground">—</span>
          <input
            type="number"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            placeholder="تا"
            className="input-app h-9 !py-1.5 text-xs"
          />
        </div>
        <button
          onClick={applyPrice}
          className="mt-2.5 w-full rounded-xl bg-muted/50 py-2 text-xs font-medium text-foreground transition-colors hover:bg-brand-500/10 hover:text-brand-600"
        >
          اعمال قیمت
        </button>
      </FilterGroup>

      {/* دسته‌بندی */}
      <FilterGroup title="دسته‌بندی">
        <div className="space-y-2.5">
          {CATEGORIES.map((c) => (
            <Checkbox
              key={c.id}
              checked={(filters.category || []).includes(c.slug)}
              onChange={() => toggle('category', c.slug)}
              label={c.name}
            />
          ))}
        </div>
      </FilterGroup>

      {/* برند */}
      <FilterGroup title="برند">
        <div className="max-h-52 space-y-2.5 overflow-y-auto pl-1">
          {BRANDS.map((b) => (
            <Checkbox
              key={b.id}
              checked={(filters.brand || []).includes(b.slug)}
              onChange={() => toggle('brand', b.slug)}
              label={b.name}
            />
          ))}
        </div>
      </FilterGroup>

      {/* جنسیت */}
      <FilterGroup title="جنسیت">
        <div className="space-y-2.5">
          {GENDERS.map((g) => (
            <Checkbox
              key={g.value}
              checked={(filters.gender || []).includes(g.value)}
              onChange={() => toggle('gender', g.value)}
              label={g.label}
            />
          ))}
        </div>
      </FilterGroup>

      {/* رنگ */}
      <FilterGroup title="رنگ">
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => {
            const selected = (filters.color || []).includes(c.hex);
            return (
              <button
                key={c.hex}
                onClick={() => toggle('color', c.hex)}
                title={c.name}
                className={cn(
                  'grid h-8 w-8 place-items-center rounded-full border-2 transition-all',
                  selected ? 'border-brand-600 scale-110 shadow-glow-sm' : 'border-border hover:scale-105'
                )}
                style={{ backgroundColor: c.hex }}
              >
                {selected && (
                  <span className={cn('grid h-full w-full place-items-center rounded-full', ['#ffffff', '#f8fafc'].includes(c.hex) ? 'text-slate-900' : 'text-white')}>
                    <X size={14} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* سایز */}
      <FilterGroup title="سایز">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => {
            const selected = (filters.size || []).includes(s);
            return (
              <button
                key={s}
                onClick={() => toggle('size', s)}
                className={cn(
                  'h-9 min-w-11 rounded-xl border px-2.5 text-xs font-medium transition-all',
                  selected
                    ? 'border-brand-600 bg-brand-gradient text-white shadow-glow-sm'
                    : 'border-border bg-surface text-foreground hover:border-brand-500'
                )}
              >
                {toFaDigits(s)}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* جنس */}
      <FilterGroup title="جنس رویه">
        <div className="space-y-2.5">
          {MATERIALS.map((m) => (
            <Checkbox
              key={m}
              checked={(filters.material || []).includes(m)}
              onChange={() => toggle('material', m)}
              label={m}
            />
          ))}
        </div>
      </FilterGroup>

      {/* وضعیت */}
      <FilterGroup title="وضعیت">
        <div className="space-y-2.5">
          <Checkbox
            checked={filters.availability === 'in-stock'}
            onChange={() => toggleSingle('availability', filters.availability === 'in-stock' ? undefined : 'in-stock')}
            label="فقط موجودی انبار"
          />
          <Checkbox
            checked={filters.discount}
            onChange={() => onChange({ ...filters, discount: !filters.discount })}
            label="فقط تخفیف‌دار"
          />
          <Checkbox
            checked={filters.newest}
            onChange={() => onChange({ ...filters, newest: !filters.newest })}
            label="فقط محصولات جدید"
          />
        </div>
      </FilterGroup>

      {/* جستجوی داخلی */}
      <FilterGroup title="جستجو در نتایج">
        <div className="relative">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="جستجو…"
            className="input-app h-9 !py-1.5 pr-9 text-xs"
          />
        </div>
      </FilterGroup>
    </div>
  );
}
