'use client';

import { useRef, type PointerEvent, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

/** Fade-up saat elemen masuk viewport; noop bila user memilih reduced motion. */
export function Reveal({ children, delay = 0, y = 28, className }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-72px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  maxMove?: number;
  hoverScale?: number;
  perspective?: number;
};

/**
 * Hover card: tilt + translate mengikuti posisi pointer,
 * tilt + translate mengikuti posisi pointer, scale saat hover, reset saat keluar.
 * Nonaktif untuk pointer kasar (sentuh) dan reduced motion.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 8,
  maxMove = 12,
  hoverScale = 1.02,
  perspective = 900,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useRef(false);
  const reduce = useReducedMotion();

  const onEnter = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    fine.current = true;
    const el = ref.current;
    if (!el) return;
    el.style.willChange = 'transform';
    el.style.transformStyle = 'preserve-3d';
    el.style.transition = 'transform 140ms ease-out';
    el.style.transform = `perspective(${perspective}px) translate3d(0px,0px,0px) rotateX(0deg) rotateY(0deg) scale(${hoverScale})`;
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || !fine.current) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const cx = (px - 0.5) * 2;
    const cy = (py - 0.5) * 2;
    const tx = clamp(cx * maxMove, -maxMove, maxMove);
    const ty = clamp(cy * maxMove, -maxMove, maxMove);
    const rx = clamp(-cy * maxTilt, -maxTilt, maxTilt);
    const ry = clamp(cx * maxTilt, -maxTilt, maxTilt);
    el.style.transition = 'transform 40ms linear';
    el.style.transform =
      `perspective(${perspective}px) ` +
      `translate3d(${tx}px, ${ty}px, 0px) ` +
      `rotateX(${rx}deg) rotateY(${ry}deg) ` +
      `scale(${hoverScale})`;
  };

  const onLeave = () => {
    if (reduce || !fine.current) return;
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'transform 180ms ease-out';
    el.style.transform = `perspective(${perspective}px) translate3d(0px,0px,0px) rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  return (
    <div ref={ref} className={className} onPointerEnter={onEnter} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}
