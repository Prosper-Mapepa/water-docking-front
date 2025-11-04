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
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl my-8">
          <div className="flex items-center justify-between p-6 border-b">
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

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
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

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {maintenance ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}