import express from "express";
import Event from "../models/eventModel.js";

const router = express.Router();

// GET /api/events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero degli eventi" });
  }
});

export default router;
