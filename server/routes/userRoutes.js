import express from "express";
import User from "../models/userModel.js"; // importa il modello User
import protect from "../middleware/authMiddleware.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// GET /api/users => ritorna la lista di tutti gli utenti
router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find({}, "_id name email category credito"); // scegli i campi da mostrare
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Errore interno" });
  }
});

// PUT /api/users/:id => aggiorna nome, email, categoria e credito (solo admin)
router.put("/:id", protect, async (req, res) => {
  try {
    if (req.user.category !== "admin") {
      return res.status(403).json({ message: "Accesso negato: solo admin" });
    }

    const { id } = req.params;
    const { name, email, category, credito } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Utente non trovato" });

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (category !== undefined) user.category = category;
    if (credito !== undefined) user.credito = credito;

    await user.save();
    res.status(200).json({ message: "Utente aggiornato" });
  } catch (err) {
    console.error("Errore aggiornamento utente:", err);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

// PUT /api/users/:id/reset-password => Password (solo admin)
router.put("/:id/reset-password", protect, async (req, res) => {
  try {
    if (req.user.category !== "admin") {
      return res.status(403).json({ message: "Accesso negato: solo admin" });
    }

    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 1) {
      return res.status(400).json({ message: "Password non valida" });
    }

    console.log("Password ricevuta per reset:", newPassword);

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Utente non trovato" });

    user.password = newPassword; // assegna la password in chiaro
    const savedUser = await user.save(); // il pre-save la hasherà automaticamente

    console.log("Utente salvato con password hashata:", savedUser.password);

    res.status(200).json({ message: "Password aggiornata con successo" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

export default router;
