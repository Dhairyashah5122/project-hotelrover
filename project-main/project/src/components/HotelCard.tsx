import React, { useState } from "react";
import {
  Star,
  MapPin,
  DollarSign,
  Bed,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { Hotel, Room } from "../types";
import { EditHotelForm } from "./EditHotelForm";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { RoomManagement } from "./RoomManagement";
import { HousekeeperManagement } from "./HousekeeperManagement";

interface HotelCardProps {
  hotel: Hotel;
  onUpdateHotel: (hotelId: string, hotel: Partial<Hotel>) => void;
  onDeleteHotel: (hotelId: string) => void;
  onManageHousekeepers: () => void;
  onAddRoom: (hotelId: string, room: Omit<Room, "id">) => void;
  onUpdateRoom: (
    hotelId: string,
    roomId: string,
    room: Omit<Room, "id">
  ) => void;
  onDeleteRoom: (hotelId: string, roomId: string) => void;
}

export function HotelCard({
  hotel,
  onUpdateHotel,
  onDeleteHotel,
  onManageHousekeepers,
  onAddRoom,
  onUpdateRoom,
  onDeleteRoom,
}: HotelCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showRoomManagement, setShowRoomManagement] = useState(false);
  const [showHousekeeperManagement, setShowHousekeeperManagement] =
    useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditForm(true);
              }}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <Pencil className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirmation(true);
              }}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{hotel.address}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>Total Rooms: {hotel.totalRooms}</span>
          </div>
          <div
            className="flex items-center text-gray-600 mb-2 cursor-pointer hover:text-blue-600"
            onClick={() => setShowRoomManagement(true)}
          >
            <Bed className="w-4 h-4 mr-1" />
            <span>
              {(hotel.rooms?.length || 0) > 0
                ? `${hotel.rooms?.length} rooms`
                : "No rooms available"}
            </span>
          </div>

          <div className="flex items-center text-gray-600 mb-4">
            <Users className="w-4 h-4 mr-1" />
            <span>{hotel.housekeepers?.length || 0} housekeepers</span>
          </div>
          <button
            onClick={() => setShowHousekeeperManagement(true)} // Open the housekeeper management modal
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Manage Housekeepers
          </button>
        </div>
      </div>

      {showEditForm && (
        <EditHotelForm
          hotel={hotel}
          onSubmit={(hotelId, updatedHotel) => {
            onUpdateHotel(hotelId, updatedHotel);
            setShowEditForm(false);
          }}
          onClose={() => setShowEditForm(false)}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmation
          title="Delete Hotel"
          message={`Are you sure you want to delete ${hotel.name}? This action cannot be undone.`}
          onConfirm={() => {
            onDeleteHotel(hotel._id);
            setShowDeleteConfirmation(false);
          }}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}

      {showRoomManagement && (
        <RoomManagement
          hotel={hotel}
          onClose={() => setShowRoomManagement(false)}
          onAddRoom={onAddRoom}
          onUpdateRoom={onUpdateRoom}
          onDeleteRoom={onDeleteRoom}
        />
      )}

      {showHousekeeperManagement && (
        <HousekeeperManagement
          hotel={hotel}
          onClose={() => setShowHousekeeperManagement(false)} // Close the housekeeper modal
          onAddHousekeeper={() => {}}
          onUpdateHousekeeper={() => {}}
          onDeleteHousekeeper={() => {}}
          onAssignRoom={() => {}}
        />
      )}
    </>
  );
}
