import express from "express";
import Housekeeper from "../models/Housekeeper.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
const router = express.Router();

// Create a new housekeeper (Add)
router.post("/", async (req, res) => {
  try {
    const { name, email, password, contactNumber, hotelId, isActive } =
      req.body;

    // Check if housekeeper already exists by email
    const existingHousekeeper = await Housekeeper.findOne({ email });
    if (existingHousekeeper) {
      return res
        .status(400)
        .json({ message: "Housekeeper with this email already exists." });
    }

    // Hash the password before saving (important for security)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save a new housekeeper
    const newHousekeeper = new Housekeeper({
      name,
      email,
      password: hashedPassword,
      contactNumber,
      hotelId,
      isActive,
      role: "Housekeeper",
    });

    await newHousekeeper.save();

    // Add the user to the users table (or collection)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      contactNumber,
      hotelId,
      isActive,
      role: "Housekeeper",
    });

    await newUser.save();

    return res.status(201).json(newHousekeeper);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get all housekeepers
router.get("/", async (req, res) => {
  try {
    const housekeepers = await Housekeeper.find().populate("hotelId");
    return res.status(200).json(housekeepers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get housekeepers by hotelId
router.get("/:hotelId", async (req, res) => {
  const { hotelId } = req.params; // Extract the hotelId from the URL parameters

  try {
    // Fetch housekeepers associated with the specified hotelId
    const housekeepers = await Housekeeper.find({ hotelId }).populate(
      "hotelId"
    );

    // If no housekeepers are found, return a 404
    if (!housekeepers || housekeepers.length === 0) {
      return res
        .status(404)
        .json({ message: "No housekeepers found for this hotel." });
    }

    // Return the list of housekeepers
    return res.status(200).json(housekeepers);
  } catch (error) {
    // Handle any errors that occur during the query
    return res.status(500).json({ message: error.message });
  }
});

// Get a single housekeeper by ID
router.get("/:id", async (req, res) => {
  try {
    const housekeeper = await Housekeeper.findById(req.params.id).populate(
      "hotelId"
    );
    if (!housekeeper) {
      return res.status(404).json({ message: "Housekeeper not found" });
    }
    return res.status(200).json(housekeeper);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Update housekeeper by ID
router.put("/:id", async (req, res) => {
  try {
    const { name, email, contactNumber, hotelId, isActive } = req.body;

    // Find the housekeeper and update
    const updatedHousekeeper = await Housekeeper.findByIdAndUpdate(
      req.params.id,
      { name, email, contactNumber, hotelId, isActive },
      { new: true }
    );

    if (!updatedHousekeeper) {
      return res.status(404).json({ message: "Housekeeper not found" });
    }

    return res.status(200).json(updatedHousekeeper);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Delete housekeeper by ID
router.delete("/:id", async (req, res) => {
  try {
    const housekeeper = await Housekeeper.findByIdAndDelete(req.params.id);

    if (!housekeeper) {
      return res.status(404).json({ message: "Housekeeper not found" });
    }

    return res
      .status(200)
      .json({ message: "Housekeeper deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
