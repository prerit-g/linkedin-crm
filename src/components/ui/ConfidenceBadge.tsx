import React from 'react';
import { cn } from '../../utils/cn';
import { Confidence } from '../../types/contact';

export interface ConfidenceBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  confidence: Confidence;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const confidenceConfig: Record<Confidence, { label: string; variant: string; dotColor: string }> = {
  HIGH: { label: 'High', variant: 'bg-green-100 text-green-800', dotColor: 'bg-green-500' },
  MEDIUM: { label: 'Medium', variant: 'bg-amber-100 text-amber-800', dotColor: 'bg-amber-500' },
  LOW: { label: 'Low', variant: 'bg-red-100 text-red-800', dotColor: 'bg-red-500' },
};

const ConfidenceBadge = React.forwardRef<HTMLDivElement, ConfidenceBadgeProps>(
  ({ className, confidence, showLabel = true, size = 'md', ...props }, ref) => {
    const config = confidenceConfig[confidence];
    
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium',
          {
            'sm': 'px-2 py-0.5 text-xs',
            'md': 'px-2.5 py-0.5 text-sm',
          }[size],
          config.variant,
          className
        )}
        {...props}
      >
        <span className={cn('h-2 w-2 rounded-full', config.dotColor)} />
        {showLabel && <span>{config.label}</span>}
      </div>
    );
  }
);

ConfidenceBadge.displayName = 'ConfidenceBadge';

export { ConfidenceBadge };