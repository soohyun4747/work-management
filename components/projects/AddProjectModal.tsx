'use client';

import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import Modal from '@/components/shared/Modal';
import MultiSelect from '@/components/shared/MultiSelect';
import { Input, TextArea } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { Button } from '@/components/shared/Button';
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
  const [files, setFiles] = useState<File[]>([]);

  const memberOptions = SAMPLE_USERS.filter(u => u.role === 'member').map(u => ({
    id: u.id,
    name: u.name,
    avatar: u.avatar
  }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New project:', formData);
    onClose();
  };

  return (
    <Modal title="새 프로젝트 추가" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="프로젝트 제목"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="프로젝트 제목을 입력하세요"
          required
        />

        <TextArea
          label="프로젝트 설명"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          placeholder="프로젝트에 대한 상세 설명을 입력하세요"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="시작일"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />

          <Input
            label="종료일"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
            min={formData.startDate}
          />
        </div>

        <Select
          label="진행 상태"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
        >
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </Select>

        <MultiSelect
          label="팀원 선택"
          options={memberOptions}
          selected={formData.members}
          onChange={(selected) => setFormData({ ...formData, members: selected })}
          placeholder="팀원을 선택하세요"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">첨부 파일</label>
          <div className="space-y-3">
            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
              <Upload size={20} className="text-gray-400" />
              <span className="text-sm text-gray-600">파일 선택 또는 드래그</span>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Upload size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="p-1"
                    >
                      <X size={16} className="text-gray-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button type="submit">
            프로젝트 추가
          </Button>
        </div>
      </form>
    </Modal>
  );
}
