# 구현 가이드

이 문서는 요청된 기능들의 구현 가이드입니다.

## 완료된 기능 ✅

### 1. MultiSelect 컴포넌트
- `components/shared/MultiSelect.tsx` 생성
- 검색 가능한 드롭다운
- 다중 선택 지원
- 선택된 항목을 칩으로 표시

### 2. 진행 상태에 '진행전' 추가
- `lib/constants.ts`에 `pending` 상태 추가
- `lib/types.ts`에서 타입 업데이트

### 3. 일정 관리 - 여러 담당자 선택
- `Schedule` 인터페이스 변경: `userId` → `userIds` (배열)
- `AddScheduleModal`에 MultiSelect 적용
- 사원은 자신이 기본 선택됨
- 관리자만 다른 담당자 선택 가능

## 남은 작업 🚧

### 1. 일정 페이지 업데이트
`app/dashboard/schedule/page.tsx` 수정 필요:
- `userId` → `userIds` 배열로 변경
- 필터링 로직 업데이트
- 일정 상세에서 여러 담당자 표시

### 2. 프로젝트 추가 모달 - 파일 업로드
`components/projects/AddProjectModal.tsx` 수정 필요:
```typescript
const [files, setFiles] = useState<File[]>([]);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    setFiles(Array.from(e.target.files));
  }
};

// JSX에 추가
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">파일 업로드</label>
  <input
    type="file"
    multiple
    onChange={handleFileChange}
    className="w-full"
  />
  {files.length > 0 && (
    <div className="mt-2 space-y-1">
      {files.map((file, idx) => (
        <div key={idx} className="text-sm text-gray-600">
          {file.name} ({(file.size / 1024).toFixed(1)}KB)
        </div>
      ))}
    </div>
  )}
</div>
```

### 3. 프로젝트 추가 모달 - MultiSelect로 팀원 선택
`components/projects/AddProjectModal.tsx`의 팀원 선택 부분을 MultiSelect로 교체:
```typescript
import MultiSelect from '@/components/shared/MultiSelect';

// 기존 체크박스 부분 대신:
<MultiSelect
  label="팀원 선택"
  options={memberOptions}
  selected={formData.members}
  onChange={(selected) => setFormData({ ...formData, members: selected })}
  placeholder="팀원을 선택하세요"
/>
```

### 4. 프로젝트 상세 모달 - 상태 칩 클릭으로 변경
`components/projects/ProjectDetailModal.tsx` 수정:
```typescript
const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

// 드롭다운 제거하고 칩에 클릭 이벤트 추가:
<div className="relative">
  <button
    onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${STATUS_CONFIG[status].color} hover:opacity-80`}
  >
    <StatusIcon size={16} />
    {STATUS_CONFIG[status].label}
    <ChevronDown size={14} />
  </button>

  {isStatusMenuOpen && (
    <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10">
      {Object.entries(STATUS_CONFIG).map(([key, config]) => (
        <button
          key={key}
          onClick={() => {
            setStatus(key as any);
            setIsStatusMenuOpen(false);
          }}
          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
        >
          <config.icon size={16} />
          {config.label}
        </button>
      ))}
    </div>
  )}
</div>
```

### 5. 프로젝트 페이지 - 상태별 그루핑 (가로 나열)
`app/dashboard/projects/page.tsx` 전체 재구성:
```typescript
const groupedProjects = useMemo(() => {
  const groups: Record<ProjectStatus, Project[]> = {
    pending: [],
    progress: [],
    completed: [],
    paused: []
  };

  filteredProjects.forEach(project => {
    groups[project.status].push(project);
  });

  return groups;
}, [filteredProjects]);

// JSX:
<div className="flex gap-4 overflow-x-auto pb-4">
  {['pending', 'progress', 'paused', 'completed'].map(status => (
    <div key={status} className="flex-shrink-0 w-80">
      <div className="bg-white rounded-xl shadow-sm border">
        <div className={`p-4 ${STATUS_CONFIG[status].color}`}>
          <h3>{STATUS_CONFIG[status].label}</h3>
          <span>{groupedProjects[status].length}</span>
        </div>
        <div className="p-3 space-y-3">
          {groupedProjects[status].map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  ))}
</div>
```

### 6. 목표/회고 - 대표도 작성 가능
`app/dashboard/reflection/page.tsx` 수정:
- 관리자 뷰에서 `SAMPLE_USERS` 필터링 시 관리자도 포함
- `groupedByUser`에 관리자 추가

```typescript
const groupedByUser = useMemo(() => {
  const users = filterUser === 'all'
    ? SAMPLE_USERS  // 관리자 포함
    : SAMPLE_USERS.filter(u => u.id === parseInt(filterUser));

  // ...
}, [filteredReflections, filterUser]);
```

### 7. 반응형 사이드바
`components/shared/Sidebar.tsx` 수정:
```typescript
const [isOpen, setIsOpen] = useState(false);

return (
  <>
    {/* 모바일 메뉴 버튼 */}
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow"
    >
      <Menu size={24} />
    </button>

    {/* 사이드바 */}
    <aside className={`
      fixed lg:static
      inset-y-0 left-0 z-40
      w-64 bg-white border-r
      transform transition-transform
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* 기존 사이드바 내용 */}
    </aside>

    {/* 모바일 오버레이 */}
    {isOpen && (
      <div
        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        onClick={() => setIsOpen(false)}
      />
    )}
  </>
);
```

`components/shared/Header.tsx` 수정:
```typescript
<header className="bg-white border-b border-gray-200 px-6 py-4">
  <div className="flex items-center gap-4">
    <button
      onClick={onMenuClick}
      className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
    >
      <Menu size={24} />
    </button>
    {/* 기존 헤더 내용 */}
  </div>
</header>
```

### 8. 캘린더 색상 통일
모든 캘린더 컴포넌트에서:
```typescript
// 기존:
<div className="bg-blue-600 text-white p-6">

// 변경:
<div className="bg-white border-b border-gray-200 p-6">
```

파일들:
- `app/dashboard/schedule/page.tsx`
- `app/dashboard/reflection/page.tsx`

```typescript
// 날짜 표시를 파란색 배경 대신 다른 방식으로
<div className="bg-white border-b border-gray-200 p-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-2xl font-bold text-gray-900">
      {year}년 {month + 1}월
    </h3>
    {/* 네비게이션 버튼들 */}
  </div>
  {/* 요일 헤더 */}
  <div className="grid grid-cols-7 gap-2">
    {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
      <div
        key={day}
        className={`text-center py-2 text-sm font-medium ${
          idx === 0 ? 'text-red-600' : idx === 6 ? 'text-blue-600' : 'text-gray-900'
        }`}
      >
        {day}
      </div>
    ))}
  </div>
</div>
```

## 테스트 사항

1. 일정 추가 시 여러 담당자 선택 확인
2. 프로젝트 상태별 그루핑 확인
3. 모바일에서 사이드바 동작 확인
4. 프로젝트 상세에서 상태 칩 클릭 변경 확인
5. 대표의 목표/회고 작성 가능 확인

## 주의사항

- 파일 업로드는 실제 백엔드 연동 시 `FormData`로 전송 필요
- localStorage 대신 실제 데이터베이스 사용 권장
- 상태 관리 라이브러리 (Zustand, Redux 등) 고려
