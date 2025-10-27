'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMobileSidebar } from '@/app/dashboard/layout';
import Header from '@/components/shared/Header';
import { SAMPLE_REFLECTIONS, SAMPLE_USERS } from '@/lib/data';

export default function ReflectionPage() {
  const { currentUser } = useAuth();
  const { toggleSidebar } = useMobileSidebar();
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 9, 24));
  const [reflectionTab, setReflectionTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [filterUser, setFilterUser] = useState('all');

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const today = new Date(2025, 9, 24);

  const monthKey = `${year}-${month + 1}`;
  const getWeekKey = (date: Date) => {
    const year = date.getFullYear();
    const onejan = new Date(year, 0, 1);
    const week = Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    return `${year}-W${week}`;
  };
  const getWeekOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const weekOfMonth = Math.ceil((date.getDate() + firstDay.getDay()) / 7);
    return weekOfMonth;
  };
  const weekKey = getWeekKey(selectedDate);
  const dateKey = selectedDate.toISOString().split('T')[0];
  const weekOfMonth = getWeekOfMonth(selectedDate);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDayOfMonth + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return null;
    return new Date(year, month, dayNum);
  });

  const navigateMonth = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(month + direction);
    setSelectedDate(newDate);
  };

  // 관리자 뷰
  if (isAdmin) {
    const tabs = [
      { id: 'daily' as const, label: '일간' },
      { id: 'weekly' as const, label: '주간' },
      { id: 'monthly' as const, label: '월간' }
    ];

    const filteredReflections = useMemo(() => {
      const key = reflectionTab === 'daily' ? dateKey : reflectionTab === 'weekly' ? weekKey : monthKey;
      const data = SAMPLE_REFLECTIONS[reflectionTab]?.[key];

      if (!data) return { goals: [], reflections: [] };

      if (filterUser === 'all') return data;

      return {
        goals: data.goals.filter(g => g.userId === parseInt(filterUser)),
        reflections: data.reflections.filter(r => r.userId === parseInt(filterUser))
      };
    }, [reflectionTab, dateKey, weekKey, monthKey, filterUser]);

    const groupedByUser = useMemo(() => {
      const users = filterUser === 'all'
        ? SAMPLE_USERS.filter(u => u.role === 'member')
        : SAMPLE_USERS.filter(u => u.id === parseInt(filterUser));

      return users.map(user => {
        const userGoal = filteredReflections.goals.find(g => g.userId === user.id);
        const userReflection = filteredReflections.reflections.find(r => r.userId === user.id);
        return {
          user,
          goal: userGoal,
          reflection: userReflection
        };
      });
    }, [filteredReflections, filterUser]);

    // Admin's own goals and reflections
    const adminMonthlyGoal = SAMPLE_REFLECTIONS.monthly?.[monthKey]?.goals.find(g => g.userId === currentUser.id);
    const adminMonthlyReflection = SAMPLE_REFLECTIONS.monthly?.[monthKey]?.reflections.find(r => r.userId === currentUser.id);
    const adminWeeklyGoal = SAMPLE_REFLECTIONS.weekly?.[weekKey]?.goals.find(g => g.userId === currentUser.id);
    const adminWeeklyReflection = SAMPLE_REFLECTIONS.weekly?.[weekKey]?.reflections.find(r => r.userId === currentUser.id);
    const adminDailyGoal = SAMPLE_REFLECTIONS.daily?.[dateKey]?.goals.find(g => g.userId === currentUser.id);
    const adminDailyReflection = SAMPLE_REFLECTIONS.daily?.[dateKey]?.reflections.find(r => r.userId === currentUser.id);

    return (
      <>
        <Header currentUser={currentUser} title="목표·회고" onMenuClick={toggleSidebar} />
        <div className="p-6 space-y-6">
          {/* Admin's personal goals and reflections */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{currentUser.avatar}</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">나의 목표·회고</h3>
                <p className="text-xs text-gray-600">관리자 본인의 목표와 회고를 작성할 수 있습니다</p>
              </div>
            </div>

            {/* Monthly */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-gray-800 mb-3">
                {year}년 {month + 1}월 - 월간 목표·회고
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">월간 목표</label>
                  {adminMonthlyGoal ? (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-line mb-2">{adminMonthlyGoal.content}</p>
                      <button className="text-xs text-green-700 hover:text-green-800 font-medium">수정</button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                      <textarea
                        className="w-full text-sm resize-none focus:outline-none"
                        rows={3}
                        placeholder="이번 달의 목표를 작성해주세요..."
                      />
                      <button className="mt-2 w-full px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium">
                        목표 등록
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">월간 회고</label>
                  {adminMonthlyReflection ? (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2">{adminMonthlyReflection.content}</p>
                      <button className="text-xs text-purple-700 hover:text-purple-800 font-medium">수정</button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                      <textarea
                        className="w-full text-sm resize-none focus:outline-none"
                        rows={3}
                        placeholder="이번 달의 회고를 작성해주세요..."
                      />
                      <button className="mt-2 w-full px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium">
                        회고 등록
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Weekly */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-gray-800 mb-3">
                {month + 1}월 {weekOfMonth}째주 - 주간 목표·회고
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">주간 목표</label>
                  {adminWeeklyGoal ? (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-line mb-2">{adminWeeklyGoal.content}</p>
                      <button className="text-xs text-blue-700 hover:text-blue-800 font-medium">수정</button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                      <textarea
                        className="w-full text-sm resize-none focus:outline-none"
                        rows={3}
                        placeholder="이번 주의 목표를 작성해주세요..."
                      />
                      <button className="mt-2 w-full px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium">
                        목표 등록
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">주간 회고</label>
                  {adminWeeklyReflection ? (
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2">{adminWeeklyReflection.content}</p>
                      <button className="text-xs text-indigo-700 hover:text-indigo-800 font-medium">수정</button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                      <textarea
                        className="w-full text-sm resize-none focus:outline-none"
                        rows={3}
                        placeholder="이번 주의 회고를 작성해주세요..."
                      />
                      <button className="mt-2 w-full px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium">
                        회고 등록
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Daily */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="text-sm font-bold text-gray-800 mb-3">
                {selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })} - 일간 목표·회고
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">오늘의 목표</label>
                  {adminDailyGoal ? (
                    <div className="bg-teal-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-line mb-2">{adminDailyGoal.content}</p>
                      <button className="text-xs text-teal-700 hover:text-teal-800 font-medium">수정</button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                      <textarea
                        className="w-full text-sm resize-none focus:outline-none"
                        rows={3}
                        placeholder="오늘의 목표를 작성해주세요..."
                      />
                      <button className="mt-2 w-full px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-xs font-medium">
                        목표 등록
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">오늘의 회고</label>
                  {adminDailyReflection ? (
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2">{adminDailyReflection.content}</p>
                      <button className="text-xs text-orange-700 hover:text-orange-800 font-medium">수정</button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                      <textarea
                        className="w-full text-sm resize-none focus:outline-none"
                        rows={3}
                        placeholder="오늘의 회고를 작성해주세요..."
                      />
                      <button className="mt-2 w-full px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-xs font-medium">
                        회고 등록
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Team section header */}
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-300"></div>
            <span className="text-sm font-bold text-gray-600">팀원 목표·회고 조회</span>
            <div className="h-px flex-1 bg-gray-300"></div>
          </div>
          {/* 캘린더 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-white p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {year}년 {month + 1}월
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={20} className="text-gray-700" />
                  </button>
                  <button
                    onClick={() => setSelectedDate(today)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    오늘
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight size={20} className="text-gray-700" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                  <div
                    key={day}
                    className={`text-center py-2 text-sm font-medium ${
                      idx === 0 ? 'text-red-600' : idx === 6 ? 'text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((date, idx) => {
                  if (!date) {
                    return <div key={idx} className="min-h-[100px]" />;
                  }

                  const isToday = date.toDateString() === today.toDateString();
                  const isSelected = date.toDateString() === selectedDate.toDateString();
                  const dayOfWeek = date.getDay();

                  const dateKey = date.toISOString().split('T')[0];
                  const hasGoal = SAMPLE_REFLECTIONS.daily?.[dateKey]?.goals?.length > 0;
                  const hasReflection = SAMPLE_REFLECTIONS.daily?.[dateKey]?.reflections?.length > 0;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(date)}
                      className={`min-h-[100px] p-2 rounded-lg border-2 transition-all hover:shadow-md text-left ${
                        isSelected
                          ? 'border-green-500 bg-green-50'
                          : isToday
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="h-full flex flex-col">
                        <span
                          className={`text-sm font-medium mb-2 ${
                            dayOfWeek === 0 ? 'text-red-600' : dayOfWeek === 6 ? 'text-blue-600' : 'text-gray-700'
                          } ${isToday ? 'font-bold' : ''}`}
                        >
                          {date.getDate()}
                        </span>
                        <div className="flex-1 flex flex-col gap-1">
                          {hasGoal && (
                            <div className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                              목표 {SAMPLE_REFLECTIONS.daily[dateKey].goals.length}
                            </div>
                          )}
                          {hasReflection && (
                            <div className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">
                              회고 {SAMPLE_REFLECTIONS.daily[dateKey].reflections.length}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 탭 및 필터 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setReflectionTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      reflectionTab === tab.id ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <select
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">전체 사원</option>
                  {SAMPLE_USERS.filter(u => u.role === 'member').map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* 사원별 목표·회고 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groupedByUser.map(({ user, goal, reflection }) => (
              <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                  <span className="text-2xl">{user.avatar}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                    <p className="text-xs text-gray-500">
                      {reflectionTab === 'daily' ? selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }) :
                       reflectionTab === 'weekly' ? `${month + 1}월 ${weekOfMonth}째주` :
                       `${year}년 ${month + 1}월`}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">목표</h4>
                    {goal ? (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-700 whitespace-pre-line">{goal.content}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">등록된 목표가 없습니다.</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">회고</h4>
                    {reflection ? (
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-gray-700">{reflection.content}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">등록된 회고가 없습니다.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {groupedByUser.length === 0 && (
            <div className="text-center py-12">
              <Target size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">표시할 내용이 없습니다.</p>
            </div>
          )}
        </div>
      </>
    );
  }

  // 사원 뷰
  const monthlyGoal = SAMPLE_REFLECTIONS.monthly?.[monthKey]?.goals.find(g => g.userId === currentUser.id);
  const monthlyReflection = SAMPLE_REFLECTIONS.monthly?.[monthKey]?.reflections.find(r => r.userId === currentUser.id);

  const weeklyGoal = SAMPLE_REFLECTIONS.weekly?.[weekKey]?.goals.find(g => g.userId === currentUser.id);
  const weeklyReflection = SAMPLE_REFLECTIONS.weekly?.[weekKey]?.reflections.find(r => r.userId === currentUser.id);

  const dailyGoal = SAMPLE_REFLECTIONS.daily?.[dateKey]?.goals.find(g => g.userId === currentUser.id);
  const dailyReflection = SAMPLE_REFLECTIONS.daily?.[dateKey]?.reflections.find(r => r.userId === currentUser.id);

  return (
    <>
      <Header currentUser={currentUser} title="목표·회고" onMenuClick={toggleSidebar} />
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

        {/* 캘린더 (사원용) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-white p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {year}년 {month + 1}월
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} className="text-gray-700" />
                </button>
                <button
                  onClick={() => setSelectedDate(today)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  오늘
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight size={20} className="text-gray-700" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                <div
                  key={day}
                  className={`text-center py-2 text-sm font-medium ${
                    idx === 0 ? 'text-red-600' : idx === 6 ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((date, idx) => {
                if (!date) {
                  return <div key={idx} className="min-h-[100px]" />;
                }

                const isToday = date.toDateString() === today.toDateString();
                const isSelected = date.toDateString() === selectedDate.toDateString();
                const dayOfWeek = date.getDay();

                const dateKey = date.toISOString().split('T')[0];
                const hasGoal = SAMPLE_REFLECTIONS.daily?.[dateKey]?.goals?.find(g => g.userId === currentUser.id);
                const hasReflection = SAMPLE_REFLECTIONS.daily?.[dateKey]?.reflections?.find(r => r.userId === currentUser.id);

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(date)}
                    className={`min-h-[100px] p-2 rounded-lg border-2 transition-all hover:shadow-md text-left ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50'
                        : isToday
                        ? 'border-purple-300 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="h-full flex flex-col">
                      <span
                        className={`text-sm font-medium mb-2 ${
                          dayOfWeek === 0 ? 'text-red-600' : dayOfWeek === 6 ? 'text-blue-600' : 'text-gray-700'
                        } ${isToday ? 'font-bold' : ''}`}
                      >
                        {date.getDate()}
                      </span>
                      <div className="flex-1 flex flex-col gap-1">
                        {hasGoal && (
                          <div className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                            목표
                          </div>
                        )}
                        {hasReflection && (
                          <div className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">
                            회고
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 주간 목표·회고 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {month + 1}월 {weekOfMonth}째주 주간 목표·회고
          </h3>
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
