'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/Layout/MainLayout';
import { analyticsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  CurrencyDollarIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#ef4444', '#9333ea', '#ec4899'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
        <p className="font-bold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' && entry.name.includes('Revenue') || entry.name.includes('Cost')
              ? formatCurrency(entry.value)
              : entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [revenue, setRevenue] = useState<any>(null);
  const [customerInsights, setCustomerInsights] = useState<any>(null);
  const [maintenanceData, setMaintenanceData] = useState<any>(null);
  const [serviceAnalytics, setServiceAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [revenueRes, customersRes, maintenanceRes, servicesRes] = await Promise.all([
        analyticsApi.getRevenue(),
        analyticsApi.getCustomerInsights(),
        analyticsApi.getMaintenanceAnalytics(),
        analyticsApi.getServiceAnalytics(),
      ]);
      setRevenue(revenueRes.data);
      setCustomerInsights(customersRes.data);
      setMaintenanceData(maintenanceRes.data);
      setServiceAnalytics(servicesRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading analytics...</p>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const membershipData = customerInsights?.membershipDistribution?.map((item: any) => ({
    name: item.tier,
    value: parseInt(item.count) || 0,
  })) || [];

  const monthlySpending = maintenanceData?.monthlySpending?.map((item: any) => ({
    month: item.month,
    cost: parseFloat(item.totalCost) || 0,
    count: parseInt(item.count) || 0,
  })) || [];

  const serviceTypeData = serviceAnalytics?.requestsByType?.map((item: any) => ({
    name: item.serviceType,
    count: parseInt(item.count) || 0,
    avgCost: parseFloat(item.avgCost) || 0,
  })) || [];

  const serviceStatusData = serviceAnalytics?.requestsByStatus?.map((item: any) => ({
    name: item.status,
    value: parseInt(item.count) || 0,
  })) || [];

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-8 animate-fade-in">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Analytics & Reports
            </h1>
            <p className="mt-2 text-gray-600 font-medium">
              Comprehensive business insights and performance metrics
            </p>
          </div>

          {/* Revenue Overview */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="stat-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Total Revenue
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
                    {formatCurrency(revenue?.totalRevenue || 0)}
                  </p>
                  <p className="text-xs text-gray-500">All-time earnings</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CurrencyDollarIcon className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Total Visits
                  </p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {revenue?.totalVisits?.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-gray-500">Customer visits</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ClipboardDocumentListIcon className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Avg Revenue
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2">
                    {formatCurrency(revenue?.averageRevenue || 0)}
                  </p>
                  <p className="text-xs text-gray-500">Per visit</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ChartBarIcon className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Membership Distribution */}
            {membershipData.length > 0 && (
              <div className="card p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Membership Distribution</h3>
                  <p className="text-sm text-gray-500">Customer tier breakdown</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={membershipData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {membershipData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Service Status Distribution */}
            {serviceStatusData.length > 0 && (
              <div className="card p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Service Request Status</h3>
                  <p className="text-sm text-gray-500">Current request distribution</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serviceStatusData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Service Type Chart */}
          {serviceTypeData.length > 0 && (
            <div className="card p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Service Requests by Type</h3>
                <p className="text-sm text-gray-500">Breakdown of service categories</p>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={serviceTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="count" fill="#0284c7" name="Request Count" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="avgCost" fill="#10b981" name="Avg Cost" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Monthly Maintenance Spending */}
          {monthlySpending.length > 0 && (
            <div className="card p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Monthly Maintenance Spending</h3>
                <p className="text-sm text-gray-500">Track maintenance costs over time</p>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={monthlySpending}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="cost"
                    stroke="#0284c7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCost)"
                    name="Total Cost"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top Customers */}
          {customerInsights?.topCustomers && customerInsights.topCustomers.length > 0 && (
            <div className="card p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Top Customers</h3>
                <p className="text-sm text-gray-500">Most valuable customers by visits and spending</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Membership
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Total Visits
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Total Spent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customerInsights.topCustomers.slice(0, 10).map((customer: any, index: number) => (
                      <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mr-3 shadow-md">
                              <span className="text-white font-bold text-sm">
                                {customer.firstName?.[0]}{customer.lastName?.[0]}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900">
                                {customer.firstName} {customer.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                            {customer.membershipTier}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {parseInt(customer.visitCount) || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                          {formatCurrency(parseFloat(customer.totalSpent) || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!revenue && !customerInsights && !maintenanceData && (
            <div className="card p-12 text-center">
              <ChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No analytics data yet</h3>
              <p className="text-gray-500">Analytics will appear here as data is collected.</p>
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
