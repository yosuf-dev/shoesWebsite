import ShoeArtwork from './ShoeArtwork';

/**
 * رندر هوشمند تصویر محصول
 * اگر محصول URL عکس داشته باشد از <img> استفاده می‌شود،
 * در غیر این صورت تصویر برداری کفش با پالت رنگی همان محصول نمایش داده می‌شود.
 */
export default function ProductImage({
  product,
  colorIndex = 0,
  variant = 'side',
  className = '',
  ...props
}) {
  const color = product.colors?.[colorIndex];
  const palette = color?.palette || product.palette;
  const src = color?.images?.[0] || product.images?.[0];

  if (src && src.startsWith('http')) {
    return (
      <img
        src={src}
        alt={product.name}
        loading="lazy"
        className={`object-cover ${className}`}
        {...props}
      />
    );
  }

  return (
    <ShoeArtwork
      palette={palette}
      variant={variant}
      className={className}
      {...props}
    />
  );
}
