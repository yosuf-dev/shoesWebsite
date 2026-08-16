import { useCallback, useEffect, useRef } from 'react';

/**
 * اینفینیت اسکرول — با IntersectionObserver
 */
export function useInfiniteScroll({ onLoadMore, hasMore, loading }) {
  const sentinelRef = useRef(null);

  const callback = useCallback(
    (entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        onLoadMore?.();
      }
    },
    [hasMore, loading, onLoadMore]
  );

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(callback, { rootMargin: '300px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [callback]);

  return sentinelRef;
}
