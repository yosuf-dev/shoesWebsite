import { motion } from 'framer-motion';

export default function Spinner({ size = 24, className = '' }) {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      className={`inline-block rounded-full border-[3px] border-brand-500/25 border-t-brand-500 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
