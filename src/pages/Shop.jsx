import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import FilterSidebar from '../components/shop/FilterSidebar';
import ProductToolbar from '../components/shop/ProductToolbar';
import ProductGrid from '../components/product/ProductGrid';
import Pagination from '../components/ui/Pagination';
import Breadcrumb from '../components/ui/Breadcrumb';
import { getProducts, getCategories, getBrands } from '../services/productService';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { toFaDigits } from '../utils/format';

function useUrlFilters(searchParams) {
  return useMemo(() => {
    const getArray = (key) => searchParams.get(key)?.split(',').filter(Boolean) || [];
    return {
      search: searchParams.get('search') || '',
      category: getArray('category'),
      brand: getArray('brand'),
      gender: getArray('gender'),
      color: getArray('color'),
      size: getArray('size'),
      material: getArray('material'),
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      availability: searchParams.get('availability') || undefined,
      discount: searchParams.get('discount') === '1',
      newest: searchParams.get('newest') === '1',
      sort: searchParams.get('sort') || 'default',
    };
  }, [searchParams]);
}

function parseQuery(filters) {
  const params = {};
  ['category', 'brand', 'gender', 'color', 'size', 'material'].forEach((k) => {
    if (filters[k]?.length) params[k] = filters[k].join(',');
  });
  if (filters.search) params.search = filters.search;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.availability) params.availability = filters.availability;
  if (filters.discount) params.discount = '1';
  if (filters.newest) params.newest = '1';
  if (filters.sort && filters.sort !== 'default') params.sort = filters.sort;
  return params;
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const filters = useUrlFilters(searchParams);
  const [page, setPage] = useState(() => Number(searchParams.get('page')) || 1);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, hasMore: false });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cols, setCols] = useState(4);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [categoryNames, setCategoryNames] = useState({});
  const [brandNames, setBrandNames] = useState({});

  useEffect(() => {
    getCategories().then((c) =>
      setCategoryNames(Object.fromEntries(c.map((x) => [x.slug, x.name])))
    );
    getBrands().then((b) => setBrandNames(Object.fromEntries(b.map((x) => [x.slug, x.name]))));
  }, []);

  const queryKey = JSON.stringify(parseQuery(filters));

  const load = useCallback(
    async (targetPage, append = false) => {
      if (targetPage === 1) setLoading(true);
      else setLoadingMore(true);
      const res = await getProducts({ ...filters, page: targetPage, perPage: 12 });
      setPagination(res.pagination);
      setProducts((prev) => (append ? [...prev, ...res.data] : res.data));
      setLoading(false);
      setLoadingMore(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryKey]
  );

  useEffect(() => {
    setPage(1);
    load(1, false);
  }, [queryKey, load]);

  const handleChange = (next) => {
    const clean = {};
    Object.entries(next).forEach(([k, v]) => {
      if (Array.isArray(v) ? v.length : v !== undefined && v !== '' && v !== false) clean[k] = v;
    });
    setSearchParams(parseQuery(clean));
  };

  const handleReset = () => setSearchParams({});

  const handleSort = (sort) => handleChange({ ...filters, sort });

  const goPage = (p) => {
    setPage(p);
    setSearchParams({ ...parseQuery(filters), page: p > 1 ? p : undefined });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sentinelRef = useInfiniteScroll({
    onLoadMore: () => load(page + 1, true),
    hasMore: pagination.hasMore,
    loading: loading || loadingMore,
  });

  const activeCount = useMemo(() => {
    let n = 0;
    ['category', 'brand', 'gender', 'color', 'size', 'material'].forEach(
      (k) => (n += filters[k]?.length || 0)
    );
    if (filters.search) n += 1;
    if (filters.minPrice) n += 1;
    if (filters.maxPrice) n += 1;
    if (filters.availability) n += 1;
    if (filters.discount) n += 1;
    if (filters.newest) n += 1;
    return n;
  }, [filters]);

  const activeCategory = filters.category[0];

  return (
    <div className="container-app py-8">
      <Breadcrumb
        items={[
          { label: 'فروشگاه', to: '/shop' },
          ...(filters.search ? [{ label: `جستجو: ${filters.search}` }] : []),
          ...(activeCategory && categoryNames[activeCategory]
            ? [{ label: categoryNames[activeCategory] }]
            : []),
        ]}
      />

      {/* هدر */}
      <div className="mb-8 mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-morabba font-bold text-3xl text-foreground">
            {filters.search
              ? `نتایج جستجو برای «${filters.search}»`
              : activeCategory
                ? `کفش‌های ${categoryNames[activeCategory] || 'دسته انتخابی'}`
                : 'فروشگاه کفشینو'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            کفش اصل با گارانتی، ارسال سریع و ضمانت بازگشت ۷ روزه.
          </p>
        </div>
        {filters.search && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 self-start rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-red-500 sm:self-auto"
          >
            <X size={15} />
            حذف جستجو
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[290px_1fr]">
        {/* سایدبار دسکتاپ */}
        <aside className="hidden lg:block">
          <div className="sticky top-[180px] max-h-[calc(100vh-200px)] overflow-y-auto pl-1">
            <FilterSidebar
              filters={filters}
              onChange={handleChange}
              onReset={handleReset}
              activeCount={activeCount}
            />
          </div>
        </aside>

        {/* نتایج */}
        <div className="min-w-0">
          <ProductToolbar
            total={pagination.total}
            sort={filters.sort}
            onSort={handleSort}
            cols={cols}
            onCols={setCols}
            onOpenFilters={() => setMobileFilters(true)}
            className="mb-6"
          />

          <ProductGrid products={products} loading={loading} cols={cols} />

          {/* نشانگر لود بیشتر */}
          <div ref={sentinelRef} className="h-2" />
          {loadingMore && (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
              در حال بارگذاری…
            </div>
          )}

          {!loading && !loadingMore && pagination.totalPages > 1 && (
            <Pagination page={page} totalPages={pagination.totalPages} onChange={goPage} className="mt-8" />
          )}

          {/* بنر کوتاه */}
          <div className="mt-12 flex items-center gap-4 rounded-3xl bg-brand-gradient p-6 text-white">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15">
              <Sparkles size={22} />
            </span>
            <div>
              <p className="font-morabba font-bold text-lg">عضو باشگاه کفشینو شوید</p>
              <p className="mt-1 text-sm text-white/80">
                با ثبت‌نام رایگان از تخفیف‌های ویژه باشگاه مشتریان بهره‌مند شوید.
              </p>
            </div>
            <button
              onClick={() => navigate('/register')}
              className="mr-auto shrink-0 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition-all hover:shadow-glow"
            >
              ثبت‌نام رایگان
            </button>
          </div>
        </div>
      </div>

      {/* فیلتر موبایل */}
      <AnimatePresence>
        {mobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilters(false)}
              className="fixed inset-0 z-[95] bg-slate-950/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed right-0 top-0 z-[100] h-full w-[310px] overflow-y-auto bg-background p-4 lg:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-morabba font-bold text-lg text-foreground">فیلترها</span>
                <button
                  onClick={() => setMobileFilters(false)}
                  className="grid h-9 w-9 place-items-center rounded-xl hover:bg-muted/40"
                  aria-label="بستن"
                >
                  <X size={20} />
                </button>
              </div>
              <FilterSidebar
                filters={filters}
                onChange={handleChange}
                onReset={handleReset}
                activeCount={activeCount}
              />
              <button
                onClick={() => setMobileFilters(false)}
                className="btn-gradient mt-4 w-full rounded-xl py-3 text-sm font-semibold"
              >
                مشاهده {toFaDigits(pagination.total)} نتیجه
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
