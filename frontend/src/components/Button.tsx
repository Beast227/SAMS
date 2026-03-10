import { Loader2, type LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary';
  label: string;
}

export default function Button({
  isLoading,
  icon: Icon,
  label,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {

  const variants = {
    primary: "bg-(--color-primary) text-white hover:bg-(--color-primary-hover)",
    secondary: "bg-(--color-panel) text-gray-700 border border-(--color-card-border) hover:bg-gray-100"
  };

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`
        w-full py-3 rounded-xl font-semibold transition-all 
        flex items-center justify-center gap-2 
        disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
        ${variants[variant]}
        ${className}
      `}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {label}
        </>
      )}
    </button>
  );
}