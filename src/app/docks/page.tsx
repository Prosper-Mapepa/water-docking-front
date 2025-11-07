'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/Layout/MainLayout';
import { docksApi } from '@/lib/api';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import DockModal from '@/components/Docks/DockModal';
import { formatDate } from '@/lib/utils';

export default function DocksPage() {
  const [docks, setDocks] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDock, setSelectedDock] = useState<any>(null);

  useEffect(() => {
    fetchDocks();
  }, [filter]);

  const fetchDocks = async () => {
    try {
      let response;
      if (filter === 'available') {
        response = await docksApi.getAvailable();
      } else if (filter === 'occupied') {
        response = await docksApi.getAll('OCCUPIED');
      } else if (filter === 'maintenance') {
        response = await docksApi.getAll('MAINTENANCE');
      } else {
        response = await docksApi.getAll();
      }
      setDocks(response.data);
    } catch (error) {
      toast.error('Failed to fetch docks');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedDock(null);
    setIsModalOpen(true);
  };

  const handleEdit = (dock: any) => {
    setSelectedDock(dock);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dock?')) return;
    try {
      await docksApi.delete(id);
      toast.success('Dock deleted successfully');
      fetchDocks();
    } catch (error) {
      toast.error('Failed to delete dock');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'OCCUPIED':
        return 'bg-blue-100 text-blue-800';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800';
      case 'OUT_OF_SERVICE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'SMALL':
        return 'bg-blue-100 text-blue-800';
      case 'MEDIUM':
        return 'bg-purple-100 text-purple-800';
      case 'LARGE':
        return 'bg-indigo-100 text-indigo-800';
      case 'EXTRA_LARGE':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading docks...</p>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dock Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and track all dock facilities
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="btn-primary inline-flex items-center justify-center w-full sm:w-auto"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Dock
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="card p-4 sm:p-6">
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md font-medium text-sm ${
                  filter === 'all'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Docks
              </button>
              <button
                onClick={() => setFilter('available')}
                className={`px-4 py-2 rounded-md font-medium text-sm ${
                  filter === 'available'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setFilter('occupied')}
                className={`px-4 py-2 rounded-md font-medium text-sm ${
                  filter === 'occupied'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Occupied
              </button>
              <button
                onClick={() => setFilter('maintenance')}
                className={`px-4 py-2 rounded-md font-medium text-sm ${
                  filter === 'maintenance'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Maintenance
              </button>
            </div>
          </div>

          {/* Docks Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dock Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Max Length
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Power
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Built Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {docks.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                        No docks found
                      </td>
                    </tr>
                  ) : (
                    docks.map((dock) => (
                      <tr key={dock.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {dock.dockNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{dock.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSizeColor(
                              dock.size
                            )}`}
                          >
                            {dock.size?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              dock.status
                            )}`}
                          >
                            {dock.status?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dock.location || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dock.maxBoatLength ? `${dock.maxBoatLength}ft` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dock.powerAmperage ? `${dock.powerAmperage}A` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dock.builtDate ? formatDate(dock.builtDate) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(dock)}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(dock.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <DockModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDock(null);
          }}
          dock={selectedDock}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedDock(null);
            fetchDocks();
          }}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}

