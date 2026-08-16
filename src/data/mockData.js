/**
 * داده‌های شبیه‌سازی‌شده (Mock) فروشگاه کفشینو
 * زمانی که بک‌اند لاراول متصل شود، این ماژول با API واقعی جایگزین می‌شود.
 */

const palettes = {
  indigo: { from: '#6366f1', to: '#8b5cf6', accent: '#ffffff' },
  violet: { from: '#7c3aed', to: '#a78bfa', accent: '#ffffff' },
  black: { from: '#1e293b', to: '#475569', accent: '#fbbf24' },
  rose: { from: '#e11d48', to: '#fb7185', accent: '#ffffff' },
  emerald: { from: '#059669', to: '#34d399', accent: '#ffffff' },
  amber: { from: '#f59e0b', to: '#fbbf24', accent: '#7c2d12' },
  sky: { from: '#0284c7', to: '#38bdf8', accent: '#ffffff' },
  fuchsia: { from: '#c026d3', to: '#e879f9', accent: '#ffffff' },
  red: { from: '#dc2626', to: '#f87171', accent: '#ffffff' },
  stone: { from: '#57534e', to: '#a8a29e', accent: '#ffffff' },
  navy: { from: '#1e3a8a', to: '#3b82f6', accent: '#ffffff' },
  orange: { from: '#ea580c', to: '#fb923c', accent: '#ffffff' },
};

export const CATEGORIES = [
  { id: 1, slug: 'running', name: 'رانینگ', icon: 'Footprints', description: 'کفش‌های مخصوص دویدن و تمرین' },
  { id: 2, slug: 'sport', name: 'اسپرت', icon: 'Dumbbell', description: 'کفش‌های ورزشی روزمره' },
  { id: 3, slug: 'basketball', name: 'بسکتبال', icon: 'Trophy', description: 'کفش‌های حرفه‌ای بسکتبال' },
  { id: 4, slug: 'walking', name: 'پیاده‌روی', icon: 'Map', description: 'راحتی مطلق برای پیاده‌روی' },
  { id: 5, slug: 'casual', name: 'کژوال', icon: 'Coffee', description: 'استایل روزمره و شیک' },
  { id: 6, slug: 'formal', name: 'رسمی', icon: 'Briefcase', description: 'کفش‌های رسمی و مجلسی' },
  { id: 7, slug: 'football', name: 'فوتبال', icon: 'CircleDot', description: 'کفش‌های مخصوص فوتبال' },
  { id: 8, slug: 'medical', name: 'طبی', icon: 'HeartPulse', description: 'کفش‌های طبی و ارتوپدی' },
];

export const BRANDS = [
  { id: 1, slug: 'nike', name: 'نایک' },
  { id: 2, slug: 'adidas', name: 'آدیداس' },
  { id: 3, slug: 'puma', name: 'پوما' },
  { id: 4, slug: 'new-balance', name: 'نیوبالانس' },
  { id: 5, slug: 'reebok', name: 'ریبوک' },
  { id: 6, slug: 'asics', name: 'آسیکس' },
  { id: 7, slug: 'converse', name: 'کانورس' },
  { id: 8, slug: 'union', name: 'یونیون' },
];

const brandName = (slug) => BRANDS.find((b) => b.slug === slug)?.name || slug;
const categoryName = (slug) => CATEGORIES.find((c) => c.slug === slug)?.name || slug;

/* ---------- سازنده محصول ---------- */
let productId = 0;
function p({
  brand, category, gender, price, compareAtPrice, rating, reviewCount,
  colors, sizes, stock, palette, flags = {}, name, material = 'چرم مصنوعی', tags = [],
}) {
  productId += 1;
  const slug = `${brand}-${name.replace(/\s+/g, '-').toLowerCase().replace(/[^\w\u0600-\u06FF-]/g, '')}`;
  const discount = compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;
  return {
    id: productId,
    slug,
    name,
    brand: { id: BRANDS.find((b) => b.slug === brand).id, name: brandName(brand), slug: brand },
    category: { id: CATEGORIES.find((c) => c.slug === category).id, name: categoryName(category), slug: category },
    gender,
    price,
    compareAtPrice: compareAtPrice || null,
    discountPercent: discount,
    rating,
    reviewCount,
    colors: colors.map((c, i) => ({
      name: c.name,
      hex: c.hex,
      palette: palettes[c.palette] || palettes.indigo,
      images: i === 0 ? ['side', 'angle', 'front', 'top'] : ['side', 'front'],
    })),
    sizes,
    stock,
    palette: palettes[palette] || palettes.indigo,
    images: ['side', 'angle', 'front', 'top'],
    material,
    tags,
    featured: !!flags.featured,
    isNew: !!flags.isNew,
    bestSeller: !!flags.bestSeller,
    flashSale: !!flags.flashSale,
    limited: !!flags.limited,
    createdAt: flags.date || '2026-01-10',
    description: `${name} از برند ${brandName(brand)} با طراحی مدرن و ارگونومیک ساخته شده است. این محصول با فناوری روز دنیا و مواد اولیه باکیفیت تولید شده و راحتی و استایل را هم‌زمان برای شما به ارمغان می‌آورد. مناسب برای استفاده روزمره و حرفه‌ای.`,
    specs: {
      'جنسیت': gender === 'men' ? 'مردانه' : gender === 'women' ? 'زنانه' : gender === 'kids' ? 'بچه‌گانه' : 'یونیسکس',
      'برند': brandName(brand),
      'جنس رویه': material,
      'جنس زیره': 'لاستیک مقاوم',
      'ارتفاع پاشنه': '۳ سانتی‌متر',
      'نوع بند': 'بنددار',
      'کشور سازنده': 'ایران',
      'گارانتی': '۶ ماه ضمانت اصالت',
    },
  };
}

/* ---------- تولید محصولات ---------- */
export const PRODUCTS = [
  p({ brand: 'nike', category: 'running', gender: 'men', name: 'ایر مکس ۲۰۲۶', price: 4890000, compareAtPrice: 5890000, rating: 4.8, reviewCount: 214, palette: 'indigo', colors: [{ name: 'آبی کیهانی', hex: '#4f46e5', palette: 'indigo' }, { name: 'مشکی', hex: '#0f172a', palette: 'black' }, { name: 'قرمز', hex: '#dc2626', palette: 'red' }], sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46], stock: 14, flags: { featured: true, bestSeller: true, isNew: true }, tags: ['کشیدن', 'سبک'] }),
  p({ brand: 'adidas', category: 'sport', gender: 'men', name: 'سوپراستار کلاسیک', price: 3650000, compareAtPrice: null, rating: 4.6, reviewCount: 188, palette: 'black', colors: [{ name: 'سفید/مشکی', hex: '#334155', palette: 'black' }, { name: 'سفید', hex: '#f8fafc', palette: 'stone' }], sizes: [39, 40, 41, 42, 43, 44, 45], stock: 22, flags: { featured: true, bestSeller: true } }),
  p({ brand: 'puma', category: 'running', gender: 'women', name: 'فوت‌لایت سافتری', price: 2980000, compareAtPrice: 3490000, rating: 4.5, reviewCount: 96, palette: 'rose', colors: [{ name: 'صورتی', hex: '#e11d48', palette: 'rose' }, { name: 'بژ', hex: '#a8a29e', palette: 'stone' }], sizes: [37, 38, 39, 40, 41, 42], stock: 18, flags: { featured: true, flashSale: true } }),
  p({ brand: 'new-balance', category: 'walking', gender: 'men', name: '۵۷۴ کلاسیک', price: 4200000, compareAtPrice: null, rating: 4.7, reviewCount: 152, palette: 'stone', colors: [{ name: 'طوسی', hex: '#57534e', palette: 'stone' }, { name: 'سبز', hex: '#059669', palette: 'emerald' }], sizes: [40, 41, 42, 43, 44, 45], stock: 9, flags: { featured: true, limited: true } }),
  p({ brand: 'nike', category: 'basketball', gender: 'men', name: 'هوکیکی ۱', price: 6850000, compareAtPrice: 7990000, rating: 4.9, reviewCount: 341, palette: 'orange', colors: [{ name: 'نارنجی', hex: '#ea580c', palette: 'orange' }, { name: 'سرمه‌ای', hex: '#1e3a8a', palette: 'navy' }], sizes: [41, 42, 43, 44, 45, 46], stock: 6, flags: { featured: true, bestSeller: true, limited: true, isNew: true } }),
  p({ brand: 'adidas', category: 'football', gender: 'men', name: 'پریدیتور لیگ', price: 5450000, compareAtPrice: null, rating: 4.7, reviewCount: 121, palette: 'emerald', colors: [{ name: 'سبز برقی', hex: '#059669', palette: 'emerald' }, { name: 'مشکی', hex: '#0f172a', palette: 'black' }], sizes: [40, 41, 42, 43, 44, 45], stock: 11, flags: { isNew: true } }),
  p({ brand: 'asics', category: 'running', gender: 'women', name: 'ژل‌کایانو ۳۰', price: 5980000, compareAtPrice: 6500000, rating: 4.8, reviewCount: 87, palette: 'sky', colors: [{ name: 'آبی آسمانی', hex: '#0284c7', palette: 'sky' }, { name: 'سفید', hex: '#f8fafc', palette: 'stone' }], sizes: [37, 38, 39, 40, 41], stock: 8, flags: { featured: true } }),
  p({ brand: 'converse', category: 'casual', gender: 'unisex', name: 'چاک تیلور آل‌استار', price: 2450000, compareAtPrice: null, rating: 4.4, reviewCount: 203, palette: 'stone', colors: [{ name: 'سفید', hex: '#f8fafc', palette: 'stone' }, { name: 'مشکی', hex: '#0f172a', palette: 'black' }], sizes: [38, 39, 40, 41, 42, 43, 44], stock: 30, flags: { bestSeller: true } }),
  p({ brand: 'union', category: 'casual', gender: 'men', name: 'اسنیکر کژوال استریت', price: 1850000, compareAtPrice: 2290000, rating: 4.3, reviewCount: 64, palette: 'navy', colors: [{ name: 'سرمه‌ای', hex: '#1e3a8a', palette: 'navy' }, { name: 'خاکستری', hex: '#475569', palette: 'black' }], sizes: [39, 40, 41, 42, 43, 44], stock: 25, flags: { flashSale: true } }),
  p({ brand: 'reebok', category: 'sport', gender: 'women', name: 'کلاسیک لیترب', price: 3150000, compareAtPrice: null, rating: 4.5, reviewCount: 74, palette: 'violet', colors: [{ name: 'بنفش', hex: '#7c3aed', palette: 'violet' }, { name: 'سفید', hex: '#f8fafc', palette: 'stone' }], sizes: [37, 38, 39, 40, 41, 42], stock: 16, flags: { isNew: true } }),
  p({ brand: 'nike', category: 'running', gender: 'women', name: 'پگاسوس ۴۱', price: 4520000, compareAtPrice: 4990000, rating: 4.8, reviewCount: 176, palette: 'fuchsia', colors: [{ name: 'سرخابی', hex: '#c026d3', palette: 'fuchsia' }, { name: 'سفید', hex: '#f8fafc', palette: 'stone' }], sizes: [36, 37, 38, 39, 40, 41, 42], stock: 13, flags: { featured: true, bestSeller: true } }),
  p({ brand: 'adidas', category: 'walking', gender: 'unisex', name: 'اولترابوست ۲۵', price: 7450000, compareAtPrice: 8300000, rating: 4.9, reviewCount: 259, palette: 'violet', colors: [{ name: 'بنفش', hex: '#7c3aed', palette: 'violet' }, { name: 'سفید', hex: '#f8fafc', palette: 'stone' }], sizes: [38, 39, 40, 41, 42, 43, 44, 45], stock: 7, flags: { featured: true, limited: true } }),
  p({ brand: 'puma', category: 'sport', gender: 'men', name: 'آرامیس ۴۵۰', price: 2750000, compareAtPrice: null, rating: 4.2, reviewCount: 58, palette: 'black', colors: [{ name: 'مشکی', hex: '#0f172a', palette: 'black' }, { name: 'قرمز', hex: '#dc2626', palette: 'red' }], sizes: [40, 41, 42, 43, 44], stock: 21, flags: { flashSale: true } }),
  p({ brand: 'nike', category: 'basketball', gender: 'men', name: 'اربی جردن کمبو', price: 8990000, compareAtPrice: 9800000, rating: 4.9, reviewCount: 412, palette: 'red', colors: [{ name: 'قرمز', hex: '#dc2626', palette: 'red' }, { name: 'مشکی', hex: '#0f172a', palette: 'black' }], sizes: [41, 42, 43, 44, 45, 46], stock: 4, flags: { featured: true, bestSeller: true, limited: true } }),
  p({ brand: 'asics', category: 'running', gender: 'men', name: 'نیمبوس ۲۶', price: 6850000, compareAtPrice: null, rating: 4.8, reviewCount: 143, palette: 'emerald', colors: [{ name: 'سبز', hex: '#059669', palette: 'emerald' }, { name: 'نارنجی', hex: '#ea580c', palette: 'orange' }], sizes: [40, 41, 42, 43, 44, 45], stock: 10, flags: {} }),
  p({ brand: 'union', category: 'formal', gender: 'men', name: 'مجلس چرم دست‌دوز', price: 3250000, compareAtPrice: null, rating: 4.6, reviewCount: 49, palette: 'black', colors: [{ name: 'مشکی', hex: '#0f172a', palette: 'black' }, { name: 'قهوه‌ای', hex: '#7c2d12', palette: 'amber' }], sizes: [40, 41, 42, 43, 44, 45], stock: 12, flags: {} }),
  p({ brand: 'new-balance', category: 'running', gender: 'women', name: 'فلیس‌ر ۸۸۰', price: 3980000, compareAtPrice: 4400000, rating: 4.7, reviewCount: 91, palette: 'rose', colors: [{ name: 'صورتی', hex: '#e11d48', palette: 'rose' }, { name: 'سفید', hex: '#f8fafc', palette: 'stone' }], sizes: [37, 38, 39, 40, 41, 42], stock: 15, flags: { isNew: true } }),
  p({ brand: 'adidas', category: 'casual', gender: 'women', name: 'فروم مادری', price: 3450000, compareAtPrice: null, rating: 4.4, reviewCount: 67, palette: 'amber', colors: [{ name: 'طلایی', hex: '#f59e0b', palette: 'amber' }, { name: 'مشکی', hex: '#0f172a', palette: 'black' }], sizes: [36, 37, 38, 39, 40, 41], stock: 19, flags: {} }),
  p({ brand: 'converse', category: 'casual', gender: 'kids', name: 'بچه‌گانه استار', price: 1650000, compareAtPrice: null, rating: 4.5, reviewCount: 38, palette: 'sky', colors: [{ name: 'آبی', hex: '#0284c7', palette: 'sky' }, { name: 'زرد', hex: '#f59e0b', palette: 'amber' }], sizes: [30, 31, 32, 33, 34, 35, 36], stock: 27, flags: {} }),
  p({ brand: 'nike', category: 'sport', gender: 'men', name: 'فریکشن دی‌ان', price: 2650000, compareAtPrice: 3200000, rating: 4.3, reviewCount: 82, palette: 'black', colors: [{ name: 'مشکی/نارنجی', hex: '#1e293b', palette: 'black' }, { name: 'خاکستری', hex: '#475569', palette: 'stone' }], sizes: [39, 40, 41, 42, 43, 44, 45], stock: 20, flags: { flashSale: true } }),
  p({ brand: 'reebok', category: 'walking', gender: 'men', name: 'زایک ۳۵', price: 3550000, compareAtPrice: null, rating: 4.4, reviewCount: 73, palette: 'navy', colors: [{ name: 'سرمه‌ای', hex: '#1e3a8a', palette: 'navy' }, { name: 'سفید', hex: '#f8fafc', palette: 'stone' }], sizes: [40, 41, 42, 43, 44], stock: 14, flags: {} }),
  p({ brand: 'puma', category: 'basketball', gender: 'men', name: 'اسکای‌ورکر ۴', price: 6250000, compareAtPrice: 7200000, rating: 4.7, reviewCount: 104, palette: 'orange', colors: [{ name: 'نارنجی', hex: '#ea580c', palette: 'orange' }, { name: 'آبی', hex: '#0284c7', palette: 'sky' }], sizes: [41, 42, 43, 44, 45, 46], stock: 5, flags: { limited: true } }),
  p({ brand: 'adidas', category: 'running', gender: 'men', name: 'تِربو ۱۰۰۰', price: 6250000, compareAtPrice: null, rating: 4.6, reviewCount: 118, palette: 'indigo', colors: [{ name: 'آبی', hex: '#4f46e5', palette: 'indigo' }, { name: 'سفید', hex: '#f8fafc', palette: 'stone' }], sizes: [39, 40, 41, 42, 43, 44, 45], stock: 9, flags: { isNew: true } }),
  p({ brand: 'new-balance', category: 'casual', gender: 'men', name: '۵۰۸ ارگو', price: 2890000, compareAtPrice: 3300000, rating: 4.5, reviewCount: 77, palette: 'emerald', colors: [{ name: 'سبز', hex: '#059669', palette: 'emerald' }, { name: 'طوسی', hex: '#57534e', palette: 'stone' }], sizes: [40, 41, 42, 43, 44], stock: 17, flags: { flashSale: true } }),
];

/* ---------- کوپن‌ها ---------- */
export const COUPONS = [
  { id: 1, code: 'WELCOME10', type: 'percentage', value: 10, minOrder: 0, usageLimit: 1000, usedCount: 312, expiresAt: '2026-12-31', title: 'هدیه خوش‌آمدگویی ۱۰٪' },
  { id: 2, code: 'SUMMER25', type: 'percentage', value: 25, minOrder: 5000000, usageLimit: 500, usedCount: 401, expiresAt: '2026-09-30', title: 'تخفیف تابستانه ۲۵٪' },
  { id: 3, code: 'FIXED500', type: 'fixed', value: 500000, minOrder: 3000000, usageLimit: 300, usedCount: 128, expiresAt: '2026-12-01', title: 'تخفیف ثابت ۵۰۰ هزار تومانی' },
  { id: 4, code: 'FIRSTORDER', type: 'percentage', value: 15, minOrder: 0, usageLimit: 1000, usedCount: 764, expiresAt: '2026-12-31', title: '۱۵٪ اولین خرید' },
];

/* ---------- نظرات ---------- */
const REVIEW_AUTHORS = ['سارا محمدی', 'علی رضایی', 'نگین کریمی', 'محمد حسینی', 'فاطمه احمدی', 'رضا قاسمی', 'آیدا نادری', 'امیر صادقی', 'پریسا موسوی', 'حسین عبادی'];
const REVIEW_TEXTS = [
  'کیفیت فوق‌العاده‌ای داره، از خریدم کاملاً راضی‌ام. بسته‌بندی هم خیلی شیک بود.',
  'راحتی این کفش واقعاً بی‌نظیره، بعد از چند ساعت کار هم پام خسته نشد.',
  'کیفیت با این قیمت کاملاً منصفانه‌ست. پیشنهاد می‌کنم حتماً امتحان کنید.',
  'طراحی فوق‌العاده مدرن و شیکی داره، همه ازش تعریف می‌کنن.',
  'سایزبندی دقیقه و جنس رویه خیلی باکیفیت. ارسال هم سریع بود.',
  'دومین باره از کفشینو خرید می‌کنم، همیشه کیفیت و پشتیبانی عالی بوده.',
  'کفی نرمش فوق‌العادست، واقعاً ارزش قیمتش رو داره.',
  'در کل راضی‌ام، فقط اگر رنگ‌بندی بیشتری داشت عالی می‌شد.',
  'کفش واقعاً راحته و استایل خاصی داره. کیفیت ساخت بالاست.',
  'به‌عنوان کفش ورزشی حرفه‌ای، عملکردش عالیه. توصیه می‌کنم.',
];
export function getProductReviews(productId) {
  return Array.from({ length: 6 }).map((_, i) => ({
    id: `${productId}-r${i}`,
    productId,
    author: REVIEW_AUTHORS[(productId * 3 + i * 5) % REVIEW_AUTHORS.length],
    rating: 4 + ((productId + i) % 2 === 0 ? 1 : 0),
    date: `2026-${String(((productId + i) % 6) + 1).padStart(2, '0')}-${String(((productId + i * 2) % 27) + 1).padStart(2, '0')}`,
    title: i % 2 === 0 ? 'خرید عالی' : 'راضی‌کننده',
    text: REVIEW_TEXTS[(productId + i) % REVIEW_TEXTS.length],
    verified: i % 3 !== 0,
    likes: (i + productId) % 14,
  }));
}

/* ---------- کاربران ---------- */
export const USERS = [
  { id: 1, name: 'مدیر کل', email: 'admin@kafshino.ir', phone: '09120000001', role: 'admin', status: 'active', joinedAt: '2025-05-01', city: 'تهران', ordersCount: 0 },
  { id: 2, name: 'سارا محمدی', email: 'sara@example.com', phone: '09123456789', role: 'customer', status: 'active', joinedAt: '2025-11-20', city: 'تهران', ordersCount: 12 },
  { id: 3, name: 'علی رضایی', email: 'ali@example.com', phone: '09127654321', role: 'customer', status: 'active', joinedAt: '2025-12-05', city: 'اصفهان', ordersCount: 5 },
  { id: 4, name: 'نگین کریمی', email: 'negin@example.com', phone: '09122334455', role: 'customer', status: 'active', joinedAt: '2026-01-12', city: 'شیراز', ordersCount: 8 },
  { id: 5, name: 'محمد حسینی', email: 'mohammad@example.com', phone: '09125566778', role: 'customer', status: 'banned', joinedAt: '2026-02-03', city: 'مشهد', ordersCount: 1 },
  { id: 6, name: 'ادمین فروش', email: 'sales@kafshino.ir', phone: '09126677889', role: 'admin', status: 'active', joinedAt: '2025-08-15', city: 'تهران', ordersCount: 0 },
  { id: 7, name: 'فاطمه احمدی', email: 'fatemeh@example.com', phone: '09127788990', role: 'customer', status: 'active', joinedAt: '2026-03-18', city: 'تبریز', ordersCount: 3 },
  { id: 8, name: 'رضا قاسمی', email: 'reza@example.com', phone: '09128899001', role: 'customer', status: 'active', joinedAt: '2026-04-25', city: 'کرج', ordersCount: 2 },
  { id: 9, name: 'کاربر تستی', email: 'test@kafshino.ir', phone: '09120000009', role: 'customer', status: 'active', joinedAt: '2026-06-01', city: 'تهران', ordersCount: 0 },
];

export const ROLES = [
  { id: 1, name: 'مدیر کل', slug: 'super-admin', users: 1, permissions: ['all'] },
  { id: 2, name: 'ادمین', slug: 'admin', users: 2, permissions: ['products', 'orders', 'customers', 'coupons', 'inventory', 'reports'] },
  { id: 3, name: 'مدیر فروش', slug: 'sales-manager', users: 1, permissions: ['orders', 'customers', 'reports'] },
  { id: 4, name: 'مشتری', slug: 'customer', users: 5, permissions: ['purchase'] },
];

/* ---------- سفارش‌ها ---------- */
export const ORDERS = [
  { id: 'ORD-1001', userId: 2, userName: 'سارا محمدی', status: 'delivered', date: '2026-07-18', items: 2, total: 8540000, payment: 'zarinpal', itemsList: [1, 5] },
  { id: 'ORD-1002', userId: 3, userName: 'علی رضایی', status: 'processing', date: '2026-07-20', items: 1, total: 3650000, payment: 'wallet', itemsList: [2] },
  { id: 'ORD-1003', userId: 4, userName: 'نگین کریمی', status: 'shipping', date: '2026-07-22', items: 3, total: 11380000, payment: 'zarinpal', itemsList: [3, 8, 10] },
  { id: 'ORD-1004', userId: 7, userName: 'فاطمه احمدی', status: 'paid', date: '2026-07-24', items: 1, total: 4520000, payment: 'cod', itemsList: [11] },
  { id: 'ORD-1005', userId: 8, userName: 'رضا قاسمی', status: 'pending', date: '2026-07-25', items: 2, total: 5190000, payment: 'zarinpal', itemsList: [6, 13] },
  { id: 'ORD-1006', userId: 2, userName: 'سارا محمدی', status: 'cancelled', date: '2026-07-10', items: 1, total: 2450000, payment: 'wallet', itemsList: [8] },
  { id: 'ORD-1007', userId: 3, userName: 'علی رضایی', status: 'refunded', date: '2026-07-08', items: 1, total: 6850000, payment: 'zarinpal', itemsList: [14] },
  { id: 'ORD-1008', userId: 4, userName: 'نگین کریمی', status: 'delivered', date: '2026-07-05', items: 2, total: 9180000, payment: 'zarinpal', itemsList: [12, 16] },
];

/* ---------- اعلان‌ها ---------- */
export const NOTIFICATIONS = [
  { id: 1, type: 'order', title: 'سفارش جدید ثبت شد', text: 'سفارش ORD-1005 به مبلغ ۵,۱۹۰,۰۰۰ تومان ثبت شد.', date: '2026-07-25T10:30:00', read: false, target: '/admin/orders/ORD-1005' },
  { id: 2, type: 'stock', title: 'هشدار موجودی کم', text: 'هوکیکی ۱ کمتر از ۵ عدد موجودی دارد.', date: '2026-07-25T09:12:00', read: false, target: '/admin/inventory' },
  { id: 3, type: 'user', title: 'کاربر جدید ثبت‌نام کرد', text: 'فاطمه احمدی به کفشینو پیوست.', date: '2026-07-24T18:45:00', read: false, target: '/admin/customers' },
  { id: 4, type: 'payment', title: 'پرداخت موفق', text: 'پرداخت سفارش ORD-1004 تایید شد.', date: '2026-07-24T11:20:00', read: true, target: '/admin/orders/ORD-1004' },
  { id: 5, type: 'review', title: 'نظر جدید ثبت شد', text: 'سارا محمدی به ایر مکس ۲۰۲۶ امتیاز ۵ داد.', date: '2026-07-23T20:05:00', read: true, target: '/admin/reviews' },
];

/* ---------- نظرات نمایشی صفحه اصلی ---------- */
export const TESTIMONIALS = [
  { id: 1, name: 'سارا محمدی', role: 'ورزشکار حرفه‌ای', avatar: 'S', rating: 5, text: 'کفشینو تجربه خریدی متفاوت رو برام ساخت؛ از کیفیت کالا تا بسته‌بندی لوکس، همه‌چیز در سطح جهانی بود.' },
  { id: 2, name: 'امیر صادقی', role: 'علاقه‌مند به کالج', avatar: 'A', rating: 5, text: 'بیشترین نگرانیم سایز کفش بود، اما راهنمای سایز دقیقش باعث شد بدون ریسک بخرم. الان بهترین اسنیکرهایم رو از اینجا می‌خرم.' },
  { id: 3, name: 'نگین کریمی', role: 'طراح مد', avatar: 'N', rating: 4, text: 'کالکشن‌های محدود و انحصاری‌اش فوق‌العاده‌ست. هر بار که کفش می‌پوشم از استایلش لذت می‌برم.' },
  { id: 4, name: 'محمد حسینی', role: 'مشتری دائمی', avatar: 'M', rating: 5, text: 'ارسال سریع، پشتیبانی پاسخگو و محصولات اصل با گارانتی. هرچی نیاز داشته باشم اول کفشینو رو چک می‌کنم.' },
];

/* ---------- پرسش‌های متداول ---------- */
export const FAQS = [
  { id: 1, q: 'امکان مرجوعی کالا وجود دارد؟', a: 'بله، تا ۷ روز کاری پس از تحویل و در صورت سالم بودن کالا، امکان مرجوعی و بازگشت وجه وجود دارد.' },
  { id: 2, q: 'مدت زمان ارسال سفارش چقدر است؟', a: 'سفارش‌های اکسپرس ۱ تا ۲ روز و سفارش‌های عادی ۳ تا ۵ روز کاری ارسال می‌شوند.' },
  { id: 3, q: 'چگونه سایز مناسب را انتخاب کنم؟', a: 'از راهنمای سایز محصول و جدول اندازه‌گیری استفاده کنید؛ در صورت نیاز پشتیبانی رایگان به شما کمک می‌کند.' },
  { id: 4, q: 'روش‌های پرداخت کدام است؟', a: 'پرداخت آنلاین امن (زرین‌پال)، پرداخت با کیف پول کفشینو و پرداخت در محل تحویل.' },
  { id: 5, q: 'اصالت کالا چگونه تضمین می‌شود؟', a: 'تمام محصولات دارای گارانتی اصالت کفشینو و ۶ ماه ضمانت تعویض می‌باشند.' },
];

/* ---------- لوگوهای برند برای نمایش ---------- */
export const BRAND_LOGO_COLORS = {
  nike: '#7c3aed',
  adidas: '#0f172a',
  puma: '#e11d48',
  'new-balance': '#f59e0b',
  reebok: '#0284c7',
  asics: '#059669',
  converse: '#1e293b',
  union: '#ea580c',
};

/* ---------- آمار فروش برای داشبورد ---------- */
export const SALES_CHART = {
  months: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
  revenue: [42, 58, 51, 74, 96, 88, 110, 132, 121, 145, 168, 189],
  orders: [320, 410, 380, 520, 640, 610, 720, 810, 760, 890, 940, 1020],
  visitors: [8200, 9100, 8800, 11200, 13400, 12100, 14200, 16100, 14900, 17200, 18400, 21000],
};

export const SALES_BY_CATEGORY = [
  { label: 'رانینگ', value: 34 },
  { label: 'اسپرت', value: 22 },
  { label: 'کژوال', value: 18 },
  { label: 'بسکتبال', value: 12 },
  { label: 'پیاده‌روی', value: 8 },
  { label: 'سایر', value: 6 },
];

export const TOP_PRODUCTS = [
  { name: 'ایر مکس ۲۰۲۶', sales: 214, revenue: 1046460000 },
  { name: 'هوکیکی ۱', sales: 341, revenue: 2335850000 },
  { name: 'اولترابوست ۲۵', sales: 259, revenue: 1929550000 },
  { name: 'اربی جردن کمبو', sales: 412, revenue: 3703880000 },
  { name: 'پگاسوس ۴۱', sales: 176, revenue: 795520000 },
];

export const ACTIVITY_LOG = [
  { id: 1, user: 'ادمین', action: 'افزودن محصول «پگاسوس ۴۱»', date: '2026-07-25T11:40:00' },
  { id: 2, user: 'مدیر فروش', action: 'ایجاد کوپن SUMMER25', date: '2026-07-25T10:02:00' },
  { id: 3, user: 'سیستم', action: 'تغییر وضعیت سفارش ORD-1003 به «در حال ارسال»', date: '2026-07-24T16:33:00' },
  { id: 4, user: 'ادمین', action: 'به‌روزرسانی موجودی «اولترابوست ۲۵»', date: '2026-07-24T14:10:00' },
  { id: 5, user: 'سیستم', action: 'ثبت ۸۲ سفارش جدید', date: '2026-07-24T09:00:00' },
  { id: 6, user: 'ادمین', action: 'افزودن بنر کمپین تابستانه', date: '2026-07-23T13:20:00' },
];

/* ---------- آدرس‌های نمونه ---------- */
export const ADDRESSES = [
  { id: 1, title: 'خانه', recipient: 'سارا محمدی', phone: '09123456789', province: 'تهران', city: 'تهران', street: 'خیابان ولیعصر، کوچه بهار، پلاک ۱۲، واحد ۳', postalCode: '1967712345', isDefault: true },
  { id: 2, title: 'محل کار', recipient: 'سارا محمدی', phone: '09123456789', province: 'البرز', city: 'کرج', street: 'مهرشهر، بلوار ارم، ساختمان اداری الماس', postalCode: '3178998765', isDefault: false },
];

/* ---------- تیکت‌های پشتیبانی ---------- */
export const TICKETS = [
  { id: 'TCK-501', subject: 'پیگیری وضعیت مرجوعی', status: 'open', priority: 'medium', date: '2026-07-23', department: 'بازگشت کالا', lastMessage: 'در حال بررسی توسط تیم پشتیبانی است.' },
  { id: 'TCK-498', subject: 'راهنمایی انتخاب سایز', status: 'answered', priority: 'low', date: '2026-07-20', department: 'راهنمایی خرید', lastMessage: 'پاسخ کارشناس ارسال شد.' },
  { id: 'TCK-490', subject: 'استعلام گارانتی محصول', status: 'closed', priority: 'low', date: '2026-07-15', department: 'گارانتی', lastMessage: 'تیکت بسته شد.' },
];

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === Number(id));
}

export function getProductBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug);
}
