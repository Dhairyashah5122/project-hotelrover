import express from "express";
import Assignment from "../models/Assignment.js";
import { auth } from "../middleware/auth.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import Housekeeper from "../models/Housekeeper.js";

const router = express.Router();

// Get assignments for a housekeeper
router.get("/housekeeper/:housekeeperId", auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({
      housekeeperId: req.params.housekeeperId,
    })
      .populate("roomId")
      .populate("hotelId", "name");
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching assignments" });
  }
});

// Create assignment
router.post("/", auth, async (req, res) => {
  try {
    const {
      housekeeperId,
      roomId,
      hotelId,
      task,
      status,
      startTime,
      endTime,
      totalMinutes,
    } = req.body;

    // Validate required fields
    if (!housekeeperId || !roomId || !hotelId || !task) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verify that the housekeeper, room, and hotel exist
    const housekeeper = await Housekeeper.findById(housekeeperId);
    console.log("housekeeper", housekeeperId, housekeeper);
    if (!housekeeper) {
      return res.status(404).json({ error: "Housekeeper not found" });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    // Create the assignment
    const assignment = new Assignment({
      housekeeperId,
      roomId,
      hotelId,
      task,
      status: status || "Dirty", // Default to 'Dirty' if no status provided
      startTime: startTime || new Date().toISOString(), // Use current time if no startTime provided
      endTime: endTime || "",
      totalMinutes: totalMinutes || 0,
    });

    // Save the assignment to the database
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ error: "Error creating assignment" });
  }
});

// Update assignment status
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status, endTime, totalMinutes } = req.body;
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(endTime && { endTime }),
        ...(totalMinutes && { totalMinutes }),
      },
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: "Error updating assignment status" });
  }
});

// Start cleaning
router.put("/:id/start", auth, async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      {
        status: "In Progress",
        startTime: new Date(),
      },
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: "Error starting assignment" });
  }
});

// Complete cleaning
router.put("/:id/complete", auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    const endTime = new Date();
    const totalMinutes = Math.round(
      (endTime.getTime() - new Date(assignment.startTime).getTime()) / 1000 / 60
    );

    assignment.status = "Clean";
    assignment.endTime = endTime;
    assignment.totalMinutes = totalMinutes;

    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: "Error completing assignment" });
  }
});

// Get assignment reports
router.get("/reports", auth, async (req, res) => {
  try {
    const { startDate, endDate, housekeeperId } = req.query;

    const query = {
      status: "Clean",
      ...(housekeeperId && { housekeeperId }),
      ...(startDate &&
        endDate && {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        }),
    };

    const assignments = await Assignment.find(query)
      .populate("housekeeperId", "name")
      .populate("roomId")
      .populate("hotelId", "name");

    const reports = assignments.reduce((acc, curr) => {
      const housekeeperId = curr.housekeeperId._id.toString();

      if (!acc[housekeeperId]) {
        acc[housekeeperId] = {
          housekeeper: curr.housekeeperId,
          totalRooms: 0,
          totalTime: 0,
          averageTime: 0,
        };
      }

      acc[housekeeperId].totalRooms += 1;
      acc[housekeeperId].totalTime += curr.totalMinutes;
      acc[housekeeperId].averageTime = Math.round(
        acc[housekeeperId].totalTime / acc[housekeeperId].totalRooms
      );

      return acc;
    }, {});

    res.json(Object.values(reports));
  } catch (error) {
    res.status(500).json({ error: "Error generating reports" });
  }
});

router.get("/assignments", auth, async (req, res) => {
  try {
    const { housekeeperId, status, startDate, endDate } = req.query;

    // Build the query object
    const query = {
      ...(housekeeperId && { housekeeperId }),
      ...(status && { status }),
      ...(startDate &&
        endDate && {
          startTime: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        }),
    };

    // Find assignments with populated data
    const assignments = await Assignment.find(query)
      .populate("housekeeperId", "name email") // Populate housekeeper details (name and email)
      .populate("roomId", "roomNumber floor") // Populate room details (room number and floor)
      .populate("hotelId", "name location") // Populate hotel details (name and location)
      .select(
        "housekeeperId roomId hotelId task status startTime endTime totalMinutes"
      ); // Only select relevant fields

    if (!assignments.length) {
      return res.status(404).json({ message: "No assignments found" });
    }

    res.json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ error: "Error fetching assignments" });
  }
});

export default router;
