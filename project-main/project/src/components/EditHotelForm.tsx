import React, { useState, useEffect } from "react";
import { Hotel } from "../types";
import { X } from "lucide-react";

interface EditHotelFormProps {
  hotel: Hotel | undefined; // hotel can now be undefined
  onSubmit: (
    hotelId: string,
    updatedHotel: Omit<Hotel, "id" | "rooms" | "housekeepers">
  ) => void;
  onClose: () => void;
}

export function EditHotelForm({
  hotel,
  onSubmit,
  onClose,
}: EditHotelFormProps) {
  // State initialization: ensure hotel properties are available
  const [formData, setFormData] = useState({
    name: hotel?.name || "",
    address: hotel?.address || "", // added address field as it is in schema
    logo: hotel?.logo || "", // added logo field
    image: hotel?.image || "", // added image field
    latitude: hotel?.latitude?.toString() || "", // added latitude
    longitude: hotel?.longitude?.toString() || "", // added longitude
    totalRooms: hotel?.totalRooms?.toString() || "", // added totalRooms field
    floors: hotel?.floors || "", // added floors field
    secretKey: hotel?.secretKey || "", // added secretKey
  });

  useEffect(() => {
    if (hotel) {
      // Sync form data if hotel prop is updated
      setFormData({
        name: hotel.name,
        address: hotel.address,
        logo: hotel.logo,
        image: hotel.image,
        latitude: hotel.latitude?.toString() || "",
        longitude: hotel.longitude?.toString() || "",
        totalRooms: hotel.totalRooms?.toString() || "",
        floors: hotel.floors,
        secretKey: hotel.secretKey,
      });
    }
  }, [hotel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedHotel = {
      ...formData,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      totalRooms: Number(formData.totalRooms),
      createdAt: hotel?.createdAt || "",
    };

    if (hotel?._id) {
      onSubmit(
        hotel._id,
        updatedHotel as Omit<Hotel, "id" | "rooms" | "housekeepers">
      ); // submit with hotel _id
      onClose(); // Close the form after submission
    } else {
      console.error("Hotel ID (_id) is missing!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Hotel</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hotel Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hotel Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Latitude */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Latitude
            </label>
            <input
              type="number"
              required
              value={formData.latitude}
              onChange={(e) =>
                setFormData({ ...formData, latitude: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Longitude */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Longitude
            </label>
            <input
              type="number"
              required
              value={formData.longitude}
              onChange={(e) =>
                setFormData({ ...formData, longitude: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Total Rooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Rooms
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.totalRooms}
              onChange={(e) =>
                setFormData({ ...formData, totalRooms: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Floors */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Floors
            </label>
            <input
              type="number"
              required
              value={formData.floors}
              onChange={(e) =>
                setFormData({ ...formData, floors: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Secret Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Secret Key
            </label>
            <input
              type="text"
              required
              value={formData.secretKey}
              onChange={(e) =>
                setFormData({ ...formData, secretKey: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              required
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Submit and Cancel buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
