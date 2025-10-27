'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/shared/Sidebar';

interface MobileSidebarContextType {
  toggleSidebar: () => void;
}

const MobileSidebarContext = createContext<MobileSidebarContextType>({ toggleSidebar: () => {} });

export const useMobileSidebar = () => useContext(MobileSidebarContext);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, logout, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/');
    }
  }, [currentUser, isLoading, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <MobileSidebarContext.Provider value={{ toggleSidebar }}>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar
          currentUser={currentUser}
          onLogout={logout}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </MobileSidebarContext.Provider>
  );
}
