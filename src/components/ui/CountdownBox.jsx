import { useEffect, useRef } from 'react';
import { toFaDigits } from '../../utils/format';

export default function CountdownBox({ days, hours, minutes, seconds, size = 'md' }) {
  const showDays = days > 0;
  const parts = [
    showDays && { label: 'روز', value: days },
    { label: 'ساعت', value: hours },
    { label: 'دقیقه', value: minutes },
    { label: 'ثانیه', value: seconds },
  ].filter(Boolean);

  const prevRef = useRef({});
  useEffect(() => {
    prevRef.current = { days, hours, minutes, seconds };
  }, [days, hours, minutes, seconds]);

  return (
    <div className="flex items-center gap-2" dir="ltr">
      {parts.map((part, i) => (
        <div key={part.label} className="flex items-center gap-2">
          <div className="relative flex flex-col items-center justify-center rounded-xl bg-card/90 border border-border/60 backdrop-blur-md shadow-softer px-3 py-2 min-w-14">
            <span className={`font-morabba font-bold text-foreground ${size === 'lg' ? 'text-2xl' : 'text-xl'}`}>
              {toFaDigits(part.value).padStart(2, '۰')}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">{part.label}</span>
          </div>
          {i < parts.length - 1 && (
            <span className="text-xl font-bold text-brand-500">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
