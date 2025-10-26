'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Modal from '@/components/shared/Modal';
import { SAMPLE_USERS } from '@/lib/data';
import { STATUS_CONFIG } from '@/lib/constants';
import type { ProjectStatus } from '@/lib/types';

interface AddProjectModalProps {
  onClose: () => void;
}

export default function AddProjectModal({ onClose }: AddProjectModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'progress' as ProjectStatus,
    members: [] as number[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New project:', formData);
    onClose();
  };

  return (
    <Modal title="새 프로젝트 추가" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">프로젝트 제목</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="프로젝트 제목을 입력하세요"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">프로젝트 설명</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={4}
            placeholder="프로젝트에 대한 상세 설명을 입력하세요"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">시작일</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">종료일</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min={formData.startDate}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">진행 상태</label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
              className="appearance-none w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">팀원 선택</label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {SAMPLE_USERS.filter(u => u.role === 'member').map(user => (
              <label
                key={user.id}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.members.includes(user.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({ ...formData, members: [...formData.members, user.id] });
                    } else {
                      setFormData({ ...formData, members: formData.members.filter(id => id !== user.id) });
                    }
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xl">{user.avatar}</span>
                <span className="text-sm font-medium text-gray-900">{user.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            프로젝트 추가
          </button>
        </div>
      </form>
    </Modal>
  );
}
