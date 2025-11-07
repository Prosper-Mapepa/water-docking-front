'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { assetsApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset?: any;
  onSuccess: () => void;
}

export default function AssetModal({
  isOpen,
  onClose,
  asset,
  onSuccess,
}: AssetModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (asset) {
      reset({
        name: asset.name,
        type: asset.type,
        location: asset.location,
        purchaseDate: asset.purchaseDate ? new Date(asset.purchaseDate).toISOString().slice(0, 10) : '',
        purchasePrice: asset.purchasePrice,
        warrantyExpiry: asset.warrantyExpiry ? new Date(asset.warrantyExpiry).toISOString().slice(0, 10) : '',
        status: asset.status,
        description: asset.description,
        maintenanceInterval: asset.maintenanceInterval,
        lastMaintenanceDate: asset.lastMaintenanceDate ? new Date(asset.lastMaintenanceDate).toISOString().slice(0, 10) : '',
        nextMaintenanceDate: asset.nextMaintenanceDate ? new Date(asset.nextMaintenanceDate).toISOString().slice(0, 10) : '',
      });
    } else {
      reset({
        name: '',
        type: '',
        location: '',
        purchaseDate: '',
        purchasePrice: 0,
        warrantyExpiry: '',
        status: 'OPERATIONAL',
        description: '',
        maintenanceInterval: 30,
        lastMaintenanceDate: '',
        nextMaintenanceDate: '',
      });
    }
  }, [asset, reset]);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate).toISOString() : null,
        warrantyExpiry: data.warrantyExpiry ? new Date(data.warrantyExpiry).toISOString() : null,
        lastMaintenanceDate: data.lastMaintenanceDate ? new Date(data.lastMaintenanceDate).toISOString() : null,
        nextMaintenanceDate: data.nextMaintenanceDate ? new Date(data.nextMaintenanceDate).toISOString() : null,
        purchasePrice: parseFloat(data.purchasePrice) || 0,
        maintenanceInterval: parseInt(data.maintenanceInterval) || 30,
      };

      if (asset) {
        await assetsApi.update(asset.id, payload);
        toast.success('Asset updated successfully');
      } else {
        await assetsApi.create(payload);
        toast.success('Asset created successfully');
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
          <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)]">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              {asset ? 'Edit Asset' : 'New Asset'}
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
                  <label className="label">Asset Name *</label>
                  <input
                    {...register('name', { required: true })}
                    className="input"
                    placeholder="e.g., Dock Power Station A-15"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">Required</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Asset Type *</label>
                    <select
                      {...register('type', { required: true })}
                      className="input"
                    >
                      <option value="">Select type</option>
                      <option value="DOCK">Dock</option>
                      <option value="POWER_STATION">Power Station</option>
                      <option value="WATER_SYSTEM">Water System</option>
                      <option value="FUEL_STATION">Fuel Station</option>
                      <option value="EQUIPMENT">Equipment</option>
                      <option value="BUILDING">Building</option>
                      <option value="OTHER">Other</option>
                    </select>
                    {errors.type && (
                      <p className="text-red-500 text-xs mt-1">Required</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Status</label>
                    <select {...register('status')} className="input">
                      <option value="OPERATIONAL">Operational</option>
                      <option value="MAINTENANCE_REQUIRED">Maintenance Required</option>
                      <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                      <option value="OUT_OF_SERVICE">Out of Service</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Location *</label>
                  <input
                    {...register('location', { required: true })}
                    className="input"
                    placeholder="e.g., Dock A, Slip 15"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-xs mt-1">Required</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Purchase Date</label>
                    <input
                      type="date"
                      {...register('purchaseDate')}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Purchase Price</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('purchasePrice')}
                      className="input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Warranty Expiry</label>
                    <input
                      type="date"
                      {...register('warrantyExpiry')}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Maintenance Interval (days)</label>
                    <input
                      type="number"
                      {...register('maintenanceInterval')}
                      className="input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Last Maintenance Date</label>
                    <input
                      type="date"
                      {...register('lastMaintenanceDate')}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Next Maintenance Date</label>
                    <input
                      type="date"
                      {...register('nextMaintenanceDate')}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="input"
                    placeholder="Additional details about the asset"
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
                  {asset ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
