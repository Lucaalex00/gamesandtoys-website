import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import eventsRoutes from "./routes/eventRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

// Per risolvere __dirname in moduli ES (import/export)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// In produzione, sostituisci con il dominio frontend reale, es:
// origin: "https://tuo-frontend.onrender.com"
const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? "https://gamesandtoys-website.onrender.com"
    : "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(express.json());

// Rotte API
app.use("/api/events", eventsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Serve il frontend statico (dalla build Vite nella cartella dist)
app.use(express.static(path.join(__dirname, "dist")));

// Per tutte le altre rotte, serve index.html (SPA fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Connessione DB + Avvio server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server avviato su porta ${PORT}`));
  })
  .catch((err) => console.error("Errore DB:", err));
