# قرارداد طراحی و توسعه فرانت‌اند کفشینو

این سند راهنمای اجباری برای تمام کامپوننت‌ها و صفحات است. قبل از کدنویسی حتماً بخوانید.

## مسیر ریشه

`D:\front end\shoes website\frontend\` — آلیاس `@` به `src` نگاشت شده است.

## زبان و جهت

- **همه‌چیز فارسی** است. هیچ متن انگلیسی در UI استفاده نمی‌شود (جز مقادیر فنی مثل SKU، URL، کد کوپن).
- کل صفحه RTL است (`<html dir="rtl">`). افکت‌ها و فاصله‌ها بر اساس RTL نوشته شوند.
- اعداد: همیشه با `toFaDigits()` یا `formatPrice()` از `src/utils/format.js` به ارقام فارسی تبدیل شوند.

## تایپوگرافی

- فونت پیش‌فرض: **Dana** (کلاس `font-dana`). همه‌چیز به‌طور خودکار Dana است.
- **Morabba** فقط برای: عنوان‌ها، هیرو، نام محصول، قیمت، بنرها و عناصر برجسته → کلاس `font-morabba`.
- سلسله‌مراتب:
  - عنوان صفحه/سکشن: `font-morabba font-bold` سایز ۲xl تا ۴xl
  - نام محصول: `font-morabba font-semibold`
  - قیمت: `font-morabba font-bold`
  - بدنه/پاراگراف/جدول/فرم: `font-dana` (پیش‌فرض)
  - دکمه: `font-semibold`

## پالت و تم

- رنگ‌ها از متغیرهای CSS در `src/styles/globals.css` آمده‌اند: `brand` (نیلی-بنفش)، `accent` (کهربایی)، `background`, `surface`, `card`, `foreground`, `muted`, `muted-foreground`, `border`.
- تم تاریک با کلاس `.dark` روی `<html>` فعال می‌شود (دکمه تغییر تم در Navbar موجود است).
- کارت‌ها: `card-elevated` یا `bg-card border border-border/60 rounded-2xl shadow-soft`.
- شیشه‌ای: کلاس `glass` یا `backdrop-blur-xl bg-card/80`.
- گرادیان برند: `bg-brand-gradient`، گرادیان آکنت: `bg-accent-gradient`.

## کامپوننت‌های آماده (از src/components/ui)

`Button`, `Input`, `Select`, `Checkbox`, `Switch`, `Badge`, `Rating`, `Modal`, `Drawer`, `Dropdown` + `DropdownItem`, `Tooltip`, `Tabs`, `Accordion`, `Pagination`, `Breadcrumb`, `Skeleton`, `SkeletonCard`, `SkeletonTable`, `SkeletonProductGrid`, `Spinner`, `EmptyState`, `StatCard`, `PriceTag`, `QuantityStepper`, `CountdownBox`, `StatusBadge`, `Reveal`, `Stagger`, `StaggerItem`, `SectionHeading`, `ShoeArtwork`, `ProductImage`.

**نکته:** هرکدام یک خروجی پیش‌فرض (default export) دارند به‌جز `Reveal/Stagger/StaggerItem/Skeleton*` که نام‌دار (named) یا پیش‌فرض دارند — در صورت نیاز از `import X, { Y } from '...'` استفاده کنید.

- `ProductImage` از `src/components/ui/ProductImage.jsx`: `product` + اختیاری `colorIndex` و `variant`. تصویر محصول را هوشمندانه رندر می‌کند. برای کارت محصول حتماً از این استفاده کنید.
- `ProductCard` از `src/components/product/ProductCard.jsx`: `{ product, index }` — سبد/ویش‌لیست/مقایسه/کوئیک‌ویو را خودش مدیریت می‌کند.
- `ProductGrid` از `src/components/product/ProductGrid.jsx`: `{ products, loading, cols }`.

## کامپونتکست‌ها (src/contexts)

- `useCart()` → `items, count, subtotal, discount, shipping, tax, total, coupon, addItem(product, {color, size, quantity}), removeItem(key), updateQuantity(key, q), clearCart, applyCoupon(fn, code), removeCoupon, openCart, closeCart`
- `useAuth()` → `user, login, register, logout, isAdmin, updateUser`
- `useWishlist()` → `wishlist, isInWishlist(id), toggleWishlist(id), removeFromWishlist(id)`
- `useCompare()` → `compareList, isInCompare(id), toggleCompare(id), removeFromCompare(id), clearCompare`
- `useTheme()` → `theme, toggleTheme`
- `useToast()` → `toast.success(msg, title?)`, `toast.error(msg)`, `toast.info(msg)`

## سرویس‌ها (src/services)

- `productService.getProducts(params)` → `{ data, pagination }`؛ پارامترها: `search, category, brand, color, size, gender, material, minPrice, maxPrice, availability, discount, sort, page, perPage`
- `productService.getProduct(slug)` → محصول + `reviews` + `related`
- `productService.getCategories()`, `getBrands()`, `liveSearch(query)`
- `authService.login/register/getMe/logout/getUserOrders/updateProfile/changePassword`

## داده‌های نمونه (src/data/mockData.js)

- `PRODUCTS` (هر محصول: `id, slug, name, brand:{name}, category:{name,slug}, gender, price, compareAtPrice, discountPercent, rating, reviewCount, colors[{name,hex,palette,images}], sizes, stock, palette, images, material, tags, featured, isNew, bestSeller, flashSale, limited, createdAt, description, specs{}`)
- `CATEGORIES`, `BRANDS`, `COUPONS`, `ORDERS`, `USERS`, `NOTIFICATIONS`, `TESTIMONIALS`, `FAQS`, `ADDRESSES`, `TICKETS`, `SALES_CHART`, `SALES_BY_CATEGORY`, `TOP_PRODUCTS`, `ACTIVITY_LOG`
- `getProductBySlug(slug)`, `getProductById(id)`, `getProductReviews(productId)`

## قوانین کد

- بدون کامنت غیرضروری؛ کد تمیز، خواناتر و اسم‌دار.
- انیمیشن‌ها با `framer-motion`؛ اسکرول با `Reveal/Stagger`.
- آیکون‌ها از `lucide-react`.
- همه فرم‌ها با `react-hook-form` (زیرساخت نصب شده است).
- صفحات و کامپوننت‌های دیتا محور حالت `loading` با `Skeleton*` و حالت خالی با `EmptyState` داشته باشند.
- از `cn()` در `src/utils/format.js` برای ترکیب کلاس‌ها استفاده کنید.
- صفحات بینام: خروجی پیش‌فرض یک کامپوننت `export default function PageName() {...}`.

## فایل‌های مجاز برای ساخت

فقط فایل‌های تعیین‌شده در پرامپت خود را بسازید و **فایل‌های دیگر را تغییر ندهید**. از ساخت فایل‌های تکراری/اضافی خودداری کنید.
