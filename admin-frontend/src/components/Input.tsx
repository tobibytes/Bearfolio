import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

export const Input = ({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={`input-base ${className}`} {...props} />
);

export const TextArea = ({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={`input-base h-28 resize-none ${className}`} {...props} />
);
