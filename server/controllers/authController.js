import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Funzione per generare JWT
const generateToken = (id, category, name, credito, note) => {
  return jwt.sign({ id, category, name, credito, note }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Funzione per ottenere i dati dell'utente
export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore nel recupero dei dati utente" });
  }
};

// REGISTRAZIONE
export const registerUser = async (req, res) => {
  const { email, password, name, credito, note } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Utente già registrato" });
    }

    const user = await User.create({
      email,
      password,
      name,
      category: "user",
      credito,
      note
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      category: user.category,
      credito: user.credito,
      note: user.note,
      token: generateToken(user._id, user.category, user.name, user.credito, user.note),
    });
  } catch (err) {
    console.error("Errore registrazione:", err);
    res.status(500).json({ message: "Errore server" });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Credenziali errate" });
    }

    res.status(200).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      category: user.category,
      credito: user.credito,
      note: user.note,
      token: generateToken(user._id, user.category, user.name, user.credito, user.note),
    });
  } catch (err) {
    console.error("Errore login:", err);
    res.status(500).json({ message: "Errore server" });
  }
};
