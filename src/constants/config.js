/**
 * پیکربندی سراسری کفشینو
 */
export const APP = {
  name: 'کفشینو',
  enName: 'Kafshino',
  slogan: 'قدم‌هایت را لوکس کن',
  description: 'فروشگاه اینترنتی کفش؛ تجربه‌ای لوکس و مدرن از خرید کفش',
  version: '1.0.0',
  currency: 'تومان',
};

/** آدرس سرور API — زمانی که بک‌اند لاراول راه‌اندازی شد آن را تغییر دهید */
export const API_CONFIG = {
  baseURL: 'http://localhost:8000/api',
  /** اگر true باشد، از داده‌های شبیه‌سازی‌شده (Mock) در مرورگر استفاده می‌شود */
  useMock: true,
  timeout: 15000,
};

export const STORAGE_KEYS = {
  token: 'kafshino_token',
  user: 'kafshino_user',
  theme: 'kafshino_theme',
  cart: 'kafshino_cart',
  wishlist: 'kafshino_wishlist',
  compare: 'kafshino_compare',
  recent: 'kafshino_recently_viewed',
  recentSearch: 'kafshino_recent_searches',
  coupon: 'kafshino_coupon',
};

export const ORDER_STATUS = {
  pending: { label: 'در انتظار پرداخت', color: 'warning' },
  paid: { label: 'پرداخت‌شده', color: 'info' },
  processing: { label: 'در حال پردازش', color: 'brand' },
  shipping: { label: 'در حال ارسال', color: 'accent' },
  delivered: { label: 'تحویل‌شده', color: 'success' },
  cancelled: { label: 'لغو شده', color: 'danger' },
  refunded: { label: 'مرجوعی', color: 'muted' },
};

export const SHIPPING_METHODS = [
  {
    id: 'express',
    label: 'ارسال اکسپرس',
    description: 'تحویل ۱ تا ۲ روز کاری',
    price: 85000,
    icon: 'Zap',
  },
  {
    id: 'normal',
    label: 'ارسال عادی',
    description: 'تحویل ۳ تا ۵ روز کاری',
    price: 45000,
    icon: 'Truck',
  },
  {
    id: 'pickup',
    label: 'تحویل حضوری',
    description: 'دریافت از فروشگاه',
    price: 0,
    icon: 'Store',
  },
];

export const PAYMENT_METHODS = [
  {
    id: 'zarinpal',
    label: 'زرین‌پال',
    description: 'پرداخت امن آنلاین با کارت بانکی',
    icon: 'CreditCard',
  },
  {
    id: 'wallet',
    label: 'کیف پول کفشینو',
    description: 'پرداخت با اعتبار کیف پول',
    icon: 'Wallet',
  },
  {
    id: 'cod',
    label: 'پرداخت در محل',
    description: 'پرداخت نقدی هنگام تحویل',
    icon: 'Banknote',
  },
];

export const SIZES = [
  '۳۸', '۳۹', '۴۰', '۴۱', '۴۲', '۴۳', '۴۴', '۴۵', '۴۶',
];

export const GENDERS = [
  { value: 'men', label: 'مردانه' },
  { value: 'women', label: 'زنانه' },
  { value: 'kids', label: 'بچه‌گانه' },
  { value: 'unisex', label: 'یونیسکس' },
];
