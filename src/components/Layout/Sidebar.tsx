'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  WrenchScrewdriverIcon,
  CubeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Customers', href: '/customers', icon: UsersIcon },
  { name: 'Visits', href: '/visits', icon: ClipboardDocumentListIcon },
  { name: 'Service Requests', href: '/service-requests', icon: WrenchScrewdriverIcon },
  { name: 'Feedback', href: '/feedback', icon: ChatBubbleLeftRightIcon },
  { name: 'Docks', href: '/docks', icon: BuildingOfficeIcon },
  { name: 'Assets', href: '/assets', icon: CubeIcon },
  { name: 'Maintenance', href: '/maintenance', icon: WrenchScrewdriverIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col w-64 bg-gradient-to-b from-white via-white to-gray-50/50 border-r border-gray-200/80 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center h-20 px-6 border-b border-gray-200/60 bg-gradient-to-r from-primary-50/50 to-transparent">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {/* Wave/Water icon */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 14c2-1 4-1 6 0s4-1 6 0 4-1 6 0" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 18c2-1 4-1 6 0s4-1 6 0 4-1 6 0" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10c2-1 4-1 6 0s4-1 6 0 4-1 6 0" />
          </svg>
        </div>
        <div className="ml-3">
          <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Water Docking</h1>
          <p className="text-xs text-gray-500 font-medium">Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700 border-l-4 border-primary-600 shadow-sm'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-50/50 hover:text-gray-900',
                  'group flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 relative'
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-600 to-primary-500"></div>
                )}
                <item.icon
                  className={cn(
                    isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600',
                    'mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200'
                  )}
                  aria-hidden="true"
                />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
              <Cog6ToothIcon className="h-4 w-4 mr-2 text-gray-400" />
              Settings
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2 text-gray-400" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

