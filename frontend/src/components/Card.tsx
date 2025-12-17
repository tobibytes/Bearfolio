import { ReactNode } from 'react';

interface CardProps {
  className?: string;
  children: ReactNode;
}

export const Card = ({ className = '', children }: CardProps) => {
  return <div className={`card-base ${className}`}>{children}</div>;
};
