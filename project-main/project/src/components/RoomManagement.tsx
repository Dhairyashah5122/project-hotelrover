import React, { useState, useEffect } from "react";
import { Hotel, Room } from "../types";
import { X, Plus, Bed, Pencil, Trash2 } from "lucide-react";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { roomService } from "../services/api";

interface RoomManagementProps {
  hotel: Hotel;
  onClose: () => void;
  onAddRoom: (hotelId: string, room: Omit<Room, "id">) => void;
  onUpdateRoom: (
    hotelId: string,
    roomId: string,
    room: Omit<Room, "id">
  ) => void;
  onDeleteRoom: (hotelId: string, roomId: string) => void;
}

export function RoomManagement({
  hotel,
  onClose,
  onAddRoom,
  onUpdateRoom,
  onDeleteRoom,
}: RoomManagementProps) {
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<
    string | null
  >(null);
  const [newRoom, setNewRoom] = useState<Omit<Room, "_id">>({
    number: "",
    type: "Standard",
    floor: 1,
    capacity: 2,
    price: 0,
    status: "Available",
    amenities: [],
  });
  const [rooms, setRooms] = useState<Room[]>([]); // State for rooms
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Fetch rooms on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const fetchedRooms = await roomService.getByHotel(hotel._id);
        setRooms(fetchedRooms); // Set the fetched rooms into state
      } catch (error) {
        setError("Error fetching rooms");
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, [hotel._id]); // Only re-fetch when hotel._id changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const roomData = {
      ...newRoom,
      hotelId: hotel._id, // Assuming `hotel._id` is the hotel ID
    };

    try {
      if (editingRoom) {
        // Update room
        await roomService.update(editingRoom._id, roomData);
      } else {
        // Create new room
        await roomService.create(roomData);
      }

      // Reset form and fetch rooms again
      setEditingRoom(null);
      setNewRoom({
        number: "",
        type: "Standard",
        floor: 1,
        capacity: 2,
        price: 0,
        status: "Available",
        amenities: [],
      });

      // Refetch the rooms to reflect the changes
      const updatedRooms = await roomService.getByHotel(hotel._id);
      setRooms(updatedRooms);
    } catch (error) {
      console.error("Error submitting room:", error);
    }
  };

  const amenitiesList = [
    "WiFi",
    "TV",
    "Mini Bar",
    "Safe",
    "Balcony",
    "Ocean View",
    "Room Service",
    "Air Conditioning",
    "Coffee Maker",
    "Iron",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Room Management - {hotel.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              {editingRoom ? "Edit Room" : "Add New Room"}
            </h3>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Number
                </label>
                <input
                  type="text"
                  required
                  value={newRoom.number}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, number: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., 101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type
                </label>
                <select
                  value={newRoom.type}
                  onChange={(e) =>
                    setNewRoom({
                      ...newRoom,
                      type: e.target.value as Room["type"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Presidential">Presidential</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Floor
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newRoom.floor}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, floor: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newRoom.capacity}
                  onChange={(e) =>
                    setNewRoom({
                      ...newRoom,
                      capacity: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Night
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newRoom.price}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, price: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newRoom.status}
                  onChange={(e) =>
                    setNewRoom({
                      ...newRoom,
                      status: e.target.value as Room["status"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amenities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {amenitiesList.map((amenity) => (
                    <label key={amenity} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={newRoom.amenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewRoom({
                              ...newRoom,
                              amenities: [...newRoom.amenities, amenity],
                            });
                          } else {
                            setNewRoom({
                              ...newRoom,
                              amenities: newRoom.amenities.filter(
                                (a) => a !== amenity
                              ),
                            });
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {amenity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  {editingRoom ? "Update Room" : "Add Room"}
                </button>
                {editingRoom && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRoom(null);
                      setNewRoom({
                        number: "",
                        type: "Standard",
                        floor: 1,
                        capacity: 2,
                        price: 0,
                        status: "Available",
                        amenities: [],
                      });
                    }}
                    className="w-full mt-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Bed className="h-5 w-5 mr-2" />
              Current Rooms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <div
                    key={room.id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">Room {room.number}</h4>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          room.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : room.status === "Occupied"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {room.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Type: {room.type}</p>
                    <p className="text-sm text-gray-600">Floor: {room.floor}</p>
                    <p className="text-sm text-gray-600">
                      Capacity: {room.capacity} persons
                    </p>
                    <p className="text-sm text-gray-600">
                      Price: ${room.price}/night
                    </p>
                    {room.amenities.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Amenities:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {room.amenities.map((amenity) => (
                            <span
                              key={amenity}
                              className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingRoom(room);
                          setNewRoom({
                            number: room.number,
                            type: room.type,
                            floor: room.floor,
                            capacity: room.capacity,
                            price: room.price,
                            status: room.status,
                            amenities: room.amenities,
                          });
                        }}
                        className="flex items-center text-blue-600 hover:text-blue-700"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirmation(room.id)}
                        className="flex items-center text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No rooms available.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirmation && (
        <DeleteConfirmation
          title="Delete Room"
          message={`Are you sure you want to delete Room ${
            hotel.rooms?.find((r) => r.id === showDeleteConfirmation)?.number
          }? This action cannot be undone.`}
          onConfirm={() => {
            onDeleteRoom(hotel._id, showDeleteConfirmation);
            setShowDeleteConfirmation(null);
          }}
          onCancel={() => setShowDeleteConfirmation(null)}
        />
      )}
    </div>
  );
}
