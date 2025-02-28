import express from "express";
import Room from "../models/Room.js";
import { auth, checkRole } from "../middleware/auth.js";

const router = express.Router();

// Get all rooms for a hotel
router.get("/hotel/:hotelId", auth, async (req, res) => {
  try {
    const rooms = await Room.find({ hotelId: req.params.hotelId }).populate(
      "assignedHousekeeper",
      "name email"
    );
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Error fetching rooms" });
  }
});

// Create room

router.post(
  "/room",
  auth,
  checkRole(["SuperAdmin", "Admin", "Manager"]),
  async (req, res) => {
    try {
      const {
        hotelId,
        number,
        type,
        floor,
        capacity,
        price,
        status,
        amenities,
      } = req.body;

      // Log the incoming data for debugging
      console.log("Received data:", req.body);

      // Check if required fields are missing
      if (
        !hotelId ||
        !number ||
        !type ||
        !floor ||
        !capacity ||
        !price ||
        !status
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create a new room object
      const room = new Room({
        hotelId,
        number,
        type,
        floor,
        capacity,
        price,
        status,
        amenities,
      });

      // Save the room to the database
      await room.save();

      // Respond with the created room
      res.status(201).json(room);
    } catch (error) {
      console.error("Error creating room:", error);

      // If it's a mongoose validation error, log and return specific details
      if (error instanceof mongoose.Error.ValidationError) {
        return res
          .status(400)
          .json({ error: "Validation failed", details: error.errors });
      }

      // Generic server error response
      res
        .status(500)
        .json({ error: "Error creating room", details: error.message });
    }
  }
);

// Update room
router.put(
  "/:id",
  auth,
  checkRole(["SuperAdmin", "Admin", "Manager"]),
  async (req, res) => {
    try {
      const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ error: "Error updating room" });
    }
  }
);

// Delete room
router.delete(
  "/:id",
  auth,
  checkRole(["SuperAdmin", "Admin", "Manager"]),
  async (req, res) => {
    try {
      const room = await Room.findByIdAndDelete(req.params.id);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
      res.json({ message: "Room deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting room" });
    }
  }
);

// Assign housekeeper to room
router.post(
  "/:id/assign",
  auth,
  checkRole(["SuperAdmin", "Admin", "Manager"]),
  async (req, res) => {
    try {
      const { housekeeperId } = req.body;
      const room = await Room.findByIdAndUpdate(
        req.params.id,
        { assignedHousekeeper: housekeeperId },
        { new: true }
      ).populate("assignedHousekeeper", "name email");

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      res.json(room);
    } catch (error) {
      res.status(500).json({ error: "Error assigning housekeeper" });
    }
  }
);

export default router;
