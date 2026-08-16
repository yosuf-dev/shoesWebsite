import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Reveal from './Reveal';
import { toFaDigits } from '../../utils/format';

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  link,
  linkText = 'مشاهده همه',
  className = '',
}) {
  return (
    <Reveal className={`mb-8 flex items-end justify-between gap-6 ${className}`}>
      <div>
        {eyebrow && (
          <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-600 dark:text-brand-300">
            {eyebrow}
          </span>
        )}
        <h2 className="font-morabba font-bold text-2xl text-foreground sm:text-3xl">{title}</h2>
        {subtitle && (
          <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {link && (
        <Link
          to={link}
          className="group hidden shrink-0 items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-brand-500 hover:text-brand-500 sm:flex"
        >
          {toFaDigits(linkText)}
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        </Link>
      )}
    </Reveal>
  );
}
