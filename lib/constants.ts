import { Clock, CheckCircle2, Pause, Circle } from 'lucide-react';
import type { StatusConfig } from './types';

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  pending: {
    label: '진행전',
    color: 'bg-gray-100 text-gray-700',
    icon: Circle
  },
  progress: {
    label: '진행 중',
    color: 'bg-blue-100 text-blue-700',
    icon: Clock
  },
  completed: {
    label: '완료',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle2
  },
  paused: {
    label: '보류',
    color: 'bg-yellow-100 text-yellow-700',
    icon: Pause
  }
};
