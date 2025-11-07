'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { customersApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: any;
  onSuccess: () => void;
}

export default function CustomerModal({
  isOpen,
  onClose,
  customer,
  onSuccess,
}: CustomerModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (customer) {
      reset(customer);
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        membershipTier: 'BASIC',
        notes: '',
      });
    }
  }, [customer, reset]);

  const onSubmit = async (data: any) => {
    try {
      // Whitelist payload to avoid sending non-updatable fields (e.g., id, timestamps, relations)
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || undefined,
        address: data.address || undefined,
        membershipTier: data.membershipTier,
        notes: data.notes || undefined,
      };

      if (customer) {
        await customersApi.update(customer.id, payload);
        toast.success('Customer updated successfully');
      } else {
        await customersApi.create(payload);
        toast.success('Customer created successfully');
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
            <div className="flex items-center justify-between p-4 sm:p-6 border-b">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              {customer ? 'Edit Customer' : 'New Customer'}
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">First Name *</label>
                <input
                  {...register('firstName', { required: true })}
                  className="input"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">Required</p>
                )}
              </div>
              <div>
                <label className="label">Last Name *</label>
                <input
                  {...register('lastName', { required: true })}
                  className="input"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">Required</p>
                )}
              </div>
            </div>

                <div>
                  <label className="label">Email *</label>
                  <input
                    type="email"
                    {...register('email', { required: true })}
                    className="input"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">Required</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Phone</label>
                    <input {...register('phone')} className="input" />
                  </div>
                  <div>
                    <label className="label">Membership Tier</label>
                    <select {...register('membershipTier')} className="input">
                      <option value="BASIC">Basic</option>
                      <option value="SILVER">Silver</option>
                      <option value="GOLD">Gold</option>
                      <option value="PLATINUM">Platinum</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Address</label>
                  <input {...register('address')} className="input" />
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
                  {customer ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}







