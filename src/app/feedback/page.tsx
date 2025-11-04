'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/Layout/MainLayout';
import { feedbackApi } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#10b981', '#34d399', '#fbbf24', '#f87171', '#ef4444'];

export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'unreviewed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
    fetchStats();
  }, [filter]);

  const fetchFeedback = async () => {
    try {
      const response = filter === 'unreviewed'
        ? await feedbackApi.getUnreviewed()
        : await feedbackApi.getAll();
      setFeedbackList(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await feedbackApi.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIcon key={star} className="h-5 w-5 text-yellow-400 fill-current" />
          ) : (
            <StarOutlineIcon key={star} className="h-5 w-5 text-gray-300" />
          )
        ))}
      </div>
    );
  };

  const getRatingDistribution = () => {
    if (!feedbackList.length) return [];
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedbackList.forEach((feedback) => {
      if (feedback.rating) {
        distribution[feedback.rating as keyof typeof distribution]++;
      }
    });
    return [
      { name: '5 Stars', value: distribution[5], color: COLORS[0] },
      { name: '4 Stars', value: distribution[4], color: COLORS[1] },
      { name: '3 Stars', value: distribution[3], color: COLORS[2] },
      { name: '2 Stars', value: distribution[2], color: COLORS[3] },
      { name: '1 Star', value: distribution[1], color: COLORS[4] },
    ].filter(item => item.value > 0);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading feedback...</p>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const ratingDistribution = getRatingDistribution();

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-8 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Customer Feedback
              </h1>
              <p className="mt-2 text-gray-600 font-medium">
                Track and manage customer satisfaction and reviews
              </p>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="stat-card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Total Feedback
                    </p>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {stats.total || feedbackList.length}
                    </p>
                    <p className="text-xs text-gray-500">All time reviews</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <ChatBubbleLeftRightIcon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Average Rating
                    </p>
                    <div className="flex items-baseline space-x-3 mb-2">
                      <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                        {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
                      </p>
                      <div className="flex items-center">
                        <StarIcon className="h-6 w-6 text-yellow-400 fill-current" />
                      </div>
                    </div>
                    <div className="flex items-center mt-1">
                      {renderStars(Math.round(stats.averageRating || 0))}
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                    <StarIcon className="h-7 w-7 text-white fill-current" />
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Unreviewed
                    </p>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {stats.unreviewed || feedbackList.filter(f => !f.reviewed).length}
                    </p>
                    <p className="text-xs text-gray-500">Requires attention</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rating Distribution Chart */}
          {ratingDistribution.length > 0 && (
            <div className="card p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Rating Distribution</h3>
                <p className="text-sm text-gray-500">Visual breakdown of customer ratings</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ratingDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ratingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="card p-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Feedback ({feedbackList.length})
              </button>
              <button
                onClick={() => setFilter('unreviewed')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  filter === 'unreviewed'
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Unreviewed ({stats?.unreviewed || 0})
              </button>
            </div>
          </div>

          {/* Feedback List */}
          <div className="space-y-4">
            {feedbackList.length === 0 ? (
              <div className="card p-12 text-center">
                <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No feedback yet</h3>
                <p className="text-gray-500">Customer feedback will appear here once submitted.</p>
              </div>
            ) : (
              feedbackList.map((feedback, index) => (
                <div
                  key={feedback.id}
                  className="card p-6 hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-lg">
                            {feedback.customer?.firstName?.[0] || 'C'}
                            {feedback.customer?.lastName?.[0] || ''}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {feedback.customer?.firstName} {feedback.customer?.lastName || 'Anonymous'}
                          </h3>
                          <p className="text-sm text-gray-500">{feedback.customer?.email}</p>
                        </div>
                        <div className="text-right">
                          {feedback.rating && (
                            <div className="mb-2">{renderStars(feedback.rating)}</div>
                          )}
                          {feedback.category && (
                            <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                              {feedback.category}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
                        <p className="text-gray-700 leading-relaxed font-medium">
                          {feedback.comments || 'No comment provided'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-6 text-sm">
                          <span className="text-gray-500 font-medium">
                            {formatDateTime(feedback.createdAt)}
                          </span>
                          {feedback.reviewed ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                              ✓ Reviewed
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold border border-orange-200 animate-pulse">
                              ⚠ Unreviewed
                            </span>
                          )}
                        </div>
                      </div>

                      {feedback.staffResponse && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-200">
                          <p className="text-sm font-bold text-primary-900 mb-2">Staff Response:</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{feedback.staffResponse}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
