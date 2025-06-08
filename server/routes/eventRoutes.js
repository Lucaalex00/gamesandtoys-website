import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getAllEvents,
  updateEvent,
  addUserToEvent,
  assignPoints,
  incrementPoints,
  decrementPoints,
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getAllEvents);
router.put("/:id", updateEvent);

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
