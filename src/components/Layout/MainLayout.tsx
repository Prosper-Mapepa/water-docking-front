'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  const handleOpenSidebar = () => setIsMobileSidebarOpen(true);
  const handleCloseSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Mobile sidebar */}
        <div
          className={cn(
            'fixed inset-0 z-40 flex md:hidden transition-all duration-300',
            isMobileSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'
          )}
        >
          <button
            type="button"
            onClick={handleCloseSidebar}
            className={cn(
              'absolute inset-0 bg-gray-900/40 transition-opacity duration-300 ease-in-out',
              isMobileSidebarOpen ? 'opacity-100' : 'opacity-0'
            )}
            aria-label="Close sidebar overlay"
          />
          <div
            className={cn(
              'relative h-full w-72 max-w-[80%] transform transition-transform duration-300 ease-in-out',
              isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <Sidebar
              isMobile
              onNavigate={handleCloseSidebar}
              className="w-72"
            />
          </div>
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-shrink-0">
          <Sidebar />
        </aside>

        <div className="flex flex-1 flex-col min-h-screen overflow-hidden">
          <Header onOpenSidebar={handleOpenSidebar} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto w-full max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}










