import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Star, BadgeCheck, ThumbsUp, Edit3, MessageCircle } from 'lucide-react';
import Rating from '../ui/Rating';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { cn, toFaDigits, formatFaDate } from '../../utils/format';

const AVATAR_COLORS = [
  'from-brand-500 to-violet-600',
  'from-rose-500 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-sky-500 to-indigo-600',
];

/**
 * بخش نظرات محصول — خلاصه امتیاز، نوار پیشرفت هر ستاره، لیست نظرات و فرم ثبت نظر
 */
export default function ReviewSection({ product }) {
  const { user } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState(product.reviews || []);
  const [hover, setHover] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { name: user?.name || '', rating: 0, title: '', text: '' },
  });

  const rating = watch('rating');

  const total = Math.max(items.length, product.reviewCount || 1);

  const distribution = useMemo(() => {
    const d = [0, 0, 0, 0, 0];
    items.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) d[r.rating - 1] += 1;
    });
    return d;
  }, [items]);

  const onSubmit = (data) => {
    const newReview = {
      id: `local-${Date.now()}`,
      productId: product.id,
      author: data.name,
      rating: Number(data.rating),
      date: new Date().toISOString(),
      title: data.title,
      text: data.text,
      verified: false,
      likes: 0,
    };
    setItems((prev) => [newReview, ...prev]);
    toast.success('نظر شما ثبت شد', 'پس از بررسی در دیدگاه‌ها نمایش داده می‌شود');
    reset({ name: data.name, rating: 0, title: '', text: '' });
  };

  return (
    <div className="space-y-8">
      {/* خلاصه امتیاز و توزیع ستاره‌ها */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-surface p-6 text-center">
          <p className="font-morabba font-black text-5xl text-foreground">{toFaDigits(product.rating.toFixed(1))}</p>
          <Rating value={product.rating} size={18} showValue={false} className="mt-2 justify-center" />
          <p className="mt-2 text-sm text-muted-foreground">از {toFaDigits(product.reviewCount || items.length)} دیدگاه</p>
        </div>
        <div className="space-y-2.5 rounded-2xl border border-border/60 bg-surface p-6 lg:col-span-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star - 1] || 0;
            const pct = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="flex w-10 items-center gap-1 text-sm font-medium text-foreground">
                  {toFaDigits(star)}
                  <Star size={13} className="fill-accent-400 text-accent-400" />
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-accent-gradient transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-left text-xs text-muted-foreground">{toFaDigits(count)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* لیست نظرات */}
      {items.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((review, i) => (
            <article key={review.id} className="rounded-2xl border border-border/60 bg-surface p-5">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    'grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br text-sm font-bold text-white',
                    AVATAR_COLORS[i % AVATAR_COLORS.length]
                  )}
                >
                  {review.author?.[0] || 'ک'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{review.author}</p>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">
                          <BadgeCheck size={14} />
                          خرید تایید شده
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{formatFaDate(review.date)}</span>
                  </div>
                  <Rating value={review.rating} showValue={false} size={14} className="mt-1.5" />
                  {review.title && (
                    <h4 className="mt-2.5 font-morabba font-semibold text-base text-foreground">{review.title}</h4>
                  )}
                  <p className="mt-1.5 text-sm leading-7 text-muted-foreground">{review.text}</p>
                  {review.likes > 0 && (
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ThumbsUp size={14} />
                      {toFaDigits(review.likes)} نفر این دیدگاه را مفید دانستند
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface py-10 text-center">
          <MessageCircle size={32} className="mb-3 text-muted-foreground/60" />
          <p className="text-sm text-muted-foreground">هنوز دیدگاهی ثبت نشده است. اولین نفر باشید!</p>
        </div>
      )}

      {/* فرم ثبت نظر */}
      {user ? (
        <div className="rounded-2xl border border-border/60 bg-surface p-6">
          <h4 className="mb-1 flex items-center gap-2 font-morabba font-semibold text-lg text-foreground">
            <Edit3 size={18} className="text-brand-600 dark:text-brand-300" />
            ثبت دیدگاه شما
          </h4>
          <p className="mb-5 text-sm text-muted-foreground">تجربه‌ی خود را از این محصول با دیگران به اشتراک بگذارید.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="نام شما"
                placeholder="مثلاً سارا محمدی"
                error={errors.name?.message}
                {...register('name', { required: 'نام را وارد کنید' })}
              />
              <div>
                <label className="label-app">امتیاز شما</label>
                <div className="flex items-center gap-1.5" dir="ltr">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setValue('rating', star, { shouldValidate: true })}
                      aria-label={`${star} ستاره`}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={24}
                        className={
                          star <= (hover || rating)
                            ? 'fill-accent-400 text-accent-400'
                            : 'fill-muted/40 text-muted/50'
                        }
                      />
                    </button>
                  ))}
                </div>
                {errors.rating && <p className="mt-1.5 text-xs text-red-500">{errors.rating.message}</p>}
              </div>
            </div>
            <Input
              label="عنوان دیدگاه"
              placeholder="خلاصه‌ای از تجربه شما"
              error={errors.title?.message}
              {...register('title', { required: 'عنوان دیدگاه را وارد کنید' })}
            />
            <div>
              <label className="label-app">متن دیدگاه</label>
              <textarea
                rows={4}
                placeholder="تجربه‌ی خرید و استفاده‌ی خود را بنویسید..."
                className={cn('input-app resize-none', errors.text && 'border-red-500 focus:border-red-500 focus:ring-red-500/15')}
                {...register('text', {
                  required: 'متن دیدگاه را وارد کنید',
                  minLength: { value: 10, message: 'دیدگاه حداقل ۱۰ کاراکتر باشد' },
                })}
              />
              {errors.text && <p className="mt-1.5 text-xs text-red-500">{errors.text.message}</p>}
            </div>
            <Button type="submit" icon={Edit3}>ثبت دیدگاه</Button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-sm text-muted-foreground">برای ثبت دیدگاه ابتدا وارد حساب کاربری خود شوید.</p>
          <Link to="/login">
            <Button variant="secondary" className="mt-4">ورود / ثبت‌نام</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
