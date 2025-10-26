import { Clock, CheckCircle2, Pause } from 'lucide-react';
import type { StatusConfig } from './types';

export const STATUS_CONFIG: Record<string, StatusConfig> = {
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
