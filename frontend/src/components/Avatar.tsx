interface Props {
  name: string;
  src: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-16 w-16 text-base',
};

export const Avatar = ({ name, src, size = 'md' }: Props) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`relative overflow-hidden rounded-full bg-slate-100 text-slate-700 ${sizes[size]} flex items-center justify-center`}>
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className="font-semibold">{initials}</span>
      )}
    </div>
  );
};
