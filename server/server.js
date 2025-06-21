import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import eventsRoutes from "./routes/eventRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"

import path from "path";
import { fileURLToPath } from "url";

// Per risolvere __dirname in moduli ES (import/export)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// In produzione, sostituisci con il dominio frontend reale, es:
// origin: "https://tuo-frontend.onrender.com"
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigin = isProduction
  ? "https://gamesandtoys-website.onrender.com" // il tuo dominio in produzione
  : "http://localhost:5173";

console.log("Allowed origin:", allowedOrigin);
app.use(
  cors({
    origin: allowedOrigin,
  })
);

app.use(express.json());
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("NODE_ENV:", process.env.NODE_ENV);
// Rotte API
console.log("Carico /api/events");
app.use("/api/events", eventsRoutes);

console.log("Carico /api/auth");
app.use("/api/auth", authRoutes);

console.log("Carico /api/users");
app.use("/api/users", userRoutes);

// Serve i file statici dalla cartella 'public/uploads'
console.log("Carico /uploads");
app.use("/uploads", express.static(path.join(__dirname, "..", "src", "public", "uploads")));

// Aggiungi la rotta API per gestire l'upload dei file
console.log("Carico /api/upload");
app.use("/api/upload", uploadRoutes);

console.log("Carico static frontend...");

// Serve il frontend statico (dalla build Vite nella cartella dist)
app.use(express.static(path.join(__dirname, "..", "dist")));

app.get("*", (req, res) => {
  console.log("Serving index.html for route", req.url);
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
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
