'use client';

import { SAMPLE_USERS } from '@/lib/data';
import type { User } from '@/lib/types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">일정관리 시스템</h1>
          <p className="text-gray-600">팀의 일정과 프로젝트를 효율적으로 관리하세요</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onLogin(SAMPLE_USERS[0])}
            className="w-full p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">{SAMPLE_USERS[0].avatar}</span>
              <div className="text-left">
                <p className="font-bold">{SAMPLE_USERS[0].name}</p>
                <p className="text-sm text-blue-100">대표 계정으로 로그인</p>
              </div>
            </div>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">또는</span>
            </div>
          </div>

          {SAMPLE_USERS.slice(1).map(user => (
            <button
              key={user.id}
              onClick={() => onLogin(user)}
              className="w-full p-4 bg-white border-2 border-gray-200 text-gray-900 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl">{user.avatar}</span>
                <div className="text-left">
                  <p className="font-bold">{user.name}</p>
                  <p className="text-sm text-gray-500">사원 계정으로 로그인</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2025 일정관리 시스템. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
