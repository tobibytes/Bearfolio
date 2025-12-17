import { SelectHTMLAttributes, ReactNode } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

export const Select = ({ className = '', children, ...props }: Props) => (
  <select className={`select-base ${className}`} {...props}>
    {children}
  </select>
);
