'use client';

import { useState } from 'react';
import Modal from '@/components/shared/Modal';
import MultiSelect from '@/components/shared/MultiSelect';
import { Input, TextArea } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { Button } from '@/components/shared/Button';
import { SAMPLE_USERS, SAMPLE_PROJECTS } from '@/lib/data';
import { STATUS_CONFIG } from '@/lib/constants';
import type { User, ScheduleColor, ScheduleStatus } from '@/lib/types';

interface AddScheduleModalProps {
  onClose: () => void;
  currentUser: User;
  isAdmin: boolean;
}

export default function AddScheduleModal({ onClose, currentUser, isAdmin }: AddScheduleModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    userIds: isAdmin ? [] : [currentUser.id],
    projectId: 0,
    content: '',
    color: 'blue' as ScheduleColor,
    status: 'progress' as ScheduleStatus
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New schedule:', formData);
    onClose();
  };

  const memberOptions = SAMPLE_USERS.filter(u => u.role === 'member').map(u => ({
    id: u.id,
    name: u.name,
    avatar: u.avatar
  }));

  return (
    <Modal title="새 일정 추가" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="일정 제목"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="일정 제목을 입력하세요"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="시작 날짜"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />

          <Input
            label="종료 날짜"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
            min={formData.startDate}
          />
        </div>

        <MultiSelect
          label="담당자"
          options={memberOptions}
          selected={formData.userIds}
          onChange={(selected) => setFormData({ ...formData, userIds: selected })}
          placeholder="담당자를 선택하세요"
        />

        <Select
          label="프로젝트"
          value={formData.projectId}
          onChange={(e) => setFormData({ ...formData, projectId: parseInt(e.target.value) })}
          required
        >
          <option value="">프로젝트 선택</option>
          {SAMPLE_PROJECTS.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </Select>

        <Select
          label="진행 상태"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as ScheduleStatus })}
        >
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </Select>

        <TextArea
          label="상세 내용"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={4}
          placeholder="일정에 대한 상세 내용을 입력하세요"
        />

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button type="submit">
            일정 추가
          </Button>
        </div>
      </form>
    </Modal>
  );
}
