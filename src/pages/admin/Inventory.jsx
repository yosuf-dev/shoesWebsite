import { useMemo, useState } from 'react';
import { Search, Minus, Plus, AlertTriangle, Boxes, PackageX, PackageCheck } from 'lucide-react';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import ProductImage from '../../components/ui/ProductImage';
import { PageHeader } from '../../layouts/AdminLayout';
import { useToast } from '../../contexts/ToastContext';
import { PRODUCTS } from '../../data/mockData';
import { cn, toFaDigits, formatToman } from '../../utils/format';

const LOW_STOCK_THRESHOLD = 7;

export default function Inventory() {
  const toast = useToast();
  const [rows, setRows] = useState(PRODUCTS.map((p) => ({ ...p, stock: p.stock })));
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((p) => !q || p.name.toLowerCase().includes(q) || p.sku?.includes(q) || p.slug.includes(q));
  }, [rows, search]);

  const adjust = (id, delta) => {
    setRows((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
    );
  };

  const setExact = (id, value) => {
    const num = Math.max(0, Number(value) || 0);
    setRows((prev) => prev.map((p) => (p.id === id ? { ...p, stock: num } : p)));
    const p = rows.find((x) => x.id === id);
    if (p) toast.success('موجودی به‌روزرسانی شد', p.name);
  };

  const lowCount = rows.filter((p) => p.stock <= LOW_STOCK_THRESHOLD && p.stock > 0).length;
  const outCount = rows.filter((p) => p.stock === 0).length;
  const totalUnits = rows.reduce((s, p) => s + p.stock, 0);

  const cards = [
    { label: 'کل محصولات', value: rows.length, icon: Boxes, color: 'text-brand-500 bg-brand-500/10' },
    { label: 'هشدار موجودی کم', value: lowCount, icon: AlertTriangle, color: 'text-accent-500 bg-accent-500/10' },
    { label: 'ناموجود', value: outCount, icon: PackageX, color: 'text-red-500 bg-red-500/10' },
    { label: 'مجموع موجودی', value: totalUnits, icon: PackageCheck, color: 'text-emerald-500 bg-emerald-500/10' },
  ];

  const skuOf = (p) => `KFN-${String(p.id).padStart(4, '0')}`;

  return (
    <div>
      <PageHeader title="مدیریت موجودی" subtitle="کنترل موجودی انبار و هشدارهای کم‌موجودی" />

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card-elevated flex items-center gap-4 p-4">
            <span className={cn('grid h-11 w-11 place-items-center rounded-2xl', c.color)}>
              <c.icon size={20} />
            </span>
            <div>
              <p className="font-morabba font-bold text-xl text-foreground">{toFaDigits(c.value)}</p>
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card-elevated p-5">
        <Input
          className="w-full sm:w-72"
          icon={Search}
          placeholder="جستجوی محصول..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mt-4 overflow-x-auto">
          {filtered.length === 0 ? (
            <EmptyState icon="search" title="محصولی یافت نشد" />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>محصول</th>
                  <th>SKU</th>
                  <th>قیمت</th>
                  <th className="w-64">موجودی</th>
                  <th>وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const low = p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD;
                  const out = p.stock === 0;
                  return (
                    <tr key={p.id} className={cn((low || out) && 'bg-red-500/[0.04]')}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted/40">
                            <ProductImage product={p} className="h-full w-full" />
                          </div>
                          <div>
                            <p className={cn('font-medium', out ? 'text-muted-foreground' : 'text-foreground')}>
                              {p.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{p.brand.name}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="rounded-lg bg-muted/50 px-2 py-1 font-mono text-xs text-muted-foreground">
                          {skuOf(p)}
                        </span>
                      </td>
                      <td className="font-morabba font-bold text-foreground">{formatToman(p.price)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => adjust(p.id, -1)}
                            disabled={p.stock <= 0}
                            className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:border-brand-500 hover:text-brand-500 disabled:opacity-30"
                            aria-label="کاهش"
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            value={p.stock}
                            onChange={(e) => setExact(p.id, e.target.value)}
                            className="h-9 w-16 rounded-lg border border-border bg-surface text-center font-dana font-bold text-foreground outline-none transition-colors focus:border-brand-500"
                            aria-label="موجودی"
                          />
                          <button
                            onClick={() => adjust(p.id, 1)}
                            className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:border-brand-500 hover:text-brand-500"
                            aria-label="افزایش"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </td>
                      <td>
                        {out ? (
                          <Badge variant="danger">
                            <PackageX size={13} />
                            ناموجود
                          </Badge>
                        ) : low ? (
                          <Badge variant="warning">
                            <AlertTriangle size={13} />
                            کم‌موجودی
                          </Badge>
                        ) : (
                          <Badge variant="success">
                            <PackageCheck size={13} />
                            موجود
                          </Badge>
                        )}
                        <span className={cn('ms-2 text-sm font-bold', low || out ? 'text-red-500' : 'text-foreground')}>
                          {toFaDigits(p.stock)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
