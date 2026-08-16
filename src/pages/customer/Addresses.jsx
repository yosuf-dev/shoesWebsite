import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Pencil, Trash2, Plus, Check, Home, Briefcase, X } from 'lucide-react';
import PageHeader from '../../components/customer/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ADDRESSES } from '../../data/mockData';
import { toFaDigits, formatPhone } from '../../utils/format';

const PROVINCES = [
  'آذربایجان شرقی', 'آذربایجان غربی', 'اردبیل', 'اصفهان', 'البرز', 'ایلام', 'بوشهر', 'تهران',
  'چهارمحال و بختیاری', 'خراسان جنوبی', 'خراسان رضوی', 'خراسان شمالی', 'خوزستان', 'زنجان',
  'سمنان', 'سیستان و بلوچستان', 'فارس', 'قزوین', 'قم', 'کردستان', 'کرمان', 'کرمانشاه',
  'کهگیلویه و بویراحمد', 'گلستان', 'گیلان', 'لرستان', 'مازندران', 'مرکزی', 'هرمزگان', 'همدان', 'یزد',
];

const TITLE_ICONS = { 'خانه': Home, 'محل کار': Briefcase };

export default function Addresses() {
  const { user } = useAuth();
  const toast = useToast();
  const [addresses, setAddresses] = useState(ADDRESSES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (modalOpen) {
      reset(
        editing || {
          title: 'خانه',
          recipient: user?.name || '',
          phone: user?.phone || '',
          province: 'تهران',
          city: '',
          street: '',
          postalCode: '',
        }
      );
    }
  }, [modalOpen, editing, reset, user]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (address) => {
    setEditing(address);
    setModalOpen(true);
  };

  const onSubmit = (data) => {
    if (editing) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editing.id ? { ...a, ...data } : a))
      );
      toast.success('آدرس با موفقیت ویرایش شد');
    } else {
      setAddresses((prev) => [
        ...prev,
        { id: Date.now(), ...data, isDefault: prev.length === 0 },
      ]);
      toast.success('آدرس جدید اضافه شد');
    }
    setModalOpen(false);
  };

  const setDefault = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    toast.success('آدرس پیش‌فرض انتخاب شد');
  };

  const removeAddress = () => {
    if (!confirmDelete) return;
    setAddresses((prev) => prev.filter((a) => a.id !== confirmDelete.id));
    setConfirmDelete(null);
    toast.success('آدرس حذف شد');
  };

  return (
    <div>
      <PageHeader
        eyebrow="آدرس‌ها"
        title="آدرس‌های من"
        description="آدرس‌های تحویل را مدیریت کنید و آدرس پیش‌فرض را برای ارسال سریع‌تر تعیین کنید."
        action={
          <Button icon={Plus} onClick={openAdd}>
            افزودن آدرس جدید
          </Button>
        }
      />

      {addresses.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="آدرسی ثبت نشده است"
          description="برای خرید و دریافت سفارش‌ها، اولین آدرس تحویل خود را اضافه کنید."
          action={
            <Button icon={Plus} onClick={openAdd} className="mt-2">
              افزودن آدرس
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {addresses.map((address) => {
            const TitleIcon = TITLE_ICONS[address.title] || MapPin;
            return (
              <div
                key={address.id}
                className="card-elevated group relative overflow-hidden p-5 transition-all duration-300 hover:shadow-lift"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
                      <TitleIcon size={20} />
                    </span>
                    <div>
                      <h3 className="flex items-center gap-2 font-morabba font-bold text-base text-foreground">
                        {address.title}
                        {address.isDefault && <Badge variant="success">پیش‌فرض</Badge>}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {address.recipient} · {formatPhone(address.phone)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(address)}
                      className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                      aria-label="ویرایش آدرس"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(address)}
                      className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                      aria-label="حذف آدرس"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-sm leading-7 text-muted-foreground">
                  {address.province}، {address.city}، {address.street}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  کد پستی: {toFaDigits(address.postalCode)}
                </p>

                {!address.isDefault && (
                  <button
                    onClick={() => setDefault(address.id)}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300"
                  >
                    <Check size={15} />
                    تعیین به عنوان پیش‌فرض
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              انصراف
            </Button>
            <Button onClick={handleSubmit(onSubmit)} icon={Check}>
              {editing ? 'ذخیره تغییرات' : 'افزودن آدرس'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="عنوان آدرس"
            options={[
              { value: 'خانه', label: 'خانه' },
              { value: 'محل کار', label: 'محل کار' },
              { value: 'سایر', label: 'سایر' },
            ]}
            {...register('title')}
          />
          <Input
            label="نام گیرنده"
            placeholder="مثال: سارا محمدی"
            {...register('recipient', { required: 'نام گیرنده الزامی است' })}
            error={errors.recipient?.message}
          />
          <Input
            label="شماره موبایل"
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            dir="ltr"
            className="[direction:rtl]"
            {...register('phone', {
              required: 'شماره موبایل الزامی است',
              pattern: { value: /^09\d{9}$/, message: 'شماره موبایل معتبر نیست' },
            })}
            error={errors.phone?.message}
          />
          <Select
            label="استان"
            options={PROVINCES}
            {...register('province', { required: 'استان الزامی است' })}
            error={errors.province?.message}
          />
          <Input
            label="شهر"
            placeholder="مثال: تهران"
            {...register('city', { required: 'شهر الزامی است' })}
            error={errors.city?.message}
          />
          <Input
            label="کد پستی"
            placeholder="۱۰ رقمی"
            dir="ltr"
            className="[direction:rtl]"
            {...register('postalCode', {
              required: 'کد پستی الزامی است',
              pattern: { value: /^\d{10}$/, message: 'کد پستی باید ۱۰ رقم باشد' },
            })}
            error={errors.postalCode?.message}
          />
          <div className="sm:col-span-2">
            <Input
              label="نشانی کامل"
              placeholder="خیابان، کوچه، پلاک، واحد"
              {...register('street', { required: 'نشانی الزامی است' })}
              error={errors.street?.message}
            />
          </div>
        </form>
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="حذف آدرس"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
              <X size={16} />
              انصراف
            </Button>
            <Button variant="danger" icon={Trash2} onClick={removeAddress}>
              حذف آدرس
            </Button>
          </>
        }
      >
        <p className="text-sm leading-7 text-muted-foreground">
          آیا از حذف آدرس «{confirmDelete?.title}» مطمئن هستید؟ این عملیات قابل بازگشت نیست.
        </p>
      </Modal>
    </div>
  );
}
