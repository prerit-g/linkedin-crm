import React from 'react';
import { cn } from '../../utils/cn';
import { ContactStatus } from '../../types/contact';

export interface StatusPillProps extends React.HTMLAttributes<HTMLDivElement> {
  status: ContactStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<ContactStatus, { label: string; variant: string }> = {
  NEW: { label: 'New', variant: 'bg-gray-100 text-gray-800' },
  REVIEW_REQUIRED: { label: 'Review Required', variant: 'bg-amber-100 text-amber-800' },
  MESSAGE_READY: { label: 'Message Ready', variant: 'bg-blue-100 text-blue-800' },
  APPROVED: { label: 'Approved', variant: 'bg-indigo-100 text-indigo-800' },
  CONTACTED: { label: 'Contacted', variant: 'bg-green-100 text-green-800' },
  REPLIED: { label: 'Replied', variant: 'bg-emerald-100 text-emerald-800' },
  FOLLOW_UP: { label: 'Follow Up', variant: 'bg-orange-100 text-orange-800' },
  NO_RESPONSE: { label: 'No Response', variant: 'bg-gray-100 text-gray-800' },
  NOT_RELEVANT: { label: 'Not Relevant', variant: 'bg-red-100 text-red-800' },
  REJECTED: { label: 'Rejected', variant: 'bg-red-100 text-red-800' },
};

const StatusPill = React.forwardRef<HTMLDivElement, StatusPillProps>(
  ({ className, status, size = 'md', ...props }, ref) => {
    const config = statusConfig[status];
    
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

StatusPill.displayName = 'StatusPill';

export { StatusPill };