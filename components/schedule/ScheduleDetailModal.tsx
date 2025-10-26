'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Modal from '@/components/shared/Modal';
import { SAMPLE_USERS, SAMPLE_PROJECTS } from '@/lib/data';
import { STATUS_CONFIG } from '@/lib/constants';
import type { Schedule, User } from '@/lib/types';

interface ScheduleDetailModalProps {
  schedule: Schedule;
  onClose: () => void;
  currentUser: User;
  isAdmin: boolean;
}

export default function ScheduleDetailModal({
  schedule,
  onClose,
  currentUser,
  isAdmin
}: ScheduleDetailModalProps) {
  const [status, setStatus] = useState(schedule.status);
  const project = SAMPLE_PROJECTS.find(p => p.id === schedule.projectId);
  const user = SAMPLE_USERS.find(u => u.id === schedule.userId);
  const StatusIcon = STATUS_CONFIG[status].icon;
  const isOwner = schedule.userId === currentUser.id;

  return (
    <Modal title="일정 상세" onClose={onClose}>
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{schedule.title}</h3>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${STATUS_CONFIG[status].color}`}>
              <StatusIcon size={16} />
              {STATUS_CONFIG[status].label}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500 w-20">담당자</span>
            <span className="flex items-center gap-2">
              <span className="text-xl">{user?.avatar}</span>
              <span className="font-medium">{user?.name}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500 w-20">프로젝트</span>
            <span className="font-medium">{project?.title}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500 w-20">기간</span>
            <span className="font-medium">
              {schedule.startDate === schedule.endDate
                ? schedule.startDate
                : `${schedule.startDate} ~ ${schedule.endDate}`}
            </span>
          </div>
        </div>

        {isOwner && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">진행 상태 변경</label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="appearance-none w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">상세 내용</h4>
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
            {schedule.content}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          {isOwner && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  console.log('Saving status:', status);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                저장
              </button>
            </>
          )}
          {!isOwner && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              닫기
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
