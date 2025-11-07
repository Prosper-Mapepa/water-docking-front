'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { maintenanceApi, assetsApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  maintenance?: any;
  onSuccess: () => void;
}

export default function MaintenanceModal({
  isOpen,
  onClose,
  maintenance,
  onSuccess,
}: MaintenanceModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    if (maintenance) {
      reset({
        assetId: maintenance.assetId,
        type: maintenance.type,
        title: maintenance.title || '',
        description: maintenance.description,
        scheduledDate: maintenance.scheduledDate ? new Date(maintenance.scheduledDate).toISOString().slice(0, 16) : '',
        completedDate: maintenance.completedDate ? new Date(maintenance.completedDate).toISOString().slice(0, 16) : '',
        status: maintenance.status,
        estimatedCost: maintenance.estimatedCost || '',
        actualCost: maintenance.actualCost || '',
        assignedTo: maintenance.assignedTo || '',
        notes: maintenance.notes,
      });
    } else {
      reset({
        assetId: '',
        type: '',
        title: '',
        description: '',
        scheduledDate: '',
        status: 'SCHEDULED',
        estimatedCost: '',
        assignedTo: '',
        notes: '',
      });
    }
  }, [maintenance, reset]);

  const fetchAssets = async () => {
    try {
      const response = await assetsApi.getAll();
      setAssets(response.data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (maintenance) {
        // Update payload - can include completedDate, actualCost, etc.
        const payload: any = {
          assetId: data.assetId,
          type: data.type,
          title: data.title,
          description: data.description,
          scheduledDate: data.scheduledDate ? new Date(data.scheduledDate).toISOString() : null,
          status: data.status,
          notes: data.notes,
        };

        if (data.completedDate) {
          payload.completedDate = new Date(data.completedDate).toISOString();
        }
        if (data.estimatedCost) {
          payload.estimatedCost = parseFloat(data.estimatedCost);
        }
        if (data.actualCost) {
          payload.actualCost = parseFloat(data.actualCost);
        }
        if (data.assignedTo) {
          payload.assignedTo = data.assignedTo;
        }

        await maintenanceApi.update(maintenance.id, payload);
        toast.success('Maintenance record updated successfully');
      } else {
        // Create payload - only fields allowed in CreateMaintenanceRecordDto
        const payload: any = {
          assetId: data.assetId,
          type: data.type,
          title: data.title,
          description: data.description,
          scheduledDate: data.scheduledDate ? new Date(data.scheduledDate).toISOString() : null,
        };

        if (data.status) {
          payload.status = data.status;
        }
        if (data.estimatedCost) {
          payload.estimatedCost = parseFloat(data.estimatedCost);
        }
        if (data.assignedTo) {
          payload.assignedTo = data.assignedTo;
        }
        if (data.notes) {
          payload.notes = data.notes;
        }

        await maintenanceApi.create(payload);
        toast.success('Maintenance record created successfully');
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
                {maintenance ? 'Edit Maintenance Record' : 'New Maintenance Record'}
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
              <label className="label">Asset *</label>
              <select
                {...register('assetId', { required: true })}
                className="input"
              >
                <option value="">Select an asset</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} - {asset.location}
                  </option>
                ))}
              </select>
              {errors.assetId && (
                <p className="text-red-500 text-xs mt-1">Required</p>
              )}
            </div>

            <div>
              <label className="label">Title *</label>
              <input
                type="text"
                {...register('title', { required: true })}
                className="input"
                placeholder="Maintenance record title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">Required</p>
              )}
            </div>

            <div>
              <label className="label">Maintenance Type *</label>
              <select
                {...register('type', { required: true })}
                className="input"
              >
                <option value="">Select type</option>
                <option value="ROUTINE">Routine</option>
                <option value="PREVENTIVE">Preventive</option>
                <option value="CORRECTIVE">Corrective</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-xs mt-1">Required</p>
              )}
            </div>

            <div>
              <label className="label">Description *</label>
              <textarea
                {...register('description', { required: true })}
                rows={3}
                className="input"
                placeholder="Describe the maintenance work to be performed"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">Required</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Scheduled Date *</label>
                <input
                  type="datetime-local"
                  {...register('scheduledDate', { required: true })}
                  className="input"
                />
                {errors.scheduledDate && (
                  <p className="text-red-500 text-xs mt-1">Required</p>
                )}
              </div>
              <div>
                <label className="label">Status</label>
                <select {...register('status')} className="input">
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {maintenance && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Completed Date</label>
                  <input
                    type="datetime-local"
                    {...register('completedDate')}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Actual Cost</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('actualCost')}
                    className="input"
                    placeholder="Actual cost after completion"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Estimated Cost</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('estimatedCost')}
                  className="input"
                  placeholder="Estimated cost"
                />
              </div>
              <div>
                <label className="label">Assigned To</label>
                <input
                  type="text"
                  {...register('assignedTo')}
                  className="input"
                  placeholder="Name of staff member assigned"
                />
              </div>
            </div>

            <div>
              <label className="label">Notes</label>
              <textarea
                {...register('notes')}
                rows={2}
                className="input"
                placeholder="Additional notes or observations"
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
                  {maintenance ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}