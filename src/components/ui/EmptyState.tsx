import React from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button';
import { UserPlus, Users, Search } from 'lucide-react';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  variant?: 'default' | 'search' | 'contacts';
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, variant = 'default', ...props }, ref) => {
    const defaultIcon = {
      default: <Users className="h-12 w-12 text-gray-400" />,
      search: <Search className="h-12 w-12 text-gray-400" />,
      contacts: <UserPlus className="h-12 w-12 text-gray-400" />,
    }[variant];

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center',
          className
        )}
        {...props}
      >
        <div className="mb-4">
          {icon || defaultIcon}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          {title}
        </h3>
        {description && (
          <p className="mb-6 max-w-sm text-sm text-gray-500">
            {description}
          </p>
        )}
        {action && (
          <Button
            variant={action.variant || 'primary'}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export { EmptyState };