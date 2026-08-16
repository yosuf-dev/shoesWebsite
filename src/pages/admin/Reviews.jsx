import { useMemo, useState } from 'react';
import { Search, Check, X, Trash2, MessageSquareReply, Star } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Rating from '../../components/ui/Rating';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import ProductImage from '../../components/ui/ProductImage';
import { PageHeader } from '../../layouts/AdminLayout';
import { useToast } from '../../contexts/ToastContext';
import { PRODUCTS, getProductReviews } from '../../data/mockData';
import { cn, toFaDigits, formatFaDate } from '../../utils/format';

const seed = PRODUCTS.slice(0, 6).flatMap((p, pi) =>
  getProductReviews(p.id).slice(0, 3).map((r, i) => ({
    ...r,
    product: p,
    status: (pi + i) % 3 === 0 ? 'pending' : (pi + i) % 4 === 0 ? 'rejected' : 'approved',
  }))
);

const STATUS_META = {
  approved: { label: 'تاییدشده', variant: 'success' },
  pending: { label: 'در انتظار بررسی', variant: 'warning' },
  rejected: { label: 'ردشده', variant: 'danger' },
};

const FILTERS = [
  { key: 'all', label: 'همه نظرات' },
  { key: 'pending', label: 'در انتظار بررسی' },
  { key: 'approved', label: 'تاییدشده' },
  { key: 'rejected', label: 'ردشده' },
];

export default function Reviews() {
  const toast = useToast();
  const [rows, setRows] = useState(seed);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const matchFilter = filter === 'all' || r.status === filter;
      const matchQ = !q || r.author.includes(search.trim()) || r.product.name.includes(search.trim());
      return matchFilter && matchQ;
    });
  }, [rows, filter, search]);

  const setStatus = (id, status) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    const label = STATUS_META[status].label;
    toast.success(`نظر ${label} شد`);
  };

  const remove = () => {
    setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success('نظر حذف شد');
  };

  const sendReply = () => {
    toast.success('پاسخ شما ثبت شد', replyTarget.product.name);
    setReplyTarget(null);
    setReplyText('');
  };

  const pending = rows.filter((r) => r.status === 'pending').length;

  return (
    <div>
      <PageHeader
        title="مدیریت نظرات"
        subtitle="بررسی و تایید نظرات کاربران درباره محصولات"
        actions={
          pending > 0 ? (
            <Badge variant="warning" className="px-3 py-1.5">
              <Star size={14} />
              {toFaDigits(pending)} نظر در انتظار بررسی
            </Badge>
          ) : null
        }
      />

      <div className="card-elevated p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            className="w-full sm:w-64"
            icon={Search}
            placeholder="جستجوی نظر یا محصول..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  'rounded-xl px-3 py-2 text-xs font-medium transition-all',
                  filter === f.key
                    ? 'bg-brand-gradient text-white shadow-glow-sm'
                    : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {filtered.length === 0 ? (
            <EmptyState icon="search" title="نظری یافت نشد" />
          ) : (
            filtered.map((r) => {
              const meta = STATUS_META[r.status];
              return (
                <div key={r.id} className="rounded-2xl border border-border/70 bg-surface p-4">
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted/40">
                      <ProductImage product={r.product} className="h-full w-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-medium text-foreground">{r.product.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {r.author} — {formatFaDate(r.date)}
                          </p>
                        </div>
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Rating value={r.rating} showValue={false} size={14} />
                        <span className="text-sm font-semibold text-foreground">{toFaDigits(r.rating)}</span>
                        <span className="text-xs text-muted-foreground">{r.title}</span>
                      </div>
                      <p className="mt-2 rounded-2xl bg-muted/30 p-3 text-sm leading-7 text-muted-foreground">
                        {r.text}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {r.status !== 'approved' && (
                          <Button size="xs" onClick={() => setStatus(r.id, 'approved')}>
                            <Check size={14} />
                            تایید
                          </Button>
                        )}
                        {r.status !== 'rejected' && (
                          <Button size="xs" variant="danger" onClick={() => setStatus(r.id, 'rejected')}>
                            <X size={14} />
                            رد
                          </Button>
                        )}
                        <Button size="xs" variant="secondary" onClick={() => setReplyTarget(r)}>
                          <MessageSquareReply size={14} />
                          پاسخ
                        </Button>
                        <Button size="xs" variant="ghost" onClick={() => setDeleteTarget(r)}>
                          <Trash2 size={14} />
                          حذف
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Modal
        open={replyTarget !== null}
        onClose={() => setReplyTarget(null)}
        title="پاسخ به نظر"
        footer={
          <>
            <Button variant="secondary" onClick={() => setReplyTarget(null)}>
              انصراف
            </Button>
            <Button onClick={sendReply} disabled={!replyText.trim()}>
              <MessageSquareReply size={16} />
              ارسال پاسخ
            </Button>
          </>
        }
      >
        {replyTarget && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-muted/30 p-3.5">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                {replyTarget.author}
                <Rating value={replyTarget.rating} showValue={false} size={13} />
              </p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{replyTarget.text}</p>
            </div>
            <label className="label-app">متن پاسخ</label>
            <textarea
              className="input-app min-h-28 resize-y"
              placeholder="پاسخ خود را بنویسید..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </div>
        )}
      </Modal>

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="حذف نظر"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              انصراف
            </Button>
            <Button variant="danger" onClick={remove}>
              حذف
            </Button>
          </>
        }
      >
        <p className="text-sm leading-7 text-muted-foreground">
          آیا از حذف این نظر مطمئن هستید؟ این عملیات قابل بازگشت نیست.
        </p>
      </Modal>
    </div>
  );
}
