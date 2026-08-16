/**
 * تبدیل ارقام لاتین به فارسی
 */
const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toFaDigits(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\d/g, (d) => FA_DIGITS[d]);
}

/**
 * قالب‌بندی قیمت با جداکننده هزارگان و ارقام فارسی
 */
export function formatPrice(value) {
  if (value === null || value === undefined || isNaN(value)) return toFaDigits('۰');
  const formatted = new Intl.NumberFormat('fa-IR').format(value);
  return toFaDigits(formatted);
}

/**
 * نمایش قیمت با واحد تومان
 */
export function formatToman(value) {
  return `${formatPrice(value)} تومان`;
}

/**
 * قالب‌بندی درصد تخفیف
 */
export function formatPercent(value) {
  return toFaDigits(`${value}٪`);
}

/**
 * تاریخ فارسی با تقویم جلالی
 */
export function formatFaDate(date, withTime = false) {
  if (!date) return '—';
  const d = new Date(date);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  };
  return new Intl.DateTimeFormat('fa-IR', options).format(d);
}

export function formatFaTime(date) {
  if (!date) return '—';
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * تاریخ نسبی (چند دقیقه/ساعت/روز پیش)
 */
export function relativeTime(date) {
  const diff = Date.now() - new Date(date).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'همین حالا';
  if (min < 60) return `${toFaDigits(min)} دقیقه پیش`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${toFaDigits(hr)} ساعت پیش`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${toFaDigits(day)} روز پیش`;
  return formatFaDate(date);
}

/**
 * تبدیل حروف انگلیسی به اسلاگ فارسی/لاتین امن برای URL
 */
export function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * اعتبارسنجی کد تخفیف ساده
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone) {
  return /^09\d{9}$/.test(String(phone).replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
}

/**
 * تبدیل شماره موبایل به فرمت فارسی خوانا
 */
export function formatPhone(phone) {
  return phone ? toFaDigits(phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')) : '—';
}

/**
 * برداشت نام از ایمیل
 */
export function nameFromEmail(email = '') {
  return email.split('@')[0] || 'کاربر';
}
