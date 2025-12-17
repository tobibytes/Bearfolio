import { ReactNode } from 'react';

const tones = {
  gray: 'bg-slate-100 text-slate-700',
  brand: 'bg-brand.soft text-brand.dark',
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
};

type Tone = keyof typeof tones;

export const Badge = ({ children, tone = 'gray', className = '' }: { children: ReactNode; tone?: Tone; className?: string }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]} ${className}`}>
    {children}
  </span>
);
