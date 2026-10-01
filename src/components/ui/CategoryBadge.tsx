import React from 'react';
import { cn } from '../../utils/cn';
import { Category } from '../../types/contact';

export interface CategoryBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  category: Category | 'MANUAL_REVIEW';
  size?: 'sm' | 'md';
}

const categoryConfig: Record<Category | 'MANUAL_REVIEW', { label: string; variant: string }> = {
  CATEGORY_1: { label: 'Category 1', variant: 'bg-blue-100 text-blue-800' },
  CATEGORY_2: { label: 'Category 2', variant: 'bg-purple-100 text-purple-800' },
  CATEGORY_3: { label: 'Category 3', variant: 'bg-teal-100 text-teal-800' },
  MANUAL_REVIEW: { label: 'Manual Review', variant: 'bg-amber-100 text-amber-800' },
};

const CategoryBadge = React.forwardRef<HTMLDivElement, CategoryBadgeProps>(
  ({ className, category, size = 'md', ...props }, ref) => {
    const config = categoryConfig[category];
    
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          {
            'sm': 'px-2 py-0.5 text-xs',
            'md': 'px-2.5 py-0.5 text-sm',
          }[size],
          config.variant,
          className
        )}
        {...props}
      >
        {config.label}
      </div>
    );
  }
);

CategoryBadge.displayName = 'CategoryBadge';

export { CategoryBadge };