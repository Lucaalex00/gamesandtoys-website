import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getAllEvents,
  updateEvent,
  addUserToEvent,
  assignPoints,
  incrementPoints,
  decrementPoints,
  createEvent,
  deleteEvent
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getAllEvents);
router.post("/", protect, createEvent);
router.put("/:id", updateEvent);
router.delete('/:id', protect, deleteEvent);


// Rotte extra admin
router.post("/:eventId/add-user", addUserToEvent);
router.put("/assign-points", assignPoints);
router.put(
  "/:eventId/participants/:userId/increment",
  protect,
  incrementPoints
);
router.put(
  "/:eventId/participants/:userId/decrement",
  protect,
  decrementPoints
);

export default router;
