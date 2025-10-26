'use client';

import { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, Plus, User, FolderKanban } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/shared/Header';
import { SAMPLE_SCHEDULES, SAMPLE_USERS, SAMPLE_PROJECTS } from '@/lib/data';
import { STATUS_CONFIG } from '@/lib/constants';
import AddScheduleModal from '@/components/schedule/AddScheduleModal';
import ScheduleDetailModal from '@/components/schedule/ScheduleDetailModal';
import type { Schedule } from '@/lib/types';

export default function SchedulePage() {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 9, 24));
  const [filterUser, setFilterUser] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [showModal, setShowModal] = useState<string | { type: string; data: Schedule } | null>(null);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const today = new Date(2025, 9, 24);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDayOfMonth + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return null;
    return new Date(year, month, dayNum);
  });

  const filteredSchedules = useMemo(() => {
    return SAMPLE_SCHEDULES.filter(schedule => {
      const matchUser = isAdmin
        ? filterUser === 'all' || schedule.userId === parseInt(filterUser)
        : schedule.userId === currentUser.id;
      const matchProject = filterProject === 'all' || schedule.projectId === parseInt(filterProject);
      return matchUser && matchProject;
    });
  }, [filterUser, filterProject, isAdmin, currentUser.id]);

  const getSchedulesForDate = (date: Date | null) => {
    if (!date) return [];
    return filteredSchedules.filter(schedule => {
      const scheduleStart = new Date(schedule.startDate);
      const scheduleEnd = new Date(schedule.endDate);
      scheduleStart.setHours(0, 0, 0, 0);
      scheduleEnd.setHours(0, 0, 0, 0);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      return checkDate >= scheduleStart && checkDate <= scheduleEnd;
    });
  };

  const selectedDateSchedules = getSchedulesForDate(selectedDate);

  const navigateMonth = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(month + direction);
    setSelectedDate(newDate);
  };

  return (
    <>
      <Header currentUser={currentUser} title="일정 관리" />
      <div className="p-6 space-y-6">
        {/* 필터 및 액션 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {isAdmin && (
                <div className="relative">
                  <select
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">전체 사원</option>
                    {SAMPLE_USERS.filter(u => u.role === 'member').map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              )}

              <div className="relative">
                <select
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">전체 프로젝트</option>
                  {SAMPLE_PROJECTS.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={() => setShowModal('addSchedule')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus size={18} />
              새 일정 추가
            </button>
          </div>
        </div>

        {/* 캘린더 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">
                {year}년 {month + 1}월
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setSelectedDate(today)}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg text-sm font-medium transition-colors"
                >
                  오늘
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                <div
                  key={day}
                  className={`text-center py-2 text-sm font-medium ${
                    idx === 0 ? 'text-red-200' : idx === 6 ? 'text-blue-200' : 'text-white'
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
                  return <div key={idx} className="min-h-[120px]" />;
                }

                const daySchedules = getSchedulesForDate(date);
                const isToday = date.toDateString() === today.toDateString();
                const isSelected = date.toDateString() === selectedDate.toDateString();
                const dayOfWeek = date.getDay();

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(date)}
                    className={`min-h-[120px] p-2 rounded-lg border-2 transition-all hover:shadow-md text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : isToday
                        ? 'border-blue-300 bg-blue-50'
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
                      <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                        {daySchedules.slice(0, 3).map((schedule) => (
                          <div
                            key={schedule.id}
                            className={`text-xs px-2 py-1 rounded bg-${schedule.color}-100 text-${schedule.color}-700 truncate`}
                          >
                            {schedule.title}
                          </div>
                        ))}
                        {daySchedules.length > 3 && (
                          <span className="text-xs text-gray-500 px-2">+{daySchedules.length - 3}개</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 선택된 날짜의 일정 목록 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })} 일정
          </h3>

          {selectedDateSchedules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar size={48} className="mx-auto mb-3 opacity-30" />
              <p>이 날짜에 등록된 일정이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateSchedules.map((schedule) => {
                const project = SAMPLE_PROJECTS.find(p => p.id === schedule.projectId);
                const user = SAMPLE_USERS.find(u => u.id === schedule.userId);
                const StatusIcon = STATUS_CONFIG[schedule.status].icon;

                return (
                  <div
                    key={schedule.id}
                    onClick={() => setShowModal({ type: 'scheduleDetail', data: schedule })}
                    className={`p-4 rounded-lg border-l-4 border-${schedule.color}-400 bg-${schedule.color}-50 hover:shadow-md transition-all cursor-pointer`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-gray-900">{schedule.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${STATUS_CONFIG[schedule.status].color}`}>
                            <StatusIcon size={12} />
                            {STATUS_CONFIG[schedule.status].label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{schedule.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {user?.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <FolderKanban size={14} />
                            {project?.title}
                          </span>
                          <span>
                            {schedule.startDate === schedule.endDate
                              ? schedule.startDate
                              : `${schedule.startDate} ~ ${schedule.endDate}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 모달 */}
      {showModal === 'addSchedule' && (
        <AddScheduleModal
          onClose={() => setShowModal(null)}
          currentUser={currentUser}
          isAdmin={isAdmin}
        />
      )}

      {typeof showModal === 'object' && showModal?.type === 'scheduleDetail' && (
        <ScheduleDetailModal
          schedule={showModal.data}
          onClose={() => setShowModal(null)}
          currentUser={currentUser}
          isAdmin={isAdmin}
        />
      )}
    </>
  );
}
