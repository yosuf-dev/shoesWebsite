import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Pencil, Trash2, ChevronUp, ChevronDown,
} from 'lucide-react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Checkbox from '../../components/ui/Checkbox';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import ProductImage from '../../components/ui/ProductImage';
import { PageHeader } from '../../layouts/AdminLayout';
import { useToast } from '../../contexts/ToastContext';
import { PRODUCTS, CATEGORIES, BRANDS } from '../../data/mockData';
import { cn, toFaDigits, formatToman, formatPercent, formatFaDate } from '../../utils/format';

const STATUS_META = {
  active: { label: 'فعال', variant: 'success' },
  draft: { label: 'پیش‌نویس', variant: 'muted' },
  out: { label: 'ناموجود', variant: 'danger' },
};

const withStatus = PRODUCTS.map((p) => {
  let status = 'active';
  if (p.stock === 0) status = 'out';
  else if (p.id % 5 === 0) status = 'draft';
  return { ...p, status };
});

const PER_PAGE = 8;

const SORTABLE = [
  { key: 'name', label: 'نام محصول' },
  { key: 'price', label: 'قیمت' },
  { key: 'stock', label: 'موجودی' },
  { key: 'discountPercent', label: 'تخفیف' },
];

export default function Products() {
  const toast = useToast();
  const [rows, setRows] = useState(withStatus);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' });
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkModal, setBulkModal] = useState(false);

  const toggleSort = (key) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((p) => {
      const matchQ =
        !q || p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
      const matchCat = !category || p.category.slug === category;
      const matchBrand = !brand || p.brand.slug === brand;
      const matchStatus = !status || p.status === status;
      return matchQ && matchCat && matchBrand && matchStatus;
    });
  }, [rows, search, category, brand, status]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const { key, dir } = sort;
    const mult = dir === 'asc' ? 1 : -1;
    arr.sort((a, b) => {
      if (key === 'price' || key === 'stock' || key === 'discountPercent') {
        return (a[key] - b[key]) * mult;
      }
      return String(a[key]).localeCompare(String(b[key]), 'fa') * mult;
    });
    return arr;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const toggleAll = (checked) => setSelected(checked ? pageRows.map((p) => p.id) : []);

  const toggleOne = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const deleteProducts = (ids) => {
    setRows((prev) => prev.filter((p) => !ids.includes(p.id)));
    setSelected([]);
    setDeleteTarget(null);
    toast.success(`${toFaDigits(ids.length)} محصول حذف شد`);
  };

  const setBulkStatus = (st) => {
    setRows((prev) => prev.map((p) => (selected.includes(p.id) ? { ...p, status: st } : p)));
    setSelected([]);
    setBulkModal(false);
    toast.success('وضعیت محصولات انتخابی به‌روزرسانی شد');
  };

  const skuOf = (p) => `KFN-${String(p.id).padStart(4, '0')}`;

  return (
    <div>
      <PageHeader
        title="مدیریت محصولات"
        subtitle={`${toFaDigits(rows.length)} محصول در فروشگاه`}
        actions={
          <Link to="/admin/products/new">
            <Button size="md">
              <Plus size={18} />
              افزودن محصول
            </Button>
          </Link>
        }
      />

      <div className="card-elevated p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            className="w-full sm:w-64"
            icon={Search}
            placeholder="جستجوی نام یا اسلاگ..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <Select
            className="w-full sm:w-44"
            placeholder="همه دسته‌ها"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            options={CATEGORIES.map((c) => ({ value: c.slug, label: c.name }))}
          />
          <Select
            className="w-full sm:w-44"
            placeholder="همه برندها"
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
              setPage(1);
            }}
            options={BRANDS.map((b) => ({ value: b.slug, label: b.name }))}
          />
          <Select
            className="w-full sm:w-40"
            placeholder="همه وضعیت‌ها"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'active', label: 'فعال' },
              { value: 'draft', label: 'پیش‌نویس' },
              { value: 'out', label: 'ناموجود' },
            ]}
          />
        </div>

        {selected.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-3.5">
            <p className="text-sm text-foreground">
              <span className="font-bold text-brand-600 dark:text-brand-300">{toFaDigits(selected.length)}</span> محصول انتخاب شده
            </p>
            <div className="ms-auto flex flex-wrap items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => setBulkStatus('active')}>
                فعال‌سازی
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setBulkStatus('draft')}>
                غیرفعال‌سازی
              </Button>
              <Button size="sm" variant="danger" onClick={() => setDeleteTarget('bulk')}>
                حذف انتخابی
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
                انصراف
              </Button>
            </div>
          </div>
        )}

        <div className="mt-4 overflow-x-auto">
          {pageRows.length === 0 ? (
            <EmptyState
              icon="search"
              title="محصولی یافت نشد"
              description="فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید."
            />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-12">
                    <Checkbox
                      checked={selected.length === pageRows.length && pageRows.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>محصول</th>
                  <th>SKU</th>
                  {SORTABLE.map((s) => (
                    <th key={s.key}>
                      <button
                        onClick={() => toggleSort(s.key)}
                        className="flex items-center gap-1 transition-colors hover:text-foreground"
                      >
                        {s.label}
                        {sort.key === s.key &&
                          (sort.dir === 'asc' ? (
                            <ChevronUp size={13} />
                          ) : (
                            <ChevronDown size={13} />
                          ))}
                      </button>
                    </th>
                  ))}
                  <th>وضعیت</th>
                  <th>تاریخ ایجاد</th>
                  <th className="text-left">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((p) => {
                  const meta = STATUS_META[p.status];
                  return (
                    <tr key={p.id} className={cn(selected.includes(p.id) && 'bg-brand-500/5')}>
                      <td>
                        <Checkbox checked={selected.includes(p.id)} onChange={() => toggleOne(p.id)} />
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted/40">
                            <ProductImage product={p} className="h-full w-full" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{p.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {p.brand.name} — {p.category.name}
                            </p>
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
                        <span className={cn(p.stock <= 7 ? 'font-bold text-red-500' : 'text-foreground')}>
                          {toFaDigits(p.stock)}
                        </span>
                      </td>
                      <td>
                        {p.discountPercent ? (
                          <Badge variant="warning">{formatPercent(p.discountPercent)}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td>
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                      </td>
                      <td className="text-muted-foreground">{formatFaDate(p.createdAt)}</td>
                      <td>
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/products/edit/${p.id}`}
                            className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-brand-500/10 hover:text-brand-600"
                            aria-label="ویرایش"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                            aria-label="حذف"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            نمایش {toFaDigits((safePage - 1) * PER_PAGE + 1)} تا {toFaDigits(Math.min(safePage * PER_PAGE, sorted.length))} از {toFaDigits(sorted.length)} محصول
          </p>
          <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="حذف محصول"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              انصراف
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteProducts(deleteTarget === 'bulk' ? selected : [deleteTarget.id])}
            >
              حذف
            </Button>
          </>
        }
      >
        <p className="text-sm leading-7 text-muted-foreground">
          آیا از حذف
          {deleteTarget === 'bulk'
            ? ` ${toFaDigits(selected.length)} محصول انتخابی`
            : ` محصول «${deleteTarget?.name}»`}
          {' '}مطمئن هستید؟ این عملیات قابل بازگشت نیست.
        </p>
      </Modal>
    </div>
  );
}
