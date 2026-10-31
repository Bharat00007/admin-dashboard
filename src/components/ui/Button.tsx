import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-label-md transition-all duration-150 rounded-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

  const sizeClasses = {
    sm: 'px-3 py-1.5 min-h-[36px] text-label-sm gap-1.5 text-[12px]',
    md: 'px-4 py-2 min-h-[40px] text-label-md gap-2 text-[13px]',
    lg: 'px-5 py-2.5 min-h-[44px] text-label-lg gap-2.5 text-[14px]'
  }[size];

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-container text-on-primary shadow-sm',
    secondary: 'bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/40',
    danger: 'bg-error/10 hover:bg-error/20 text-error border border-error/20',
    ghost: 'hover:bg-surface-container text-on-surface-variant hover:text-on-surface',
    accent: 'bg-secondary-container hover:bg-secondary text-on-secondary shadow-sm'
  }[variant];

  return (
    <button className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`} {...props}>
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {children}
    </button>
  );
};

