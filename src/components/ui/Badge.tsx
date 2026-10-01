import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'destructive';
  size?: 'sm' | 'md';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          {
            'sm': 'px-2 py-0.5 text-xs',
            'md': 'px-2.5 py-0.5 text-sm',
          }[size],
          {
            'default': 'bg-gray-100 text-gray-800',
            'primary': 'bg-indigo-100 text-indigo-800',
            'secondary': 'bg-gray-100 text-gray-800',
            'outline': 'border border-gray-300 text-gray-800',
            'destructive': 'bg-red-100 text-red-800',
          }[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };