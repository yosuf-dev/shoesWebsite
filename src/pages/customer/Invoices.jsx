import { Link } from 'react-router-dom';
import { Download, Printer, FileText } from 'lucide-react';
import PageHeader from '../../components/customer/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { useToast } from '../../contexts/ToastContext';
import { ORDERS, getProductById } from '../../data/mockData';
import { formatToman, formatFaDate, toFaDigits } from '../../utils/format';

const PAYMENT_LABELS = {
  zarinpal: 'زرین‌پال',
  wallet: 'کیف پول',
  cod: 'پرداخت در محل',
};

export default function Invoices() {
  const toast = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (order) => {
    const items = order.itemsList.map(getProductById).filter(Boolean);
    const rows = items
      .map(
        (p) =>
          `<tr><td>${p.name}</td><td>${p.brand?.name || '—'}</td><td>۱</td><td>${formatToman(p.price)}</td></tr>`
      )
      .join('');

    const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8" />
<title>فاکتور ${order.id}</title>
<style>
  body { font-family: Tahoma, sans-serif; max-width: 700px; margin: 40px auto; color: #0f172a; }
  h1 { color: #4f46e5; text-align: center; }
  table { width: 100%; border-collapse: collapse; margin-top: 24px; }
  th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: right; }
  th { background: #eef2ff; }
  .meta { display: flex; justify-content: space-between; margin-top: 16px; color: #475569; }
  .total { text-align: left; font-weight: bold; margin-top: 16px; }
</style>
</head>
<body>
  <h1>کفشینو — فاکتور رسمی فروش</h1>
  <div class="meta"><span>شماره فاکتور: ${order.id}</span><span>تاریخ: ${formatFaDate(order.date)}</span></div>
  <div class="meta"><span>نام خریدار: ${order.userName}</span><span>روش پرداخت: ${PAYMENT_LABELS[order.payment] || order.payment}</span></div>
  <table>
    <thead><tr><th>نام محصول</th><th>برند</th><th>تعداد</th><th>مبلغ</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p class="total">مبلغ نهایی: ${formatToman(order.total)}</p>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('فاکتور دانلود شد', `فاکتور ${order.id}`);
  };

  return (
    <div>
      <PageHeader
        eyebrow="فاکتورها"
        title="فاکتورهای خرید"
        description="فاکتور تمام سفارش‌های خود را دانلود یا چاپ کنید."
      />

      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>شماره فاکتور</th>
                <th>تاریخ</th>
                <th>تعداد اقلام</th>
                <th>مبلغ</th>
                <th>روش پرداخت</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {ORDERS.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link
                      to={`/panel/orders/${order.id}`}
                      className="font-semibold text-brand-600 dark:text-brand-300"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td>{formatFaDate(order.date)}</td>
                  <td>{toFaDigits(order.items)} کالا</td>
                  <td className="font-morabba font-bold text-foreground">
                    {formatToman(order.total)}
                  </td>
                  <td>{PAYMENT_LABELS[order.payment] || order.payment}</td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Button size="xs" variant="secondary" icon={Download} onClick={() => handleDownload(order)}>
                        دانلود
                      </Button>
                      <Button size="xs" variant="ghost" icon={Printer} onClick={handlePrint}>
                        چاپ
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border/60 bg-surface p-5 text-sm">
        <FileText size={20} className="mt-0.5 shrink-0 text-brand-500" />
        <p className="leading-7 text-muted-foreground">
          فاکتورهای دانلودشده دارای مهر و امضای دیجیتال نیستند. برای دریافت فاکتور رسمی با مهر
          شرکت، با پشتیبانی کفشینو در تماس باشید.
        </p>
      </div>
    </div>
  );
}
