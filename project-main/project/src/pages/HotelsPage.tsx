import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Hotel, Room, Housekeeper, Assignment } from "../types";
import { HotelCard } from "../components/HotelCard";
import { AddHotelForm } from "../components/AddHotelForm";
import { HousekeeperManagement } from "../components/HousekeeperManagement";
import { hotelService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export function HotelsPage() {
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [showHousekeeperManagement, setShowHousekeeperManagement] = useState<
    string | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchHotels = async () => {
      try {
        setLoading(true);
        const data = await hotelService.getAll();
        if (isMounted) {
          setHotels(data);
          console.log("first data", hotels);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to fetch hotels");
          console.error("Error fetching hotels:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHotels();

    // Cleanup on unmount
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const data = await hotelService.getAll();
      setHotels(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch hotels");
      console.error("Error fetching hotels:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHotel = async (hotelData: Omit<Hotel, "id" | "createdAt">) => {
    try {
      const newHotel = await hotelService.create(hotelData);
      setHotels([...hotels, newHotel]);
      setShowAddHotel(false);
    } catch (err) {
      console.error("Error adding hotel:", err);
      // Handle error (show notification, etc.)
    }
  };

  const handleUpdateHotel = async (
    hotelId: string,
    updatedHotel: Partial<Hotel>
  ) => {
    try {
      const updated = await hotelService.update(hotelId, updatedHotel);
      setHotels(
        hotels.map((hotel) => (hotel.id === hotelId ? updated : hotel))
      );
    } catch (err) {
      console.error("Error updating hotel:", err);
      // Handle error
    }
  };

  const handleDeleteHotel = async (hotelId: string) => {
    try {
      await hotelService.delete(hotelId);
      setHotels(hotels.filter((hotel) => hotel.id !== hotelId));
    } catch (err) {
      console.error("Error deleting hotel:", err);
      // Handle error
    }
  };

  const handleAddRoom = async (
    hotelId: string,
    roomData: Omit<Room, "id" | "createdAt">
  ) => {
    try {
      // Create the complete roomData object by adding hotelId to it
      const roomDataWithHotelId = { ...roomData, hotelId };

      // Call the service to create a new room under a specific hotel
      const newRoom = await hotelService.create(hotelId, roomDataWithHotelId);

      console.log("newRoom:", newRoom);

      if (newRoom) {
        setHotels((prevHotels) =>
          prevHotels.map((hotel) =>
            hotel._id === hotelId
              ? {
                  ...hotel,
                  rooms: [...(hotel.rooms ?? []), newRoom], // Use [] if hotel.rooms is undefined
                }
              : hotel
          )
        );
      } else {
        throw new Error("Failed to add room");
      }
    } catch (err) {
      console.error("Error adding room:", err);
      // Optionally show an error to the user
    }
  };

  const canManageHotels = user?.role === "SuperAdmin" || user?.role === "Admin";

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">{error}</p>
        <button
          onClick={fetchHotels}
          className="mt-2 text-red-600 hover:text-red-800 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Hotels</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search hotels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {canManageHotels && (
            <button
              onClick={() => setShowAddHotel(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Hotel
            </button>
          )}
        </div>
      </div>

      {showAddHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add New Hotel</h2>
            <AddHotelForm onSubmit={handleAddHotel} />
            <button
              onClick={() => setShowAddHotel(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showHousekeeperManagement && (
        <HousekeeperManagement
          hotel={hotels.find((h) => h.id === showHousekeeperManagement)!}
          onClose={() => setShowHousekeeperManagement(null)}
          onAddHousekeeper={handleAddHousekeeper}
          onUpdateHousekeeper={handleUpdateHousekeeper}
          onDeleteHousekeeper={handleDeleteHousekeeper}
          onAssignRoom={handleAssignRoom}
        />
      )}

      {filteredHotels.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hotels found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onUpdateHotel={handleUpdateHotel}
              onDeleteHotel={handleDeleteHotel}
              onManageHousekeepers={() =>
                setShowHousekeeperManagement(hotel.id)
              }
              onAddRoom={handleAddRoom}
              // onUpdateRoom={handleUpdateRoom}
              // onDeleteRoom={handleDeleteRoom}
            />
          ))}
        </div>
      )}
    </div>
  );
}
