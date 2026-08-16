import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Globe, Mail, Trash2, AlertTriangle, Bell, CreditCard } from 'lucide-react';
import PageHeader from '../../components/customer/PageHeader';
import Switch from '../../components/ui/Switch';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

function SettingRow({ icon: Icon, title, description, children }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
          <Icon size={20} />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('fa');
  const [newsletter, setNewsletter] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const confirmDelete = () => {
    setDeleteModal(false);
    logout();
    navigate('/');
    toast.error('حساب شما حذف شد', 'متأسفانه از کفشینو جدا شدید.');
  };

  return (
    <div>
      <PageHeader
        eyebrow="تنظیمات"
        title="تنظیمات حساب"
        description="تنظیمات نمایش، زبان، اطلاع‌رسانی و مدیریت حساب خود را شخصی‌سازی کنید."
      />

      <div className="space-y-6">
        <div className="card-elevated divide-y divide-border/60">
          <div className="p-6">
            <h2 className="mb-5 font-morabba font-bold text-lg text-foreground">ظاهر و زبان</h2>
            <div className="space-y-6">
              <SettingRow
                icon={isDark ? Moon : Sun}
                title="حالت تاریک"
                description="رنگ‌بندی تیره برای استفاده راحت‌تر در شب"
              >
                <Switch checked={isDark} onChange={toggleTheme} />
              </SettingRow>
              <SettingRow
                icon={Globe}
                title="زبان سایت"
                description="زبان رابط کاربری فروشگاه"
              >
                <Select
                  className="w-44"
                  options={[
                    { value: 'fa', label: 'فارسی' },
                    { value: 'en', label: 'English' },
                  ]}
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    if (e.target.value !== 'fa') {
                      toast.info('زبان فارسی، زبان اصلی کفشینو است');
                    }
                  }}
                />
              </SettingRow>
            </div>
          </div>

          <div className="p-6">
            <h2 className="mb-5 font-morabba font-bold text-lg text-foreground">اطلاع‌رسانی</h2>
            <div className="space-y-6">
              <SettingRow
                icon={Mail}
                title="خبرنامه ایمیلی"
                description="دریافت خبر تخفیف‌ها و کالکشن‌های جدید"
              >
                <Switch
                  checked={newsletter}
                  onChange={() => {
                    setNewsletter((v) => !v);
                    toast.success(newsletter ? 'خبرنامه غیرفعال شد' : 'خبرنامه فعال شد');
                  }}
                />
              </SettingRow>
              <SettingRow
                icon={Bell}
                title="اعلان‌های درون‌برنامه"
                description="هشدار وضعیت سفارش و پیام‌های پشتیبانی"
              >
                <Switch checked={notifications} onChange={() => setNotifications((v) => !v)} />
              </SettingRow>
              <SettingRow
                icon={CreditCard}
                title="اعلان پرداخت"
                description="تأیید و یادآوری پرداخت سفارش‌ها"
              >
                <Switch checked onChange={() => {}} />
              </SettingRow>
            </div>
          </div>
        </div>

        <div className="card-elevated border-red-500/25 p-6">
          <h2 className="mb-2 font-morabba font-bold text-lg text-red-500">منطقه خطر</h2>
          <p className="mb-5 text-sm leading-7 text-muted-foreground">
            با حذف حساب، تمام اطلاعات، سفارش‌ها، امتیازها و موجودی کیف پول شما برای همیشه حذف
            می‌شود. این عملیات غیرقابل بازگشت است.
          </p>
          <Button variant="danger" icon={Trash2} onClick={() => setDeleteModal(true)}>
            حذف حساب کاربری
          </Button>
        </div>
      </div>

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="حذف حساب کاربری"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModal(false)}>
              انصراف
            </Button>
            <Button variant="danger" icon={Trash2} onClick={confirmDelete}>
              حذف دائمی حساب
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-red-500/10 text-red-500">
            <AlertTriangle size={20} />
          </span>
          <p className="text-sm leading-7 text-muted-foreground">
            آیا مطمئن هستید؟ با حذف حساب، دسترسی شما به سفارش‌ها، فاکتورها و کیف پول برای همیشه
            از بین می‌رود.
          </p>
        </div>
      </Modal>
    </div>
  );
}
