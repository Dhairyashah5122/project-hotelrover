import React, { useState, useEffect } from "react";
import { Hotel, Housekeeper, Assignment, Room } from "../types";
import { X, Plus, Users, Pencil, Trash2 } from "lucide-react";
import {
  assignmentService,
  housekeeperService,
  roomService,
} from "../services/api"; // Import the housekeeper service

interface HousekeeperManagementProps {
  hotel: Hotel;
  onClose: () => void;
  onAddHousekeeper: (
    hotelId: string,
    housekeeper: Omit<Housekeeper, "_id">
  ) => void;
  onUpdateHousekeeper: (hotelId: string, housekeeper: Housekeeper) => void;
  onDeleteHousekeeper: (hotelId: string, housekeeperId: string) => void;
  onAssignRoom: (assignment: Omit<Assignment, "id" | "createdAt">) => void;
}

export function HousekeeperManagement({
  hotel,
  onClose,
  onAddHousekeeper,
  onUpdateHousekeeper,
  onDeleteHousekeeper,
  onAssignRoom,
}: HousekeeperManagementProps) {
  const [editingHousekeeper, setEditingHousekeeper] =
    useState<Housekeeper | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]); // State for rooms

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedHousekeeper, setSelectedHousekeeper] =
    useState<Housekeeper | null>(null);
  const [housekeepers, setHousekeepers] = useState<Housekeeper[]>([]);

  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [newHousekeeper, setNewHousekeeper] = useState<
    Omit<Housekeeper, "_id">
  >({
    userId: crypto.randomUUID(),
    name: "",
    email: "",
    contactNumber: "",
    hotelId: hotel._id,
    isActive: true,
    password: "",
  });

  const fetchHousekeepers = async () => {
    try {
      const data = await housekeeperService.getById(hotel._id);
      setHousekeepers(data); // Store housekeepers data in the state
    } catch (error) {
      console.error("Error fetching housekeepers:", error);
    }
  };

  useEffect(() => {
    fetchHousekeepers();
  }, [hotel._id]); // Re-fetch when the hotel ID changes

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const fetchedRooms = await roomService.getByHotel(hotel._id);
        setRooms(fetchedRooms); // Set the fetched rooms into state
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, [hotel._id]);

  // Handle adding and editing housekeeper logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingHousekeeper) {
      // Update existing housekeeper
      const updatedHousekeeper = {
        ...editingHousekeeper,
        ...newHousekeeper,
      };
      try {
        await housekeeperService.update(
          editingHousekeeper._id,
          updatedHousekeeper
        );
        // Update the state to reflect the changes immediately
        setHousekeepers((prevHousekeepers) =>
          prevHousekeepers.map((housekeeper) =>
            housekeeper._id === updatedHousekeeper._id
              ? { ...housekeeper, ...updatedHousekeeper }
              : housekeeper
          )
        );
        onUpdateHousekeeper(hotel._id, updatedHousekeeper); // Update the parent state
        setEditingHousekeeper(null); // Reset the editing state
      } catch (error) {
        console.error("Error updating housekeeper", error);
      }
    } else {
      // Add new housekeeper
      try {
        const createdHousekeeper = await housekeeperService.create(
          newHousekeeper
        );
        // Update the state with the new housekeeper
        setHousekeepers((prevHousekeepers) => [
          ...prevHousekeepers,
          createdHousekeeper,
        ]);
        onAddHousekeeper(hotel._id, createdHousekeeper); // Update the parent state
      } catch (error) {
        console.error("Error adding housekeeper", error);
      }
    }

    // Reset the form state
    setNewHousekeeper({
      userId: crypto.randomUUID(),
      name: "",
      email: "",
      contactNumber: "",
      hotelId: hotel._id,
      isActive: true,
      password: "",
    });
  };
  const handleAssignRoom = async (e: React.FormEvent) => {
    console.log("First response inside handleAssignRoom:", e);

    e.preventDefault();

    if (selectedHousekeeper && selectedRoom && hotel._id) {
      const assignmentData = {
        _id: crypto.randomUUID(),
        housekeeperId: selectedHousekeeper._id,
        roomId: selectedRoom,
        hotelId: hotel._id, // Ensure hotelId is included
        task: "Room Cleaning",
        status: "Dirty",
        startTime: new Date().toISOString(),
        endTime: "", // Empty string for end time
        totalMinutes: 0,
      };

      try {
        console.log("Preparing to assign room with data:", assignmentData);

        // Call assignmentService.create to save the assignment to the database
        const createdAssignment = await assignmentService.create(
          assignmentData
        );

        console.log(
          "Room assignment successful! Created assignment:",
          createdAssignment
        );

        setShowAssignmentModal(false);
        setSelectedHousekeeper(null);
        setSelectedRoom("");
      } catch (error) {
        console.error("Error assigning room:", error);
      }
    } else {
      console.log("Please select both a housekeeper, room, and hotel.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Housekeeper Management - {hotel.name}
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
              {editingHousekeeper ? "Edit Housekeeper" : "Add New Housekeeper"}
            </h3>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Form Inputs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={newHousekeeper.name}
                  onChange={(e) =>
                    setNewHousekeeper({
                      ...newHousekeeper,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={newHousekeeper.email}
                  onChange={(e) =>
                    setNewHousekeeper({
                      ...newHousekeeper,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  required
                  value={newHousekeeper.contactNumber}
                  onChange={(e) =>
                    setNewHousekeeper({
                      ...newHousekeeper,
                      contactNumber: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={newHousekeeper.password}
                  onChange={(e) =>
                    setNewHousekeeper({
                      ...newHousekeeper,
                      password: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newHousekeeper.isActive ? "active" : "inactive"}
                  onChange={(e) =>
                    setNewHousekeeper({
                      ...newHousekeeper,
                      isActive: e.target.value === "active",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              {/* Submit Button */}

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  {editingHousekeeper
                    ? "Update Housekeeper"
                    : "Add Housekeeper"}
                </button>
              </div>
            </form>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Current Housekeepers
              </h3>
              <button
                onClick={() => setShowAssignmentModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Assign Room
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {housekeepers?.map((housekeeper) => (
                <div
                  key={housekeeper._id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{housekeeper.name}</h4>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        housekeeper.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {housekeeper.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{housekeeper.email}</p>
                  <p className="text-sm text-gray-600">
                    {housekeeper.contactNumber}
                  </p>
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingHousekeeper(housekeeper);
                        setNewHousekeeper({
                          userId: housekeeper.userId,
                          name: housekeeper.name,
                          email: housekeeper.email,
                          contactNumber: housekeeper.contactNumber,
                          hotelId: housekeeper.hotelId,
                          isActive: housekeeper.isActive,
                          password: housekeeper.password,
                        });
                      }}
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        onDeleteHousekeeper(hotel._id, housekeeper._id)
                      }
                      className="flex items-center text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Assign Room to Housekeeper</h3>
              <button
                onClick={() => setShowAssignmentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAssignRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Housekeeper
                </label>
                <select
                  value={selectedHousekeeper?._id}
                  onChange={(e) =>
                    setSelectedHousekeeper(
                      housekeepers.find(
                        (housekeeper) => housekeeper._id === e.target.value
                      ) || null
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Housekeeper</option>
                  {housekeepers.map((housekeeper) => (
                    <option key={housekeeper._id} value={housekeeper._id}>
                      {housekeeper.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room
                </label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Room</option>
                  {rooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      {room.number}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={!selectedHousekeeper || !selectedRoom}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Assign Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
