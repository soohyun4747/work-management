'use client';

import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  iconSize?: number;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  iconSize = 48,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`text-center py-8 text-gray-500 ${className}`}>
      {Icon && (
        <Icon
          size={iconSize}
          className="mx-auto mb-3 opacity-30"
        />
      )}
      {title && (
        <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
      )}
      {description && (
        <p className="text-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
