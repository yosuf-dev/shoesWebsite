import { formatPrice, formatToman } from '../../utils/format';

export default function PriceTag({
  price,
  compareAtPrice,
  size = 'md',
  className = '',
  light = false,
}) {
  const sizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const textColor = light ? 'text-white' : 'text-foreground';

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className={`font-morabba font-bold ${sizes[size]} ${textColor}`}>
        {formatPrice(price)}
        <span className={`mr-1.5 ${size === 'sm' ? 'text-xs' : 'text-sm'} font-dana font-medium`}>
          تومان
        </span>
      </span>
      {compareAtPrice && compareAtPrice > price && (
        <span className="font-dana text-sm text-muted-foreground line-through opacity-70">
          {formatToman(compareAtPrice)}
        </span>
      )}
    </div>
  );
}
