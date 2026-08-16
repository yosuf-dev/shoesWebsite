import { LayoutGrid, Rows3, SlidersHorizontal } from 'lucide-react';
import Select from '../ui/Select';
import { toFaDigits } from '../../utils/format';

const SORT_OPTIONS = [
  { value: 'default', label: 'پیشنهاد کفشینو' },
  { value: 'newest', label: 'جدیدترین' },
  { value: 'best-seller', label: 'پرفروش‌ترین' },
  { value: 'rating', label: 'بیشترین امتیاز' },
  { value: 'cheap', label: 'ارزان‌ترین' },
  { value: 'expensive', label: 'گران‌ترین' },
  { value: 'discount', label: 'بیشترین تخفیف' },
];

export default function ProductToolbar({
  total,
  sort,
  onSort,
  cols,
  onCols,
  onOpenFilters,
  className = '',
}) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenFilters}
          className="flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-brand-500 lg:hidden"
        >
          <SlidersHorizontal size={16} className="text-brand-500" />
          فیلترها
        </button>
        <p className="text-sm text-muted-foreground">
          <span className="font-morabba font-bold text-foreground">{toFaDigits(total)}</span> محصول یافت شد
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-48">
          <Select
            value={sort}
            onChange={(e) => onSort(e.target.value)}
            options={SORT_OPTIONS}
            placeholder=""
            className="!h-10"
          />
        </div>
        <div className="hidden items-center rounded-xl border border-border bg-card p-1 sm:flex">
          {[
            { key: 4, icon: LayoutGrid },
            { key: 5, icon: Rows3 },
          ].map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onCols(key)}
              className={`grid h-8 w-8 place-items-center rounded-lg transition-all ${
                cols === key
                  ? 'bg-brand-gradient text-white shadow-glow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label={`چیدمان ${toFaDigits(key)} ستونه`}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
