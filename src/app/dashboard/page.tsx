'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/Layout/MainLayout';
import { analyticsApi, visitsApi, maintenanceApi, customersApi } from '@/lib/api';
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  WrenchScrewdriverIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [occupancy, setOccupancy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState({
    overdueMaintenance: 0,
    newCustomersThisWeek: 0,
    visitsCompletedToday: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, occupancyRes, overdueMaintenanceRes, customersRes, visitsRes] = await Promise.all([
        analyticsApi.getDashboard(),
        analyticsApi.getOccupancy(),
        maintenanceApi.getOverdue(),
        customersApi.getAll(),
        visitsApi.getAll(),
      ]);
      setStats(statsRes.data);
      setOccupancy(occupancyRes.data);

      // Calculate overdue maintenance tasks
      const overdueMaintenance = overdueMaintenanceRes.data?.length || 0;

      // Calculate new customers this week
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const newCustomersThisWeek = customersRes.data?.filter((customer: any) => {
        const createdAt = new Date(customer.createdAt);
        return createdAt >= weekAgo && createdAt <= now;
      }).length || 0;

      // Calculate visits completed today
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(now);
      todayEnd.setHours(23, 59, 59, 999);
      const visitsCompletedToday = visitsRes.data?.filter((visit: any) => {
        if (!visit.checkOutTime) return false;
        const checkoutTime = new Date(visit.checkOutTime);
        return checkoutTime >= todayStart && checkoutTime <= todayEnd;
      }).length || 0;

      setActivityData({
        overdueMaintenance,
        newCustomersThisWeek,
        visitsCompletedToday,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: UsersIcon,
      color: 'bg-blue-500',
      change: stats?.customersChange || '0%',
      changeType: stats?.customersChangeType || 'positive',
    },
    {
      name: 'Active Visits',
      value: stats?.activeVisits || 0,
      icon: ClipboardDocumentListIcon,
      color: 'bg-green-500',
      change: stats?.visitsChange || '0%',
      changeType: stats?.visitsChangeType || 'positive',
    },
    {
      name: 'Pending Requests',
      value: stats?.pendingRequests || 0,
      icon: WrenchScrewdriverIcon,
      color: 'bg-yellow-500',
      change: stats?.requestsChange || '0%',
      changeType: stats?.requestsChangeType || 'positive',
    },
    {
      name: 'Unreviewed Feedback',
      value: stats?.unreviewedFeedback || 0,
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-purple-500',
      change: stats?.feedbackChange || '0%',
      changeType: stats?.feedbackChangeType || 'positive',
    },
  ];

  const quickActions = [
    {
      name: 'New Customer',
      description: 'Add a new customer',
      icon: UsersIcon,
      href: '/customers',
      color: 'bg-blue-500',
    },
    {
      name: 'Check-In Visit',
      description: 'Record a new visit',
      icon: ClipboardDocumentListIcon,
      href: '/visits',
      color: 'bg-green-500',
    },
    {
      name: 'Service Request',
      description: 'Create service request',
      icon: WrenchScrewdriverIcon,
      href: '/service-requests',
      color: 'bg-yellow-500',
    },
    {
      name: 'Schedule Maintenance',
      description: 'Plan maintenance work',
      icon: ClockIcon,
      href: '/maintenance',
      color: 'bg-purple-500',
    },
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-8 animate-fade-in">
          {/* Welcome Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.firstName}! 👋
                </h1>
                <p className="text-primary-100 text-lg font-medium">
                  Here's what's happening at your business today
                </p>
              </div>
              <div className="hidden sm:block bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 border border-white/20">
                <div className="text-right">
                  {/* <p className="text-sm text-primary-200 font-medium mb-1">Current Role</p> */}
                  <p className=" font-bold">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat, index) => (
              <div 
                key={stat.name} 
                className="stat-card animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{stat.name}</p>
                    <div className="flex items-baseline space-x-2 mb-3">
                      <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                      <p className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                        stat.changeType === 'positive' 
                          ? 'text-green-700 bg-green-50' 
                          : 'text-red-700 bg-red-50'
                      }`}>
                        {stat.change}
                      </p>
                    </div>
                  </div>
                  <div className={`${stat.color} rounded-xl p-3 shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 font-medium">vs last period</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Occupancy Rate */}
            <div className="lg:col-span-2">
              <div className="card p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/20 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">Dock Occupancy</h3>
                      <p className="text-sm text-gray-500">Real-time dock utilization metrics</p>
                    </div>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200 self-start sm:self-auto">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-green-700">Live</span>
                    </div>
                  </div>
                  {occupancy && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                        <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Docks</p>
                          <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {stats?.totalDocks || occupancy.totalDocks || 0}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Occupied</p>
                          <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                            {occupancy.occupiedDocks}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">of {occupancy.totalDocks}</p>
                        </div>
                        <div className="bg-gradient-to-br from-primary-50 to-white p-5 rounded-xl border border-primary-100">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Occupancy</p>
                          <p className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                            {occupancy.occupancyRate.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-sm font-semibold text-gray-700">Occupancy Progress</span>
                          <span className="text-sm font-bold text-primary-600">{occupancy.occupancyRate.toFixed(1)}%</span>
                        </div>
                        <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 rounded-full transition-all duration-1000 ease-out shadow-lg"
                            style={{ width: `${Math.min(occupancy.occupancyRate, 100)}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse-soft"></div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 pt-6 border-t border-gray-200 sm:grid-cols-2">
                        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-4 h-4 bg-blue-500 rounded-full shadow-md"></div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Occupied</p>
                            <p className="text-lg font-bold text-blue-600">{occupancy.occupiedDocks}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-4 h-4 bg-gray-400 rounded-full shadow-md"></div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Available</p>
                            <p className="text-lg font-bold text-gray-600">{occupancy.availableDocks}</p>
                          </div>
                        </div>
                      </div>
                      {(occupancy.maintenanceDocks > 0 || occupancy.outOfServiceDocks > 0) && (
                        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-200 sm:grid-cols-2">
                          {occupancy.maintenanceDocks > 0 && (
                            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                              <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-md"></div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">Maintenance</p>
                                <p className="text-lg font-bold text-yellow-600">{occupancy.maintenanceDocks}</p>
                              </div>
                            </div>
                          )}
                          {occupancy.outOfServiceDocks > 0 && (
                            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                              <div className="w-4 h-4 bg-red-500 rounded-full shadow-md"></div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">Out of Service</p>
                                <p className="text-lg font-bold text-red-600">{occupancy.outOfServiceDocks}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={action.name}
                      onClick={() => router.push(action.href)}
                      className="w-full flex items-center p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-primary-50/30 transition-all duration-200 group border border-transparent hover:border-primary-200 hover:shadow-md"
                    >
                      <div className={`${action.color} rounded-xl p-3 mr-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                          {action.name}
                        </p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{action.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Alerts and Notifications */}
          <div className="card p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Recent Activity & Alerts</h3>
                <p className="text-sm text-gray-500">Stay informed with real-time updates</p>
              </div>
            </div>
            <div className="space-y-3">
              {activityData.overdueMaintenance > 0 && (
                <div className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-50/50 rounded-xl border border-yellow-200 hover:shadow-md transition-all">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-4 shadow-md animate-pulse"></div>
                  <p className="text-sm text-gray-700">
                    <span className="font-bold text-gray-900">
                      {activityData.overdueMaintenance} maintenance task{activityData.overdueMaintenance !== 1 ? 's' : ''}
                    </span>{' '}
                    {activityData.overdueMaintenance === 1 ? 'is' : 'are'} overdue and require attention
                  </p>
                </div>
              )}
              {activityData.newCustomersThisWeek > 0 && (
                <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-xl border border-blue-200 hover:shadow-md transition-all">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 shadow-md"></div>
                  <p className="text-sm text-gray-700">
                    <span className="font-bold text-gray-900">
                      {activityData.newCustomersThisWeek} new customer{activityData.newCustomersThisWeek !== 1 ? 's' : ''}
                    </span>{' '}
                    registered this week - growth trend
                  </p>
                </div>
              )}
              {activityData.visitsCompletedToday > 0 && (
                <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-50/50 rounded-xl border border-green-200 hover:shadow-md transition-all">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-4 shadow-md"></div>
                  <p className="text-sm text-gray-700">
                    <span className="font-bold text-gray-900">
                      {activityData.visitsCompletedToday} visit{activityData.visitsCompletedToday !== 1 ? 's' : ''}
                    </span>{' '}
                    completed today - excellent performance
                  </p>
                </div>
              )}
              {activityData.overdueMaintenance === 0 && activityData.newCustomersThisWeek === 0 && activityData.visitsCompletedToday === 0 && (
                <div className="flex items-center justify-center p-8 text-gray-500">
                  <p className="text-sm">No recent activity to display</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}








