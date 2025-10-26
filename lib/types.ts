export type UserRole = 'admin' | 'member';

export interface User {
  id: number;
  name: string;
  role: UserRole;
  avatar: string;
}

export type ScheduleStatus = 'pending' | 'progress' | 'completed' | 'paused';
export type ScheduleColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'indigo' | 'red' | 'yellow';

export interface Schedule {
  id: number;
  title: string;
  userIds: number[];  // 여러 담당자 지원
  projectId: number;
  startDate: string;
  endDate: string;
  color: ScheduleColor;
  status: ScheduleStatus;
  content: string;
}

export type ProjectStatus = 'pending' | 'progress' | 'completed' | 'paused';

export interface ProjectFile {
  id: number;
  name: string;
  size: string;
  uploadDate: string;
}

export interface Project {
  id: number;
  title: string;
  status: ProjectStatus;
  progress: number;
  members: number[];
  startDate: string;
  endDate: string;
  description: string;
  files: ProjectFile[];
}

export interface ReflectionItem {
  userId: number;
  content: string;
}

export interface DailyReflection {
  goals: ReflectionItem[];
  reflections: ReflectionItem[];
}

export interface Reflections {
  daily: Record<string, DailyReflection>;
  weekly: Record<string, DailyReflection>;
  monthly: Record<string, DailyReflection>;
}

export interface StatusConfig {
  label: string;
  color: string;
  icon: any;
}

export type ViewType = 'schedule' | 'projects' | 'reflection';
export type CalendarView = 'month' | 'week' | 'day';
export type ReflectionTab = 'daily' | 'weekly' | 'monthly';

export interface ModalState {
  type: string;
  data?: any;
}
