'use client';

import { useState, useMemo } from 'react';
import { Plus, Users, ChevronDown, FolderKanban } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/shared/Header';
import { SAMPLE_PROJECTS, SAMPLE_USERS } from '@/lib/data';
import { STATUS_CONFIG } from '@/lib/constants';
import AddProjectModal from '@/components/projects/AddProjectModal';
import ProjectDetailModal from '@/components/projects/ProjectDetailModal';
import type { Project } from '@/lib/types';

export default function ProjectsPage() {
  const { currentUser } = useAuth();
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

  return (
    <>
      <Header currentUser={currentUser} title="프로젝트 관리" />
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

        {/* 프로젝트 그리드 */}
        <div className="grid grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const StatusIcon = STATUS_CONFIG[project.status].icon;
            const members = SAMPLE_USERS.filter(u => project.members.includes(u.id));

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600">
                      {project.title}
                    </h4>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[project.status].color}`}>
                      <StatusIcon size={12} />
                      {STATUS_CONFIG[project.status].label}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>기간</span>
                  <span>{project.startDate} ~ {project.endDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  <div className="flex items-center -space-x-2">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-sm"
                        title={member.name}
                      >
                        {member.avatar}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderKanban size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">표시할 프로젝트가 없습니다.</p>
          </div>
        )}
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
