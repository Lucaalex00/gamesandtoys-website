import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import eventsRoutes from "./routes/eventRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // o l'url del frontend
    credentials: true, // se usi cookie, altrimenti puoi togliere
  })
);
app.use(express.json());

// Rotte
app.use("/api/events", eventsRoutes);
app.use("/api/auth", authRoutes);

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
