'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { docksApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface DockModalProps {
  isOpen: boolean;
  onClose: () => void;
  dock?: any;
  onSuccess: () => void;
}

export default function DockModal({
  isOpen,
  onClose,
  dock,
  onSuccess,
}: DockModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (dock) {
      reset({
        dockNumber: dock.dockNumber,
        name: dock.name,
        size: dock.size,
        status: dock.status,
        location: dock.location || '',
        description: dock.description || '',
        maxBoatLength: dock.maxBoatLength || '',
        depth: dock.depth || '',
        powerAmperage: dock.powerAmperage || '',
        hasWater: dock.hasWater !== undefined ? dock.hasWater : true,
        hasSewage: dock.hasSewage !== undefined ? dock.hasSewage : false,
        hasFuel: dock.hasFuel !== undefined ? dock.hasFuel : false,
        builtDate: dock.builtDate ? new Date(dock.builtDate).toISOString().slice(0, 10) : '',
        maintenanceInterval: dock.maintenanceInterval || 30,
        lastMaintenanceDate: dock.lastMaintenanceDate ? new Date(dock.lastMaintenanceDate).toISOString().slice(0, 10) : '',
        nextMaintenanceDate: dock.nextMaintenanceDate ? new Date(dock.nextMaintenanceDate).toISOString().slice(0, 10) : '',
        amenitiesWifi: dock.amenities?.wifi || false,
        amenitiesSecurity: dock.amenities?.security || false,
        amenitiesLighting: dock.amenities?.lighting || false,
        amenitiesCleats: dock.amenities?.cleats || '',
        notes: dock.notes || '',
      });
    } else {
      reset({
        dockNumber: '',
        name: '',
        size: 'MEDIUM',
        status: 'AVAILABLE',
        location: '',
        description: '',
        maxBoatLength: '',
        depth: '',
        powerAmperage: '',
        hasWater: true,
        hasSewage: false,
        hasFuel: false,
        builtDate: '',
        maintenanceInterval: 30,
        lastMaintenanceDate: '',
        nextMaintenanceDate: '',
        amenitiesWifi: false,
        amenitiesSecurity: false,
        amenitiesLighting: false,
        amenitiesCleats: '',
        notes: '',
      });
    }
  }, [dock, reset]);

  const onSubmit = async (data: any) => {
    try {
      const payload: any = {
        dockNumber: data.dockNumber,
        name: data.name,
        size: data.size,
        status: data.status,
        location: data.location || null,
        description: data.description || null,
        maxBoatLength: data.maxBoatLength ? parseFloat(data.maxBoatLength) : null,
        depth: data.depth ? parseFloat(data.depth) : null,
        powerAmperage: data.powerAmperage ? parseInt(data.powerAmperage) : null,
        hasWater: data.hasWater,
        hasSewage: data.hasSewage,
        hasFuel: data.hasFuel,
        builtDate: data.builtDate ? new Date(data.builtDate).toISOString() : null,
        maintenanceInterval: parseInt(data.maintenanceInterval) || 30,
        notes: data.notes || null,
      };

      // Handle amenities
      const amenities: any = {};
      if (data.amenitiesWifi) amenities.wifi = true;
      if (data.amenitiesSecurity) amenities.security = true;
      if (data.amenitiesLighting) amenities.lighting = true;
      if (data.amenitiesCleats) amenities.cleats = parseInt(data.amenitiesCleats);
      if (Object.keys(amenities).length > 0) {
        payload.amenities = amenities;
      }

      // Only include maintenance dates for updates
      if (dock) {
        if (data.lastMaintenanceDate) {
          payload.lastMaintenanceDate = new Date(data.lastMaintenanceDate).toISOString();
        }
        if (data.nextMaintenanceDate) {
          payload.nextMaintenanceDate = new Date(data.nextMaintenanceDate).toISOString();
        }
      }

      if (dock) {
        await docksApi.update(dock.id, payload);
        toast.success('Dock updated successfully');
      } else {
        await docksApi.create(payload);
        toast.success('Dock created successfully');
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
          <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] flex flex-col">
            <div className="flex items-center justify-between border-b bg-white p-4 sm:p-6">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                {dock ? 'Edit Dock' : 'New Dock'}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-10rem)]">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Dock Number *</label>
                  <input
                    type="text"
                    {...register('dockNumber', { required: true })}
                    className="input"
                    placeholder="DOCK-001"
                  />
                  {errors.dockNumber && (
                    <p className="text-red-500 text-xs mt-1">Required</p>
                  )}
                </div>
                <div>
                  <label className="label">Name *</label>
                  <input
                    type="text"
                    {...register('name', { required: true })}
                    className="input"
                    placeholder="Main Dock A-12"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">Required</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
                <div>
                  <label className="label">Size *</label>
                  <select {...register('size', { required: true })} className="input">
                    <option value="SMALL">Small (up to 30ft)</option>
                    <option value="MEDIUM">Medium (30-50ft)</option>
                    <option value="LARGE">Large (50-80ft)</option>
                    <option value="EXTRA_LARGE">Extra Large (80ft+)</option>
                  </select>
                </div>
                <div>
                  <label className="label">Status *</label>
                  <select {...register('status', { required: true })} className="input">
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="OUT_OF_SERVICE">Out of Service</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
                <div>
                  <label className="label">Location</label>
                  <input
                    type="text"
                    {...register('location')}
                    className="input"
                    placeholder="North Marina Section"
                  />
                </div>
                <div>
                  <label className="label">Built Date</label>
                  <input
                    type="date"
                    {...register('builtDate')}
                    className="input"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="label">Description</label>
                <textarea
                  {...register('description')}
                  rows={2}
                  className="input"
                  placeholder="Dock description and details"
                />
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="label">Max Boat Length (ft)</label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('maxBoatLength')}
                    className="input"
                    placeholder="60.0"
                  />
                </div>
                <div>
                  <label className="label">Depth (ft)</label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('depth')}
                    className="input"
                    placeholder="12.5"
                  />
                </div>
                <div>
                  <label className="label">Power (Amperage)</label>
                  <input
                    type="number"
                    {...register('powerAmperage')}
                    className="input"
                    placeholder="50"
                  />
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-4">Services Available</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('hasWater')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Water</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('hasSewage')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Sewage</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('hasFuel')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Fuel</span>
                </label>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('amenitiesWifi')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">WiFi</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('amenitiesSecurity')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Security</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('amenitiesLighting')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Lighting</span>
                </label>
                <div>
                  <label className="label">Number of Cleats</label>
                  <input
                    type="number"
                    {...register('amenitiesCleats')}
                    className="input"
                    placeholder="8"
                  />
                </div>
              </div>
            </div>

            {/* Maintenance */}
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-4">Maintenance</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="label">Maintenance Interval (days)</label>
                  <input
                    type="number"
                    {...register('maintenanceInterval')}
                    className="input"
                    placeholder="30"
                  />
                </div>
                {dock && (
                  <>
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
                  </>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="label">Notes</label>
              <textarea
                {...register('notes')}
                rows={3}
                className="input"
                placeholder="Additional notes about this dock"
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
                  {dock ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}

