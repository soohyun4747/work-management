'use client';

import { useState, useMemo } from 'react';
import { Plus, User, FolderKanban } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMobileSidebar } from '@/app/dashboard/layout';
import Header from '@/components/shared/Header';
import Calendar from '@/components/shared/Calendar';
import { Select } from '@/components/shared/Select';
import { Button } from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import StatusBadge from '@/components/shared/StatusBadge';
import { SAMPLE_SCHEDULES, SAMPLE_USERS, SAMPLE_PROJECTS } from '@/lib/data';
import { STATUS_CONFIG } from '@/lib/constants';
import AddScheduleModal from '@/components/schedule/AddScheduleModal';
import ScheduleDetailModal from '@/components/schedule/ScheduleDetailModal';
import type { Schedule } from '@/lib/types';

export default function SchedulePage() {
  const { currentUser } = useAuth();
  const { toggleSidebar } = useMobileSidebar();
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 9, 24));
  const [filterUser, setFilterUser] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [showModal, setShowModal] = useState<string | { type: string; data: Schedule } | null>(null);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const today = new Date(2025, 9, 24);

  const filteredSchedules = useMemo(() => {
    return SAMPLE_SCHEDULES.filter(schedule => {
      const matchUser = isAdmin
        ? filterUser === 'all' || schedule.userIds.includes(parseInt(filterUser))
        : schedule.userIds.includes(currentUser.id);
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

  const renderDayContent = (date: Date) => {
    const daySchedules = getSchedulesForDate(date);

    return (
      <>
        {daySchedules.slice(0, 2).map((schedule) => (
          <div
            key={schedule.id}
            className={`text-[10px] md:text-xs px-1 md:px-2 py-0.5 md:py-1 rounded bg-${schedule.color}-100 text-${schedule.color}-700 truncate`}
          >
            <span className="hidden md:inline">{schedule.title}</span>
            <span className="md:hidden">•</span>
          </div>
        ))}
        {daySchedules.length > 2 && (
          <span className="text-[10px] md:text-xs text-gray-500 px-1 md:px-2">+{daySchedules.length - 2}</span>
        )}
      </>
    );
  };

  return (
    <>
      <Header currentUser={currentUser} title="일정 관리" onMenuClick={toggleSidebar} />
      <div className="p-6 space-y-6 max-w-[900px] justify-self-center">
        {/* 필터 및 액션 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Select
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                >
                  <option value="all">전체 사원</option>
                  {SAMPLE_USERS.filter(u => u.role === 'member').map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </Select>
              )}

              <Select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
              >
                <option value="all">전체 프로젝트</option>
                {SAMPLE_PROJECTS.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </Select>
            </div>

            <Button icon={Plus} onClick={() => setShowModal('addSchedule')}>
              새 일정 추가
            </Button>
          </div>
        </div>

        {/* 캘린더 */}
        <Calendar
          year={year}
          month={month}
          selectedDate={selectedDate}
          today={today}
          onDateSelect={setSelectedDate}
          onMonthChange={navigateMonth}
          onTodayClick={() => setSelectedDate(today)}
          renderDayContent={renderDayContent}
          themeColor="blue"
        />

        {/* 선택된 날짜의 일정 목록 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })} 일정
          </h3>

          {selectedDateSchedules.length === 0 ? (
            <EmptyState description="이 날짜에 등록된 일정이 없습니다." />
          ) : (
            <div className="space-y-3">
              {selectedDateSchedules.map((schedule) => {
                const project = SAMPLE_PROJECTS.find(p => p.id === schedule.projectId);
                const users = SAMPLE_USERS.filter(u => schedule.userIds.includes(u.id));
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
                          <StatusBadge
                            label={STATUS_CONFIG[schedule.status].label}
                            icon={StatusIcon}
                            color={STATUS_CONFIG[schedule.status].color}
                          />
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{schedule.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {users.map(u => u.name).join(', ')}
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
