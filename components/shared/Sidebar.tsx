'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Calendar, FolderKanban, Target, LogOut, User } from 'lucide-react';
import type { User as UserType } from '@/lib/types';

interface SidebarProps {
  currentUser: UserType;
  onLogout: () => void;
}

export default function Sidebar({ currentUser, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = currentUser.role === 'admin';

  const menuItems = [
    { id: 'schedule', icon: Calendar, label: '일정관리', path: '/dashboard/schedule' },
    { id: 'projects', icon: FolderKanban, label: '프로젝트', path: '/dashboard/projects' },
    { id: 'reflection', icon: Target, label: '목표·회고', path: '/dashboard/reflection' }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">📅 일정관리</h1>
        <p className="text-sm text-gray-500 mt-1">{isAdmin ? '관리자' : '사원'} 모드</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => router.push(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.path
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          <User size={20} />
          내 정보
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut size={20} />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
