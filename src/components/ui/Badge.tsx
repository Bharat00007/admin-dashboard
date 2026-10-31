import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'primary' | 'secondary';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = true
}) => {
  const variantStyles = {
    success: {
      bg: 'bg-tertiary/10 text-tertiary',
      dot: 'bg-tertiary'
    },
    warning: {
      bg: 'bg-secondary-container/20 text-secondary',
      dot: 'bg-secondary-container'
    },
    error: {
      bg: 'bg-error/10 text-error',
      dot: 'bg-error'
    },
    neutral: {
      bg: 'bg-surface-container-high text-on-surface-variant',
      dot: 'bg-outline'
    },
    primary: {
      bg: 'bg-primary/10 text-primary',
      dot: 'bg-primary'
    },
    secondary: {
      bg: 'bg-secondary-container/20 text-secondary',
      dot: 'bg-secondary-container'
    }
  }[variant];

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-label-sm text-[11px]' : 'px-2.5 py-0.5 text-label-md text-[12px]';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold select-none ${variantStyles.bg} ${sizeStyles}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${variantStyles.dot}`} />}
      {children}
    </span>
  );
};

