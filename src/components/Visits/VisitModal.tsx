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
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl my-8">
          <div className="flex items-center justify-between p-6 border-b">
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

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Boat Name</label>
                <input {...register('boatName')} className="input" />
              </div>
              <div>
                <label className="label">Boat Type</label>
                <input {...register('boatType')} className="input" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4 mt-2">
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

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {visit ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
