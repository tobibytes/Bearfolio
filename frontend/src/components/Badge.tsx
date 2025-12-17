import { ReactNode } from 'react';

export type BadgeTone =
  | 'gray'
  | 'brand'
  | 'green'
  | 'blue'
  | 'orange'
  | 'purple'
  | 'pink'
  | 'amber';

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export const Badge = ({ children, tone = 'gray', className = '' }: BadgeProps) => {
  const tones: Record<BadgeTone, string> = {
    gray: 'bg-slate-100 text-slate-700',
    brand: 'bg-brand.soft text-brand.dark',
    green: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-blue-100 text-blue-700',
    orange: 'bg-orange-100 text-orange-700',
    purple: 'bg-purple-100 text-purple-700',
    pink: 'bg-pink-100 text-pink-700',
    amber: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
};
