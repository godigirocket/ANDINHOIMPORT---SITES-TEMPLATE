import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export interface DockLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

function DockIcon({ mouseX, link }: { mouseX: MotionValue<number>; link: DockLink }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const Icon = link.icon;

  const distance = useTransform(mouseX, val => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    return val - bounds.x - bounds.width / 2;
  });

  const sizeSync = useTransform(distance, [-120, 0, 120], [34, 54, 34]);
  const size = useSpring(sizeSync, { mass: 0.15, stiffness: 220, damping: 16 });

  return (
    <a ref={ref} href={link.href} className="group relative flex flex-col items-center" aria-label={link.label}>
      <motion.span style={{ width: size, height: size }} className="flex items-center justify-center rounded-2xl">
        <Icon className="w-1/2 h-1/2" style={{ color: '#fff' }} strokeWidth={1.7} />
      </motion.span>
      <span
        className="pointer-events-none absolute -top-8 rounded-md px-2 py-1 text-[10px] font-semibold whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        {link.label}
      </span>
    </a>
  );
}

/** Nav estilo dock do macOS — ícones ampliam por proximidade do cursor. */
export function Dock({ links }: { links: DockLink[] }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={e => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="hidden md:flex items-end gap-1.5 px-3 py-2 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)' }}
    >
      {links.map(link => (
        <DockIcon key={link.href} mouseX={mouseX} link={link} />
      ))}
    </motion.div>
  );
}
