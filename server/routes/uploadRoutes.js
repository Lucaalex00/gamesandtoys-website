import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura la cartella e il nome del file
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Percorso assoluto verso src/public/uploads
    const dir = path.join(__dirname, "..", "..", "src", "public", "uploads");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    const uploadDir = path.join(__dirname, "..", "..", "src", "public", "uploads");
    const targetPath = path.join(uploadDir, file.originalname);

    // Se il file esiste già, usiamo lo stesso nome senza ricaricarlo
    if (fs.existsSync(targetPath)) {
      req.existingFile = true; // lo usiamo più avanti nella POST
      cb(null, file.originalname);
    } else {
      req.existingFile = false;
      cb(null, file.originalname); // salva col nome originale
    }
  }

});

// GET /api/upload - Lista di tutti i file già presenti nella cartella uploads
router.get("/", (req, res) => {
  const uploadsPath = path.join(__dirname, "..", "..", "src", "public", "uploads");

  try {
    const files = fs.readdirSync(uploadsPath);
    
    // Opzionale: filtra solo immagini comuni
    const imageFiles = files.filter(file => /\.(png|jpe?g|gif|webp|bmp)$/i.test(file));

    // Mappa i file in URL pubblici (es: /uploads/nome.jpg)
    const fileUrls = imageFiles.map(filename => `/uploads/${filename}`);

    res.status(200).json(fileUrls);
  } catch (err) {
    console.error("Errore durante la lettura della cartella uploads:", err);
    res.status(500).json({ message: "Errore nella lettura dei file" });
  }
});

const upload = multer({ storage });

// POST /api/upload
router.post("/", upload.single("image"), (req, res) => {
  if (req.existingFile) {
    // Il file era già presente, non è stato sovrascritto
    const imagePath = `/uploads/${req.file.originalname}`;
    return res.status(200).json({ imagePath, reused: true });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Nessun file caricato" });
  }

  // File appena caricato
  const imagePath = `/uploads/${req.file.filename}`;
  res.status(201).json({ imagePath, reused: false });
});


export default router;
