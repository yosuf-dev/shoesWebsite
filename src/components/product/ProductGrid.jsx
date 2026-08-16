import ProductCard from './ProductCard';
import { SkeletonProductGrid } from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';

export default function ProductGrid({ products, loading = false, cols = '5', emptyProps = {} }) {
  const colClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  };

  if (loading) return <SkeletonProductGrid count={cols * 2} />;

  if (!products?.length) {
    return (
      <EmptyState
        title={emptyProps.title || 'محصولی یافت نشد'}
        description={emptyProps.description || 'موارد موجود را با فیلترهای دیگری امتحان کنید.'}
        icon={emptyProps.icon || 'search'}
      />
    );
  }

  return (
    <div className={`grid gap-4 sm:gap-6 ${colClasses[cols]}`}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}
