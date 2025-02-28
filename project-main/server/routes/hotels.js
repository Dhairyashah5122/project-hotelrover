import express from "express";
import Hotel from "../models/Hotel.js";
import { auth, checkRole } from "../middleware/auth.js";

const router = express.Router();

// Get all hotels
router.get("/", auth, async (req, res) => {
  try {
    const hotels = await Hotel.find().populate("createdBy", "name email");
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: "Error fetching hotels" });
  }
});

// Create hotel
router.post("/", auth, checkRole(["SuperAdmin", "Admin"]), async (req, res) => {
  try {
    const hotel = new Hotel({
      ...req.body,
      createdBy: req.user._id,
    });
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ error: "Error creating hotels" });
  }
});

// Update hotel
router.put(
  "/:id",
  auth,
  checkRole(["SuperAdmin", "Admin"]),
  async (req, res) => {
    try {
      const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!hotel) {
        return res.status(404).json({ error: "Hotel not found" });
      }
      res.json(hotel);
    } catch (error) {
      res.status(500).json({ error: "Error updating hotel" });
    }
  }
);

// Delete hotel
router.delete(
  "/:id",
  auth,
  checkRole(["SuperAdmin", "Admin"]),
  async (req, res) => {
    try {
      const hotel = await Hotel.findByIdAndDelete(req.params.id);
      if (!hotel) {
        return res.status(404).json({ error: "Hotel not found" });
      }
      res.json({ message: "Hotel deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting hotel" });
    }
  }
);

// Get single hotel
router.get("/:id", auth, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: "Error fetching hotel" });
  }
});

export default router;
