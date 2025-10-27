'use client';

import { Menu } from 'lucide-react';
import type { User } from '@/lib/types';

interface HeaderProps {
  currentUser: User;
  title: string;
  onMenuClick?: () => void;
}

export default function Header({ currentUser, title, onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Hamburger Menu Button for Mobile */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1 hidden sm:block">
              {new Date().toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
            <span className="text-2xl">{currentUser.avatar}</span>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
              <p className="text-xs text-gray-500">
                {currentUser.role === 'admin' ? '대표' : '사원'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
