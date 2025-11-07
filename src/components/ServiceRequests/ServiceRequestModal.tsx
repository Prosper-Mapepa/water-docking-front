'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { serviceRequestsApi, customersApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceRequest?: any;
  onSuccess: () => void;
}

export default function ServiceRequestModal({
  isOpen,
  onClose,
  serviceRequest,
  onSuccess,
}: ServiceRequestModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (serviceRequest) {
      reset({
        customerId: serviceRequest.customerId,
        serviceType: serviceRequest.serviceType,
        title: serviceRequest.title,
        description: serviceRequest.description,
        priority: serviceRequest.priority,
        status: serviceRequest.status,
        requestedDate: serviceRequest.requestedDate ? new Date(serviceRequest.requestedDate).toISOString().slice(0, 16) : '',
        estimatedCost: serviceRequest.estimatedCost,
        notes: serviceRequest.notes,
      });
    } else {
      reset({
        customerId: '',
        serviceType: '',
        title: '',
        description: '',
        priority: 'MEDIUM',
        status: 'PENDING',
        requestedDate: '',
        estimatedCost: 0,
        notes: '',
      });
    }
  }, [serviceRequest, reset]);

  const fetchCustomers = async () => {
    try {
      const response = await customersApi.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        serviceType: String(data.serviceType || '').trim(),
        requestedDate: data.requestedDate ? new Date(data.requestedDate).toISOString() : new Date().toISOString(),
        estimatedCost: parseFloat(data.estimatedCost) || 0,
      };

      if (serviceRequest) {
        await serviceRequestsApi.update(serviceRequest.id, payload);
        toast.success('Service request updated successfully');
      } else {
        await serviceRequestsApi.create(payload);
        toast.success('Service request created successfully');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)]">
            <div className="flex items-center justify-between border-b p-4 sm:p-6">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                {serviceRequest ? 'Edit Service Request' : 'New Service Request'}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-10rem)]">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div>
              <label className="label">Customer *</label>
              <select
                {...register('customerId', { required: true })}
                className="input"
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName} - {customer.email}
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <p className="text-red-500 text-xs mt-1">Required</p>
              )}
            </div>

              <div>
                <label className="label">Service Type *</label>
                <input
                  {...register('serviceType', { required: true })}
                  className="input"
                  placeholder="e.g., Dock Repair, Fueling, Water Supply"
                />
                {errors.serviceType && (
                  <p className="text-red-500 text-xs mt-1">Required</p>
                )}
              </div>

            <div>
              <label className="label">Title *</label>
              <input
                {...register('title', { required: true })}
                className="input"
                placeholder="Brief description of the service"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">Required</p>
              )}
            </div>

            <div>
              <label className="label">Description *</label>
              <textarea
                {...register('description', { required: true })}
                rows={3}
                className="input"
                placeholder="Detailed description of the service needed"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">Required</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Priority</label>
                <select {...register('priority')} className="input">
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select {...register('status')} className="input">
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Requested Date</label>
                <input
                  type="datetime-local"
                  {...register('requestedDate')}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Estimated Cost</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('estimatedCost')}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="label">Notes</label>
              <textarea
                {...register('notes')}
                rows={2}
                className="input"
                placeholder="Additional notes or special instructions"
              />
            </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t p-4 sm:p-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary w-full sm:w-auto justify-center"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary w-full sm:w-auto justify-center">
                  {serviceRequest ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
