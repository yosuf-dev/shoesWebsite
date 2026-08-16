import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '../../data/mockData';
import SectionHeading from '../ui/SectionHeading';
import Rating from '../ui/Rating';
import { Stagger, StaggerItem } from '../ui/Reveal';

export default function Testimonials() {
  return (
    <section className="container-app py-16">
      <SectionHeading
        eyebrow="رضایت مشتریان"
        title="چه می‌گویند مشتریان کفشینو؟"
        subtitle="اعتماد شما بزرگ‌ترین سرمایه ماست."
      />
      <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map((t) => (
          <StaggerItem key={t.id}>
            <motion.div
              whileHover={{ y: -6 }}
              className="relative flex h-full flex-col rounded-3xl border border-border/60 bg-card p-6 shadow-softer"
            >
              <Quote size={30} className="absolute left-5 top-5 text-brand-500/15" />
              <Rating value={t.rating} showValue={false} />
              <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">«{t.text}»</p>
              <div className="mt-5 flex items-center gap-3 border-t border-border/50 pt-4">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-gradient text-sm font-bold text-white">
                  {t.avatar}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
