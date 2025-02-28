import React, { useState } from 'react';
import { Hotel } from '../types';

interface AddHotelFormProps {
  onSubmit: (hotel: Omit<Hotel, 'id' | 'createdAt'>) => void;
}

export function AddHotelForm({ onSubmit }: AddHotelFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    logo: '',
    image: '',
    latitude: '',
    longitude: '',
    totalRooms: '',
    floors: '',
    secretKey: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      address: formData.address,
      logo: formData.logo,
      image: formData.image,
      latitude: parseFloat(formData.latitude) || 0,
      longitude: parseFloat(formData.longitude) || 0,
      totalRooms: parseInt(formData.totalRooms) || 0,
      floors: formData.floors,
      secretKey: formData.secretKey
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Hotel Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          required
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Logo URL</label>
        <input
          type="url"
          required
          value={formData.logo}
          onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="url"
          required
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Latitude</label>
          <input
            type="number"
            step="any"
            required
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Longitude</label>
          <input
            type="number"
            step="any"
            required
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Total Rooms</label>
        <input
          type="number"
          required
          min="1"
          value={formData.totalRooms}
          onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Floors</label>
        <input
          type="text"
          required
          value={formData.floors}
          onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="e.g., 1-10"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Secret Key</label>
        <input
          type="text"
          required
          value={formData.secretKey}
          onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add Hotel
      </button>
    </form>
  );
}