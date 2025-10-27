'use client';

import { LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
  label: string;
  icon?: LucideIcon;
  color?: string;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export default function StatusBadge({
  label,
  icon: Icon,
  color,
  variant = 'default',
  size = 'md',
  className = '',
}: StatusBadgeProps) {
  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
  };

  const iconSizes = {
    sm: 10,
    md: 12,
  };

  const baseStyles = 'rounded-full font-medium inline-flex items-center gap-1';

  return (
    <span
      className={`${baseStyles} ${sizes[size]} ${color || 'bg-gray-100 text-gray-700'} ${className}`}
    >
      {Icon && <Icon size={iconSizes[size]} />}
      {label}
    </span>
  );
}
