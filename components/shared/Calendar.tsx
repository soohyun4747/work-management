'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  year: number;
  month: number;
  selectedDate: Date;
  today: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (direction: number) => void;
  onTodayClick: () => void;
  renderDayContent?: (date: Date, dateKey: string) => React.ReactNode;
  themeColor?: 'blue' | 'green' | 'purple';
  title?: string;
}

export default function Calendar({
  year,
  month,
  selectedDate,
  today,
  onDateSelect,
  onMonthChange,
  onTodayClick,
  renderDayContent,
  themeColor = 'blue',
  title
}: CalendarProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDayOfMonth + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return null;
    return new Date(year, month, dayNum);
  });

  const colorClasses = {
    blue: {
      button: 'bg-blue-600 hover:bg-blue-700',
      selectedBorder: 'border-blue-500 bg-blue-50',
      todayBorder: 'border-blue-300 bg-blue-50'
    },
    green: {
      button: 'bg-green-600 hover:bg-green-700',
      selectedBorder: 'border-green-500 bg-green-50',
      todayBorder: 'border-green-300 bg-green-50'
    },
    purple: {
      button: 'bg-purple-600 hover:bg-purple-700',
      selectedBorder: 'border-purple-500 bg-purple-50',
      todayBorder: 'border-purple-300 bg-purple-50'
    }
  };

  const colors = colorClasses[themeColor];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-white md:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4 md:p-0 p-4">
          <h3 className="text-2xl font-bold text-gray-900">
            {title || `${year}년 ${month + 1}월`}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onMonthChange(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <button
              onClick={onTodayClick}
              className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors ${colors.button}`}
            >
              오늘
            </button>
            <button
              onClick={() => onMonthChange(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* 요일 헤더 */}
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

      {/* 캘린더 그리드 */}
      <div className="md:p-4">
        <div className="grid grid-cols-7 md:gap-2">
          {calendarDays.map((date, idx) => {
            if (!date) {
              return <div key={idx} className="min-h-[60px] md:min-h-[100px]" />;
            }

            const isToday = date.toDateString() === today.toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const dayOfWeek = date.getDay();
            const dateKey = date.toISOString().split('T')[0];

            return (
              <button
                key={idx}
                onClick={() => onDateSelect(date)}
                className={`min-h-[60px] md:min-h-[100px] p-1 md:p-2 md:rounded-lg border-[0.5px] md:border-2 border-collapse transition-all hover:shadow-md text-left ${
                  isSelected
                    ? colors.selectedBorder
                    : isToday
                    ? colors.todayBorder
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="h-full flex flex-col">
                  <span
                    className={`text-xs md:text-sm font-medium mb-1 md:mb-2 ${
                      dayOfWeek === 0 ? 'text-red-600' : dayOfWeek === 6 ? 'text-blue-600' : 'text-gray-700'
                    } ${isToday ? 'font-bold' : ''}`}
                  >
                    {date.getDate()}
                  </span>
                  <div className="flex-1 flex flex-col gap-0.5 md:gap-1 overflow-hidden">
                    {renderDayContent?.(date, dateKey)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
