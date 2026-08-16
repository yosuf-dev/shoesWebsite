import { useState } from 'react';
import { cn } from '../../utils/format';

export default function Tabs({ tabs, defaultIndex = 0, onChange, className = '' }) {
  const [active, setActive] = useState(defaultIndex);

  const select = (i) => {
    setActive(i);
    onChange?.(i, tabs[i]);
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex gap-1 border-b border-border/70 overflow-x-auto no-scrollbar">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => select(i)}
            className={cn(
              'relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
              active === i
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
            {active === i && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-gradient" />
            )}
          </button>
        ))}
      </div>
      <div className="py-5">{tabs[active]?.content}</div>
    </div>
  );
}
