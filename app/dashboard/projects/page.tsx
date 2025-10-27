'use client';

import { useState, useMemo } from 'react';
import { Plus, Users, ChevronDown, FolderKanban } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMobileSidebar } from '@/app/dashboard/layout';
import Header from '@/components/shared/Header';
import { SAMPLE_PROJECTS, SAMPLE_USERS } from '@/lib/data';
import { STATUS_CONFIG } from '@/lib/constants';
import AddProjectModal from '@/components/projects/AddProjectModal';
import ProjectDetailModal from '@/components/projects/ProjectDetailModal';
import type { Project } from '@/lib/types';

export default function ProjectsPage() {
  const { currentUser } = useAuth();
  const { toggleSidebar } = useMobileSidebar();
  const [statusFilter, setStatusFilter] = useState('all');
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
      <div className="p-6 space-y-6">
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
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">전체 상태</option>
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Plus size={18} />
                새 프로젝트
              </button>
            </div>
          </div>
        </div>

        {/* 프로젝트 Kanban 보드 */}
        <div className="grid grid-cols-4 gap-4">
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

                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-gray-400" />
                          <div className="flex items-center -space-x-1.5">
                            {members.slice(0, 3).map((member) => (
                              <div
                                key={member.id}
                                className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs"
                                title={member.name}
                              >
                                {member.avatar}
                              </div>
                            ))}
                            {members.length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                                +{members.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {projects.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <FolderKanban size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-xs">프로젝트 없음</p>
                    </div>
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
