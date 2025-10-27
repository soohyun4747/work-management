'use client';

import { Users } from 'lucide-react';

interface Member {
  id: number;
  name: string;
  avatar: string;
}

interface MemberAvatarGroupProps {
  members: Member[];
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export default function MemberAvatarGroup({
  members,
  maxVisible = 3,
  size = 'md',
  showIcon = true,
  className = '',
}: MemberAvatarGroupProps) {
  const sizes = {
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-6 h-6 text-xs',
    lg: 'w-8 h-8 text-sm',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const visibleMembers = members.slice(0, maxVisible);
  const remainingCount = members.length - maxVisible;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && <Users size={iconSizes[size]} className="text-gray-400" />}
      <div className="flex items-center -space-x-1.5">
        {visibleMembers.map((member) => (
          <div
            key={member.id}
            className={`${sizes[size]} rounded-full bg-blue-100 border-2 border-white flex items-center justify-center`}
            title={member.name}
          >
            {member.avatar}
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className={`${sizes[size]} rounded-full bg-gray-200 border-2 border-white flex items-center justify-center font-medium`}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  );
}
