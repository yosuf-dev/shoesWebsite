import { useMemo } from 'react';

/**
 * تصویر برداری (SVG) کفش با گرادیان‌های لوکس
 * به‌جای عکس واقعی برای دمو استفاده می‌شود و با هر پالت رنگی سازگار است.
 */
export default function ShoeArtwork({
  palette = { from: '#6366f1', to: '#8b5cf6', accent: '#ffffff' },
  variant = 'side',
  className = '',
  style = {},
}) {
  const uid = useMemo(
    () => `sg-${Math.random().toString(36).slice(2, 9)}`,
    []
  );

  const transforms = {
    side: 'none',
    front: 'scale(1)',
    angle: 'rotate(-8 200 120) scale(0.96)',
    top: 'scale(1)',
  };

  const transform = transforms[variant] || 'none';

  return (
    <svg
      viewBox="0 0 400 240"
      className={className}
      style={style}
      role="img"
      aria-label="کفش"
    >
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.from} />
          <stop offset="100%" stopColor={palette.to} />
        </linearGradient>
        <linearGradient id={`${uid}-sole`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id={`${uid}-sole-dark`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id={`${uid}-inner`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
        <filter id={`${uid}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#0f172a" floodOpacity="0.28" />
        </filter>
        <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <g transform={transform === 'none' ? undefined : transform}>
        {/* سایه روی زمین */}
        <ellipse
          cx="205"
          cy="212"
          rx={variant === 'front' ? 175 : 150}
          ry="16"
          fill="#0f172a"
          opacity="0.16"
        />

        {/* کف زیرین */}
        <path
          d="M60 196 L320 196 Q352 196 354 203 Q357 212 334 215 L98 215 Q72 215 66 207 Q62 201 60 196 Z"
          fill={`url(#${uid}-sole-dark)`}
        />

        {/* کف میانی */}
        <path
          d="M62 190 L318 190 Q348 190 350 198 Q353 206 332 208 L100 208 Q76 208 68 201 Q63 196 62 190 Z"
          fill={`url(#${uid}-sole)`}
        />

        {/* بدنه کفش */}
        <path
          d="M62 190
             C 58 166 66 142 82 130
             L 112 118
             C 132 110 152 106 172 110
             C 192 114 206 122 216 134
             C 226 146 246 156 278 164
             C 302 170 322 174 336 178
             Q 350 181 350 190
             L 62 190 Z"
          fill={`url(#${uid}-body)`}
          filter={`url(#${uid}-shadow)`}
        />

        {/* هایلایت براق بدنه */}
        <path
          d="M92 176 C 88 158 96 140 112 130 C 130 138 122 168 92 176 Z"
          fill={`url(#${uid}-inner)`}
          opacity="0.8"
        />

        {/* پنجه کفش */}
        <path
          d="M268 160 C 296 166 320 170 336 176 Q 350 180 350 190 L 300 190
             C 288 172 276 164 268 160 Z"
          fill="#ffffff"
          opacity="0.18"
        />

        {/* یقه (پاشنه) */}
        <path
          d="M78 146 C 82 136 96 126 110 120 C 122 132 112 146 90 152 C 82 154 76 152 78 146 Z"
          fill="#ffffff"
          opacity="0.25"
        />

        {/* نوار آکنت (شبیه لوگوی نایک) */}
        <path
          d="M128 158
             C 160 138 200 128 240 136
             C 252 138 258 144 254 152
             C 250 158 236 156 226 152
             C 200 142 168 146 142 160
             C 138 163 130 163 128 158 Z"
          fill={palette.accent}
          opacity="0.95"
        />

        {/* بندها */}
        <g stroke="#0f172a" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round">
          <line x1="176" y1="130" x2="164" y2="150" />
          <line x1="192" y1="132" x2="180" y2="154" />
          <line x1="208" y1="136" x2="196" y2="158" />
        </g>

        {/* سوراخ‌های بند */}
        <g fill="#0f172a" fillOpacity="0.45">
          <circle cx="182" cy="134" r="2.6" />
          <circle cx="198" cy="138" r="2.6" />
          <circle cx="214" cy="143" r="2.6" />
        </g>

        {/* درزهای دکوری */}
        <path
          d="M104 174 Q 110 150 120 138"
          fill="none"
          stroke="#0f172a"
          strokeOpacity="0.2"
          strokeWidth="2"
          strokeDasharray="4 5"
        />
        <path
          d="M250 168 Q 300 170 344 184"
          fill="none"
          stroke="#0f172a"
          strokeOpacity="0.15"
          strokeWidth="2"
          strokeDasharray="4 5"
        />
      </g>
    </svg>
  );
}
