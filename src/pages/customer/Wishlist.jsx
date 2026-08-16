import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import PageHeader from '../../components/customer/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import ProductCard from '../../components/product/ProductCard';
import { useWishlist } from '../../contexts/WishlistContext';
import { getProductById } from '../../data/mockData';
import { toFaDigits } from '../../utils/format';

export default function Wishlist() {
  const { wishlist } = useWishlist();

  const products = useMemo(
    () =>
      wishlist
        .map(getProductById)
        .filter(Boolean),
    [wishlist]
  );

  return (
    <div>
      <PageHeader
        eyebrow="علاقه‌مندی‌ها"
        title="محصولات مورد علاقه"
        description={`${toFaDigits(products.length)} محصول در لیست علاقه‌مندی‌های شما ثبت شده است.`}
      />

      {products.length === 0 ? (
        <EmptyState
          icon="wishlist"
          title="لیست علاقه‌مندی‌ها خالی است"
          description="محصولات مورد علاقه خود را نشان کنید تا سریع‌تر به آن‌ها دسترسی داشته باشید."
          action={
            <Link
              to="/shop"
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow-sm"
            >
              <ShoppingBag size={16} />
              رفتن به فروشگاه
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
