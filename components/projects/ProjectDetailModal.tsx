'use client';

import { useState } from 'react';
import { ChevronDown, FileText, Download, Upload, Trash2 } from 'lucide-react';
import Modal from '@/components/shared/Modal';
import { SAMPLE_USERS } from '@/lib/data';
import { STATUS_CONFIG } from '@/lib/constants';
import type { Project, User } from '@/lib/types';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
  currentUser: User;
  isAdmin: boolean;
}

export default function ProjectDetailModal({
  project,
  onClose,
  currentUser,
  isAdmin
}: ProjectDetailModalProps) {
  const [status, setStatus] = useState(project.status);
  const [isEditing, setIsEditing] = useState(false);
  const StatusIcon = STATUS_CONFIG[status].icon;
  const members = SAMPLE_USERS.filter(u => project.members.includes(u.id));
  const isOwner = project.members.includes(currentUser.id);

  return (
    <Modal title={isEditing ? "프로젝트 수정" : "프로젝트 상세"} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${STATUS_CONFIG[status].color}`}>
              <StatusIcon size={16} />
              {STATUS_CONFIG[status].label}
            </span>
          </div>
        </div>

        {!isEditing ? (
          <>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">프로젝트 설명</h4>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {project.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">시작일</h4>
                <p className="text-sm text-gray-900">{project.startDate}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">종료일</h4>
                <p className="text-sm text-gray-900">{project.endDate}</p>
              </div>
            </div>

            {(isOwner || isAdmin) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">진행 상태</label>
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
              <h4 className="text-sm font-medium text-gray-700 mb-3">팀원</h4>
              <div className="flex flex-wrap gap-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-xl">{member.avatar}</span>
                    <span className="text-sm font-medium">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">첨부 파일</h4>
              </div>
              {project.files.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                  첨부된 파일이 없습니다.
                </p>
              ) : (
                <div className="space-y-2">
                  {project.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.size} · {file.uploadDate}</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <Download size={16} className="text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                닫기
              </button>
              {(isOwner || isAdmin) && status !== project.status && (
                <button
                  onClick={() => {
                    console.log('Saving status:', status);
                    onClose();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  상태 저장
                </button>
              )}
              {(isOwner || isAdmin) && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  수정
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">프로젝트 제목</label>
              <input
                type="text"
                defaultValue={project.title}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
              <textarea
                defaultValue={project.description}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">시작일</label>
                <input
                  type="date"
                  defaultValue={project.startDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">종료일</label>
                <input
                  type="date"
                  defaultValue={project.endDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">진행 상태</label>
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

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">첨부 파일</label>
                <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                  <Upload size={14} />
                  파일 추가
                </button>
              </div>
              {project.files.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                  첨부된 파일이 없습니다.
                </p>
              ) : (
                <div className="space-y-2">
                  {project.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.size} · {file.uploadDate}</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  console.log('Saving project...');
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
