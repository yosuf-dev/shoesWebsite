import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, Trash2, Eye, ShoppingBag } from 'lucide-react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import StatusBadge from '../../components/ui/StatusBadge';
import Checkbox from '../../components/ui/Checkbox';
import Dropdown, { DropdownItem } from '../../components/ui/Dropdown';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import { PageHeader } from '../../layouts/AdminLayout';
import { useToast } from '../../contexts/ToastContext';
import { ORDERS } from '../../data/mockData';
import { ORDER_STATUS, PAYMENT_METHODS } from '../../constants/config';
import { cn, toFaDigits, formatToman, formatFaDate } from '../../utils/format';

const STATUS_KEYS = Object.keys(ORDER_STATUS);
const PER_PAGE = 6;

const paymentLabel = (id) => PAYMENT_METHODS.find((p) => p.id === id)?.label || id;

const FILTERS = [{ key: 'all', label: 'همه سفارش‌ها' }, ...STATUS_KEYS.map((k) => ({ key: k, label: ORDER_STATUS[k].label }))];

export default function Orders() {
  const toast = useToast();
  const [rows, setRows] = useState(ORDERS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [bulkStatus, setBulkStatus] = useState('');
  const [deleteTargets, setDeleteTargets] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((o) => {
      const matchFilter = filter === 'all' || o.status === filter;
      const matchQ = !q || o.id.toLowerCase().includes(q) || o.userName.toLowerCase().includes(q);
      return matchFilter && matchQ;
    });
  }, [rows, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const toggleAll = (checked) => setSelected(checked ? pageRows.map((o) => o.id) : []);
  const toggleOne = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const changeStatus = (id, status) => {
    setRows((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success('وضعیت سفارش تغییر کرد', `${id} → ${ORDER_STATUS[status].label}`);
  };

  const applyBulkStatus = () => {
    if (!bulkStatus) return;
    setRows((prev) => prev.map((o) => (selected.includes(o.id) ? { ...o, status: bulkStatus } : o)));
    toast.success(`وضعیت ${toFaDigits(selected.length)} سفارش تغییر کرد`);
    setSelected([]);
    setBulkStatus('');
  };

  const confirmBulkDelete = () => {
    setRows((prev) => prev.filter((o) => !deleteTargets.includes(o.id)));
    setSelected([]);
    setConfirmDelete(false);
    toast.success(`${toFaDigits(deleteTargets.length)} سفارش حذف شد`);
  };

  const countFor = (key) => (key === 'all' ? rows.length : rows.filter((o) => o.status === key).length);

  return (
    <div>
      <PageHeader
        title="مدیریت سفارش‌ها"
        subtitle={`${toFaDigits(rows.length)} سفارش ثبت‌شده در فروشگاه`}
        actions={
          <Badge variant="brand" className="px-3 py-1.5">
            <ShoppingBag size={14} />
            {toFaDigits(rows.length)} سفارش
          </Badge>
        }
      />

      <div className="card-elevated p-5">
        <div className="flex flex-wrap gap-1 overflow-x-auto pb-3">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilter(f.key);
                setPage(1);
              }}
              className={cn(
                'flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-all',
                filter === f.key
                  ? 'bg-brand-gradient text-white shadow-glow-sm'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              )}
            >
              {f.label}
              <span className={cn('rounded-full px-1.5 text-[11px]', filter === f.key ? 'bg-white/20' : 'bg-muted')}>
                {toFaDigits(countFor(f.key))}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Input
            className="w-full sm:w-64"
            icon={Search}
            placeholder="جستجوی شماره سفارش یا مشتری..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          {selected.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Select
                className="w-40"
                placeholder="تغییر وضعیت گروهی"
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                options={STATUS_KEYS.map((k) => ({ value: k, label: ORDER_STATUS[k].label }))}
              />
              <Button size="sm" onClick={applyBulkStatus}>
                اعمال
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  setDeleteTargets(selected);
                  setConfirmDelete(true);
                }}
              >
                <Trash2 size={15} />
                حذف ({toFaDigits(selected.length)})
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 overflow-x-auto">
          {pageRows.length === 0 ? (
            <EmptyState
              icon="search"
              title="سفارشی یافت نشد"
              description="فیلتر یا عبارت جستجو را تغییر دهید."
            />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-12">
                    <Checkbox checked={selected.length === pageRows.length && pageRows.length > 0} onChange={toggleAll} />
                  </th>
                  <th>شماره سفارش</th>
                  <th>مشتری</th>
                  <th>تاریخ</th>
                  <th>اقلام</th>
                  <th>مبلغ</th>
                  <th>پرداخت</th>
                  <th>وضعیت</th>
                  <th className="text-left">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((o) => (
                  <tr key={o.id} className={cn(selected.includes(o.id) && 'bg-brand-500/5')}>
                    <td>
                      <Checkbox checked={selected.includes(o.id)} onChange={() => toggleOne(o.id)} />
                    </td>
                    <td>
                      <Link
                        to={`/admin/orders/${o.id}`}
                        className="font-medium text-brand-600 transition-colors hover:text-brand-500 dark:text-brand-300"
                      >
                        {o.id}
                      </Link>
                    </td>
                    <td className="text-foreground">{o.userName}</td>
                    <td className="text-muted-foreground">{formatFaDate(o.date)}</td>
                    <td className="text-foreground">{toFaDigits(o.items)} قلم</td>
                    <td className="font-morabba font-bold text-foreground">{formatToman(o.total)}</td>
                    <td>
                      <span className="text-xs text-muted-foreground">{paymentLabel(o.payment)}</span>
                    </td>
                    <td>
                      <Dropdown
                        trigger={
                          <button className="flex items-center gap-1.5 rounded-xl px-2 py-1 transition-colors hover:bg-muted/40">
                            <StatusBadge status={o.status} />
                            <ChevronDown size={14} className="text-muted-foreground" />
                          </button>
                        }
                      >
                        {({ close }) => (
                          <div className="w-44">
                            {STATUS_KEYS.map((k) => (
                              <DropdownItem
                                key={k}
                                active={k === o.status}
                                onClick={() => {
                                  changeStatus(o.id, k);
                                  close();
                                }}
                              >
                                {ORDER_STATUS[k].label}
                              </DropdownItem>
                            ))}
                          </div>
                        )}
                      </Dropdown>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/orders/${o.id}`}
                          className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-brand-500/10 hover:text-brand-600"
                          aria-label="جزئیات"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => {
                            setDeleteTargets([o.id]);
                            setConfirmDelete(true);
                          }}
                          className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                          aria-label="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            نمایش {toFaDigits((safePage - 1) * PER_PAGE + 1)} تا {toFaDigits(Math.min(safePage * PER_PAGE, filtered.length))} از {toFaDigits(filtered.length)} سفارش
          </p>
          <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="حذف سفارش"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
              انصراف
            </Button>
            <Button variant="danger" onClick={confirmBulkDelete}>
              حذف
            </Button>
          </>
        }
      >
        <p className="text-sm leading-7 text-muted-foreground">
          آیا از حذف {toFaDigits(deleteTargets.length)} سفارش مطمئن هستید؟ این عملیات قابل بازگشت نیست.
        </p>
      </Modal>
    </div>
  );
}
