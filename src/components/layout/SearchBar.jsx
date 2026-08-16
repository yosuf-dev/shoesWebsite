import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Package, RotateCcw } from 'lucide-react';
import { liveSearch } from '../../services/productService';
import { useDebounce } from '../../hooks/useDebounce';
import { STORAGE_KEYS } from '../../constants/config';
import ProductImage from '../ui/ProductImage';
import { toFaDigits } from '../../utils/format';

const POPULAR = ['ایر مکس', 'پگاسوس', 'کژوال', 'بسکتبال'];

export default function SearchBar({ className = '', autoFocus = false, onNavigate }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ products: [], brands: [], categories: [] });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.recentSearch) || '[]');
    } catch {
      return [];
    }
  });
  const debounced = useDebounce(query, 350);
  const boxRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!debounced.trim()) {
      setResults({ products: [], brands: [], categories: [] });
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    liveSearch(debounced).then((res) => {
      if (active) {
        setResults(res);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [debounced]);

  const saveRecent = (term) => {
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(next);
    localStorage.setItem(STORAGE_KEYS.recentSearch, JSON.stringify(next));
  };

  const submit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    saveRecent(query.trim());
    setOpen(false);
    onNavigate?.();
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  const goProduct = (slug) => {
    setOpen(false);
    onNavigate?.();
    navigate(`/product/${slug}`);
  };

  const goShop = (extra = '') => {
    setOpen(false);
    onNavigate?.();
    navigate(`/shop${extra}`);
  };

  return (
    <div ref={boxRef} className={`relative w-full ${className}`}>
      <form onSubmit={submit} className="relative">
        <Search
          size={18}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="جستجوی کفش، برند، دسته‌بندی…"
          autoFocus={autoFocus}
          className="h-11 w-full rounded-2xl border border-border bg-surface pl-4 pr-11 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults({ products: [], brands: [], categories: [] });
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="پاک کردن"
          >
            <X size={16} />
          </button>
        )}
      </form>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 left-0 top-full z-[80] mt-2 overflow-hidden rounded-3xl border border-border/70 bg-card shadow-lift"
          >
            <div className="max-h-[70vh] overflow-y-auto p-3">
              {/* جستجوهای اخیر */}
              {!query && recent.length > 0 && (
                <div className="mb-3">
                  <p className="mb-2 flex items-center gap-1.5 px-3 text-xs font-medium text-muted-foreground">
                    <Clock size={13} /> جستجوهای اخیر
                  </p>
                  <div className="flex flex-wrap gap-2 px-3">
                    {recent.map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setQuery(r);
                          submit();
                        }}
                        className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-foreground transition-colors hover:border-brand-500 hover:text-brand-500"
                      >
                        {r}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setRecent([]);
                        localStorage.removeItem(STORAGE_KEYS.recentSearch);
                      }}
                      className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-muted-foreground hover:text-red-500"
                    >
                      <RotateCcw size={12} /> پاک کردن
                    </button>
                  </div>
                </div>
              )}

              {/* جستجوهای محبوب */}
              {!query && (
                <div className="mb-2">
                  <p className="mb-2 flex items-center gap-1.5 px-3 text-xs font-medium text-muted-foreground">
                    <TrendingUp size={13} /> جستجوهای محبوب
                  </p>
                  <div className="flex flex-wrap gap-2 px-3">
                    {POPULAR.map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setQuery(p);
                          saveRecent(p);
                          goShop(`?search=${encodeURIComponent(p)}`);
                        }}
                        className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-600 dark:text-brand-300 transition-colors hover:bg-brand-500/20"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="space-y-2.5 p-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton h-16 w-full rounded-2xl" />
                  ))}
                </div>
              )}

              {!loading && query && (
                <>
                  {/* نتایج محصولات */}
                  {results.products.length > 0 && (
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 px-3 text-xs font-medium text-muted-foreground">
                        <Package size={13} /> محصولات
                      </p>
                      {results.products.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => goProduct(p.slug)}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-right transition-colors hover:bg-muted/40"
                        >
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted/30">
                            <ProductImage product={p} className="h-full w-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-sm text-foreground">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.brand.name} • {p.category.name}</p>
                          </div>
                          <span className="font-morabba font-bold text-sm text-foreground">
                            {toFaDigits(p.price.toLocaleString('fa-IR'))}
                            <span className="mr-1 text-[10px] font-dana text-muted-foreground">تومان</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* برندها */}
                  {results.brands.length > 0 && (
                    <div className="mt-3 border-t border-border/50 pt-3">
                      <p className="mb-2 px-3 text-xs font-medium text-muted-foreground">برندها</p>
                      {results.brands.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => goShop(`?brand=${b.slug}`)}
                          className="w-full rounded-xl px-3 py-2 text-right text-sm text-foreground transition-colors hover:bg-muted/40"
                        >
                          برند {b.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* دسته‌بندی‌ها */}
                  {results.categories.length > 0 && (
                    <div className="mt-3 border-t border-border/50 pt-3">
                      <p className="mb-2 px-3 text-xs font-medium text-muted-foreground">دسته‌بندی‌ها</p>
                      {results.categories.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => goShop(`?category=${c.slug}`)}
                          className="w-full rounded-xl px-3 py-2 text-right text-sm text-foreground transition-colors hover:bg-muted/40"
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {results.products.length === 0 &&
                    results.brands.length === 0 &&
                    results.categories.length === 0 && (
                      <div className="px-3 py-8 text-center">
                        <p className="text-sm text-muted-foreground">
                          نتیجه‌ای برای «{query}» پیدا نشد.
                        </p>
                        <button
                          onClick={submit}
                          className="mt-3 text-sm font-medium text-brand-600 dark:text-brand-300 hover:underline"
                        >
                          مشاهده همه نتایج
                        </button>
                      </div>
                    )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
