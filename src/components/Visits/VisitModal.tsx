'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { visitsApi, customersApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface VisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit?: any;
  onSuccess: () => void;
}

export default function VisitModal({
  isOpen,
  onClose,
  visit,
  onSuccess,
}: VisitModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (visit) {
      reset({
        customerId: visit.customerId,
        dockNumber: visit.dockNumber,
        boatName: visit.boatName,
        boatType: visit.boatType,
        checkInTime: visit.checkInTime ? new Date(visit.checkInTime).toISOString().slice(0, 16) : '',
        checkOutTime: visit.checkOutTime ? new Date(visit.checkOutTime).toISOString().slice(0, 16) : '',
        serviceCharges: visit.serviceCharges,
        servicesUsed: visit.servicesUsed || {},
        notes: visit.notes,
      });
    } else {
      reset({
        customerId: '',
        dockNumber: '',
        boatName: '',
        boatType: '',
        checkInTime: '',
        checkOutTime: '',
        serviceCharges: 0,
        servicesUsed: {
          power: false,
          water: false,
          waste: false,
          fuel: false,
          other: [],
        },
        notes: '',
      });
    }
  }, [visit, reset]);

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
        checkInTime: data.checkInTime ? new Date(data.checkInTime).toISOString() : new Date().toISOString(),
        checkOutTime: data.checkOutTime ? new Date(data.checkOutTime).toISOString() : null,
        serviceCharges: parseFloat(data.serviceCharges) || 0,
      };

      if (visit) {
        await visitsApi.update(visit.id, payload);
        toast.success('Visit updated successfully');
      } else {
        await visitsApi.create(payload);
        toast.success('Visit created successfully');
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
                {visit ? 'Edit Visit' : 'New Visit'}
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Dock Number *</label>
                <input
                  {...register('dockNumber', { required: true })}
                  className="input"
                  placeholder="e.g., A-15"
                />
                {errors.dockNumber && (
                  <p className="text-red-500 text-xs mt-1">Required</p>
                )}
              </div>
              <div>
                <label className="label">Service Charges</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('serviceCharges')}
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Boat Name</label>
                <input {...register('boatName')} className="input" />
              </div>
              <div>
                <label className="label">Boat Type</label>
                <input {...register('boatType')} className="input" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Check-In Time *</label>
                <input
                  type="datetime-local"
                  {...register('checkInTime', { required: true })}
                  className="input"
                />
                {errors.checkInTime && (
                  <p className="text-red-500 text-xs mt-1">Required</p>
                )}
              </div>
              <div>
                <label className="label">Check-Out Time</label>
                <input
                  type="datetime-local"
                  {...register('checkOutTime')}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="label">Services Used</label>
              <div className="grid grid-cols-1 gap-3 mt-2 sm:grid-cols-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('servicesUsed.power')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Power</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('servicesUsed.water')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Water</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('servicesUsed.waste')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Waste</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('servicesUsed.fuel')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Fuel</span>
                </label>
              </div>
            </div>

            <div>
              <label className="label">Notes</label>
              <textarea
                {...register('notes')}
                rows={3}
                className="input"
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
                  {visit ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
