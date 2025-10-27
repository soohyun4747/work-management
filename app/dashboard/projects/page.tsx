'use client';

import { useState, useMemo } from 'react';
import { Plus, FolderKanban } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMobileSidebar } from '@/app/dashboard/layout';
import Header from '@/components/shared/Header';
import { Select } from '@/components/shared/Select';
import { Button } from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import MemberAvatarGroup from '@/components/shared/MemberAvatarGroup';
import { SAMPLE_PROJECTS, SAMPLE_USERS } from '@/lib/data';
import { STATUS_CONFIG } from '@/lib/constants';
import AddProjectModal from '@/components/projects/AddProjectModal';
import ProjectDetailModal from '@/components/projects/ProjectDetailModal';
import type { Project } from '@/lib/types';

export default function ProjectsPage() {
  const { currentUser } = useAuth();
  const { toggleSidebar } = useMobileSidebar();
  const [statusFilter, setStatusFilter] = useState('all');
  const [mobileStatusTab, setMobileStatusTab] = useState<string>('pending');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';

  const filteredProjects = useMemo(() => {
    let projects = SAMPLE_PROJECTS;

    if (!isAdmin) {
      projects = projects.filter(p => p.members.includes(currentUser.id));
    }

    if (statusFilter !== 'all') {
      projects = projects.filter(p => p.status === statusFilter);
    }

    return projects;
  }, [isAdmin, currentUser.id, statusFilter]);

  const groupedProjects = useMemo(() => {
    const groups: Record<string, typeof SAMPLE_PROJECTS> = {
      pending: [],
      progress: [],
      paused: [],
      completed: []
    };

    filteredProjects.forEach(project => {
      if (groups[project.status]) {
        groups[project.status].push(project);
      }
    });

    return groups;
  }, [filteredProjects]);

  return (
    <>
      <Header currentUser={currentUser} title="프로젝트 관리" onMenuClick={toggleSidebar} />
      <div className="p-6 space-y-6 justify-self-center">
        {/* 헤더 및 필터 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">전체 프로젝트</h3>
                <p className="text-sm text-gray-500 mt-1">총 {filteredProjects.length}개의 프로젝트</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">전체 상태</option>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </Select>

              <Button icon={Plus} onClick={() => setShowAddModal(true)}>
                새 프로젝트
              </Button>
            </div>
          </div>
        </div>

        {/* 모바일 탭 (md 이하에서만 표시) */}
        <div className="md:hidden bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* 탭 헤더 */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {Object.entries(STATUS_CONFIG).map(([statusKey, statusConfig]) => {
              const StatusIcon = statusConfig.icon;
              const projects = groupedProjects[statusKey] || [];

              return (
                <button
                  key={statusKey}
                  onClick={() => setMobileStatusTab(statusKey)}
                  className={`flex-1 min-w-[80px] px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                    mobileStatusTab === statusKey
                      ? 'border-blue-600 text-blue-700 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <StatusIcon size={16} />
                    <span>{statusConfig.label}</span>
                    <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">
                      {projects.length}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 탭 콘텐츠 */}
          <div className="p-4 space-y-3 min-h-[400px]">
            {groupedProjects[mobileStatusTab]?.map((project) => {
              const members = SAMPLE_USERS.filter(u => project.members.includes(u.id));

              return (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
                >
                  <h4 className="font-bold text-gray-900 mb-2 hover:text-blue-600">
                    {project.title}
                  </h4>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="text-xs text-gray-500 mb-3">
                    <div>{project.startDate} ~ {project.endDate}</div>
                  </div>

                  <MemberAvatarGroup members={members} />
                </div>
              );
            })}

            {(!groupedProjects[mobileStatusTab] || groupedProjects[mobileStatusTab].length === 0) && (
              <EmptyState
                icon={FolderKanban}
                description="프로젝트가 없습니다"
                className="py-12"
              />
            )}
          </div>
        </div>

        {/* 데스크톱 Kanban 보드 (md 이상에서만 표시) */}
        <div className="hidden md:grid grid-cols-4 gap-4">
          {Object.entries(STATUS_CONFIG).map(([statusKey, statusConfig]) => {
            const StatusIcon = statusConfig.icon;
            const projects = groupedProjects[statusKey] || [];

            return (
              <div key={statusKey} className="flex flex-col">
                <div className="bg-white rounded-t-xl border-t border-x border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StatusIcon size={18} className="text-gray-600" />
                      <h3 className="font-bold text-gray-900">{statusConfig.label}</h3>
                    </div>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {projects.length}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-b-xl border border-gray-200 p-4 space-y-3 min-h-[400px]">
                  {projects.map((project) => {
                    const members = SAMPLE_USERS.filter(u => project.members.includes(u.id));

                    return (
                      <div
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
                      >
                        <h4 className="font-bold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                          {project.title}
                        </h4>

                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                          {project.description}
                        </p>

                        <div className="text-xs text-gray-500 mb-3">
                          <div>{project.startDate}</div>
                          <div>{project.endDate}</div>
                        </div>

                        <MemberAvatarGroup members={members} />
                      </div>
                    );
                  })}

                  {projects.length === 0 && (
                    <EmptyState
                      icon={FolderKanban}
                      iconSize={32}
                      description="프로젝트 없음"
                      className="py-8 text-xs"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 모달 */}
      {showAddModal && (
        <AddProjectModal onClose={() => setShowAddModal(false)} />
      )}

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          currentUser={currentUser}
          isAdmin={isAdmin}
        />
      )}
    </>
  );
}
