import type { User, Project, Schedule, Reflections } from './types';

export const SAMPLE_USERS: User[] = [
  { id: 1, name: '김대표', role: 'admin', avatar: '👨‍💼' },
  { id: 2, name: '이사원', role: 'member', avatar: '👨‍💻' },
  { id: 3, name: '박사원', role: 'member', avatar: '👩‍💻' },
  { id: 4, name: '최사원', role: 'member', avatar: '👩‍🔬' }
];

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: 1,
    title: '웹사이트 리뉴얼',
    status: 'progress',
    progress: 65,
    members: [2, 3],
    startDate: '2025-10-01',
    endDate: '2025-11-30',
    description: '기존 웹사이트의 UI/UX를 개선하고 반응형 디자인을 적용하는 프로젝트',
    files: [
      { id: 1, name: '디자인_시안.pdf', size: '2.3MB', uploadDate: '2025-10-15' },
      { id: 2, name: '요구사항_정의서.docx', size: '1.5MB', uploadDate: '2025-10-10' }
    ]
  },
  {
    id: 2,
    title: '모바일 앱 개발',
    status: 'progress',
    progress: 40,
    members: [2, 4],
    startDate: '2025-10-15',
    endDate: '2025-12-20',
    description: 'iOS와 Android를 지원하는 하이브리드 모바일 앱 개발',
    files: [
      { id: 3, name: '기술_스택_문서.pdf', size: '1.8MB', uploadDate: '2025-10-16' }
    ]
  },
  {
    id: 3,
    title: 'AI 챗봇 구축',
    status: 'progress',
    progress: 10,
    members: [3],
    startDate: '2025-11-01',
    endDate: '2025-12-31',
    description: '고객 지원을 위한 AI 기반 챗봇 시스템 구축',
    files: []
  },
  {
    id: 4,
    title: '데이터 마이그레이션',
    status: 'completed',
    progress: 100,
    members: [2, 3, 4],
    startDate: '2025-09-01',
    endDate: '2025-10-15',
    description: '레거시 시스템에서 신규 시스템으로 데이터 이전 완료',
    files: [
      { id: 4, name: '마이그레이션_보고서.pdf', size: '3.2MB', uploadDate: '2025-10-15' }
    ]
  }
];

export const SAMPLE_SCHEDULES: Schedule[] = [
  {
    id: 1,
    title: '클라이언트 미팅',
    userId: 2,
    projectId: 1,
    startDate: '2025-10-24',
    endDate: '2025-10-24',
    color: 'blue',
    status: 'progress',
    content: '신규 프로젝트 킥오프 미팅'
  },
  {
    id: 2,
    title: 'UI 디자인 검토',
    userId: 3,
    projectId: 1,
    startDate: '2025-10-24',
    endDate: '2025-10-25',
    color: 'purple',
    status: 'progress',
    content: '메인 페이지 디자인 피드백'
  },
  {
    id: 3,
    title: 'API 개발',
    userId: 2,
    projectId: 2,
    startDate: '2025-10-26',
    endDate: '2025-10-28',
    color: 'green',
    status: 'progress',
    content: 'REST API 엔드포인트 구현'
  },
  {
    id: 4,
    title: '테스트 계획 수립',
    userId: 4,
    projectId: 2,
    startDate: '2025-10-28',
    endDate: '2025-10-29',
    color: 'orange',
    status: 'progress',
    content: 'QA 테스트 시나리오 작성'
  },
  {
    id: 5,
    title: '데이터 분석',
    userId: 3,
    projectId: 3,
    startDate: '2025-10-29',
    endDate: '2025-10-30',
    color: 'pink',
    status: 'completed',
    content: '사용자 행동 패턴 분석'
  },
  {
    id: 6,
    title: '코드 리뷰',
    userId: 2,
    projectId: 1,
    startDate: '2025-10-24',
    endDate: '2025-10-24',
    color: 'indigo',
    status: 'progress',
    content: 'PR 검토 및 피드백'
  }
];

export const SAMPLE_REFLECTIONS: Reflections = {
  daily: {
    '2025-10-24': {
      goals: [
        { userId: 2, content: '1. 클라이언트 미팅 준비\n2. UI 디자인 피드백 정리\n3. 주간 보고서 작성' },
        { userId: 3, content: '1. 디자인 시안 수정\n2. 프로토타입 제작\n3. 사용자 테스트 준비' }
      ],
      reflections: [
        { userId: 2, content: '오늘은 클라이언트와의 미팅이 매우 생산적이었습니다. 다만 일정 관리에서 조금 더 여유를 가질 필요가 있었습니다.' },
        { userId: 3, content: '디자인 작업이 예상보다 빠르게 진행되었습니다. 팀원들의 피드백이 매우 유용했습니다.' }
      ]
    }
  },
  weekly: {
    '2025-W43': {
      goals: [
        { userId: 2, content: '- 프로젝트 마일스톤 달성\n- 팀원들과 코드 리뷰 진행\n- 신규 기능 개발 착수' },
        { userId: 3, content: '- UI/UX 개선 완료\n- 사용자 피드백 반영\n- 디자인 시스템 구축' }
      ],
      reflections: [
        { userId: 2, content: '이번 주는 전반적으로 목표를 잘 달성했습니다. 팀원들과의 협업이 원활했고, 코드 품질도 향상되었습니다.' },
        { userId: 3, content: '디자인 작업이 순조롭게 진행되었습니다. 다음 주에는 더 구체적인 사용자 테스트를 진행할 예정입니다.' }
      ]
    }
  },
  monthly: {
    '2025-10': {
      goals: [
        { userId: 2, content: '• 분기별 목표 수립\n• 팀 역량 강화 교육\n• 신규 프로젝트 기획' },
        { userId: 3, content: '• 디자인 포트폴리오 업데이트\n• 신규 툴 학습\n• 프로젝트 3건 완료' }
      ],
      reflections: [
        { userId: 2, content: '이번 달은 여러 프로젝트를 동시에 진행하면서 많은 것을 배웠습니다. 시간 관리와 우선순위 설정 능력이 향상되었습니다.' },
        { userId: 3, content: '목표했던 프로젝트를 모두 완료하고 새로운 기술도 습득했습니다. 다음 달에는 더 도전적인 과제에 도전하고 싶습니다.' }
      ]
    }
  }
};
