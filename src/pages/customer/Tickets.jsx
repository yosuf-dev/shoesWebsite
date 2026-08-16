import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, MessageSquare, Send } from 'lucide-react';
import PageHeader from '../../components/customer/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { useToast } from '../../contexts/ToastContext';
import { TICKETS } from '../../data/mockData';
import { formatFaDate, toFaDigits } from '../../utils/format';

const STATUS_META = {
  open: { label: 'باز', variant: 'info' },
  answered: { label: 'پاسخ داده شده', variant: 'success' },
  closed: { label: 'بسته شده', variant: 'muted' },
};

const PRIORITY_META = {
  low: { label: 'کم', variant: 'muted' },
  medium: { label: 'متوسط', variant: 'warning' },
  high: { label: 'زیاد', variant: 'danger' },
};

const DEPARTMENTS = ['پشتیبانی فروش', 'راهنمایی خرید', 'بازگشت کالا', 'گارانتی', 'حساب کاربری'];

export default function Tickets() {
  const toast = useToast();
  const [tickets, setTickets] = useState(TICKETS);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setTickets((prev) => [
      {
        id: `TCK-${500 + prev.length + 1}`,
        subject: data.subject,
        status: 'open',
        priority: data.priority,
        date: new Date().toISOString().slice(0, 10),
        department: data.department,
        lastMessage: data.message,
      },
      ...prev,
    ]);
    setModalOpen(false);
    reset();
    toast.success('تیکت شما ثبت شد', 'پشتیبانی به‌زودی پاسخ خواهد داد.');
  };

  return (
    <div>
      <PageHeader
        eyebrow="پشتیبانی"
        title="تیکت‌های پشتیبانی"
        description="درخواست‌های پشتیبانی خود را ثبت و پیگیری کنید."
        action={
          <Button icon={Plus} onClick={() => setModalOpen(true)}>
            تیکت جدید
          </Button>
        }
      />

      {tickets.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="تیکتی ثبت نشده است"
          description="برای ارتباط با پشتیبانی، اولین تیکت خود را ثبت کنید."
          action={
            <Button icon={Plus} onClick={() => setModalOpen(true)} className="mt-2">
              ثبت تیکت
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {tickets.map((ticket) => {
            const status = STATUS_META[ticket.status] || STATUS_META.open;
            const priority = PRIORITY_META[ticket.priority] || PRIORITY_META.medium;
            return (
              <div
                key={ticket.id}
                className="card-elevated p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
                      <MessageSquare size={20} />
                    </span>
                    <div>
                      <h3 className="font-morabba font-semibold text-base text-foreground">
                        {ticket.subject}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {ticket.id} · {formatFaDate(ticket.date)} · {ticket.department}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-4 flex items-center gap-2">
                  <Badge variant={status.variant}>{status.label}</Badge>
                  <Badge variant={priority.variant}>اولویت {priority.label}</Badge>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{ticket.lastMessage}</p>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="ثبت تیکت جدید"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              انصراف
            </Button>
            <Button onClick={handleSubmit(onSubmit)} icon={Send}>
              ارسال تیکت
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="موضوع"
              placeholder="مثال: پیگیری وضعیت مرجوعی سفارش"
              {...register('subject', { required: 'موضوع الزامی است' })}
              error={errors.subject?.message}
            />
          </div>
          <Select
            label="بخش مربوطه"
            options={DEPARTMENTS}
            {...register('department', { required: 'بخش مربوطه الزامی است' })}
            error={errors.department?.message}
          />
          <Select
            label="اولویت"
            options={[
              { value: 'low', label: 'کم' },
              { value: 'medium', label: 'متوسط' },
              { value: 'high', label: 'زیاد' },
            ]}
            {...register('priority', { required: 'اولویت الزامی است' })}
            error={errors.priority?.message}
          />
          <div className="sm:col-span-2">
            <label className="label-app">شرح درخواست</label>
            <textarea
              rows={4}
              placeholder="توضیحات کامل درخواست خود را بنویسید..."
              className="input-app resize-none"
              {...register('message', { required: 'شرح درخواست الزامی است' })}
            />
            {errors.message && (
              <p className="mt-1.5 text-xs text-red-500">{errors.message.message}</p>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}
