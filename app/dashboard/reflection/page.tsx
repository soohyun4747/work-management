'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/shared/Header';
import { SAMPLE_REFLECTIONS } from '@/lib/data';

export default function ReflectionPage() {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 9, 24));

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const monthKey = `${year}-${month + 1}`;
  const getWeekKey = (date: Date) => {
    const year = date.getFullYear();
    const onejan = new Date(year, 0, 1);
    const week = Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    return `${year}-W${week}`;
  };
  const weekKey = getWeekKey(selectedDate);
  const dateKey = selectedDate.toISOString().split('T')[0];

  const monthlyGoal = SAMPLE_REFLECTIONS.monthly?.[monthKey]?.goals.find(g => g.userId === currentUser.id);
  const monthlyReflection = SAMPLE_REFLECTIONS.monthly?.[monthKey]?.reflections.find(r => r.userId === currentUser.id);

  const weeklyGoal = SAMPLE_REFLECTIONS.weekly?.[weekKey]?.goals.find(g => g.userId === currentUser.id);
  const weeklyReflection = SAMPLE_REFLECTIONS.weekly?.[weekKey]?.reflections.find(r => r.userId === currentUser.id);

  const dailyGoal = SAMPLE_REFLECTIONS.daily?.[dateKey]?.goals.find(g => g.userId === currentUser.id);
  const dailyReflection = SAMPLE_REFLECTIONS.daily?.[dateKey]?.reflections.find(r => r.userId === currentUser.id);

  return (
    <>
      <Header currentUser={currentUser} title="목표·회고" />
      <div className="p-6 space-y-6">
        {/* 월간 목표·회고 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {year}년 {month + 1}월 목표·회고
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">월간 목표</h4>
              {monthlyGoal ? (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-line mb-3">{monthlyGoal.content}</p>
                  <button className="text-xs text-green-700 hover:text-green-800 font-medium">수정</button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <textarea
                    className="w-full text-sm resize-none focus:outline-none"
                    rows={4}
                    placeholder="이번 달의 목표를 작성해주세요..."
                  />
                  <button className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                    목표 등록
                  </button>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">월간 회고</h4>
              {monthlyReflection ? (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">{monthlyReflection.content}</p>
                  <button className="text-xs text-purple-700 hover:text-purple-800 font-medium">수정</button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <textarea
                    className="w-full text-sm resize-none focus:outline-none"
                    rows={4}
                    placeholder="이번 달의 회고를 작성해주세요..."
                  />
                  <button className="mt-2 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                    회고 등록
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 주간 목표·회고 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">주간 목표·회고</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">주간 목표</h4>
              {weeklyGoal ? (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-line mb-3">{weeklyGoal.content}</p>
                  <button className="text-xs text-blue-700 hover:text-blue-800 font-medium">수정</button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <textarea
                    className="w-full text-sm resize-none focus:outline-none"
                    rows={4}
                    placeholder="이번 주의 목표를 작성해주세요..."
                  />
                  <button className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    목표 등록
                  </button>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">주간 회고</h4>
              {weeklyReflection ? (
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">{weeklyReflection.content}</p>
                  <button className="text-xs text-indigo-700 hover:text-indigo-800 font-medium">수정</button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <textarea
                    className="w-full text-sm resize-none focus:outline-none"
                    rows={4}
                    placeholder="이번 주의 회고를 작성해주세요..."
                  />
                  <button className="mt-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                    회고 등록
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 일간 목표·회고 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })} 목표·회고
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">오늘의 목표</h4>
              {dailyGoal ? (
                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-line mb-3">{dailyGoal.content}</p>
                  <button className="text-xs text-teal-700 hover:text-teal-800 font-medium">수정</button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <textarea
                    className="w-full text-sm resize-none focus:outline-none"
                    rows={4}
                    placeholder="오늘의 목표를 작성해주세요..."
                  />
                  <button className="mt-2 w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">
                    목표 등록
                  </button>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">오늘의 회고</h4>
              {dailyReflection ? (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">{dailyReflection.content}</p>
                  <button className="text-xs text-orange-700 hover:text-orange-800 font-medium">수정</button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <textarea
                    className="w-full text-sm resize-none focus:outline-none"
                    rows={4}
                    placeholder="오늘의 회고를 작성해주세요..."
                  />
                  <button className="mt-2 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                    회고 등록
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
