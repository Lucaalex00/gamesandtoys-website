import express from "express";
import User from "../models/userModel.js"; // importa il modello User
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/users => ritorna la lista di tutti gli utenti
router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find({}, "_id name email"); // scegli i campi da mostrare
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Errore interno" });
  }
});

export default router;
