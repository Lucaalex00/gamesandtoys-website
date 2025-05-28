import Event from "../models/eventModel.js";
import mongoose from "mongoose";

// GET /api/events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero degli eventi" });
  }
};

// PUT /api/events/:id
export const updateEvent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID non valido" });
  }

  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Evento non trovato" });

    // aggiorna la descrizione se fornita
    if (req.body.desc) {
      event.desc = req.body.desc;
    }

    // aggiorna i partecipanti se forniti
    if (Array.isArray(req.body.participants)) {
      // inizializza tutti con 0 punti se non già presente
      event.participants = req.body.participants.map((p) => ({
        userId: p.userId,
        points: 0,
      }));
    }

    const updatedEvent = await event.save();
    res.json({ message: "Evento aggiornato con successo!", updatedEvent });
  } catch (error) {
    console.error("Errore aggiornamento evento:", error);
    res.status(500).json({ message: "Errore nell'aggiornamento dell'evento" });
  }
};

// POST /api/events/:eventId/add-user
export const addUserToEvent = async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Evento non trovato" });

    if (!event.participants) event.participants = [];

    const exists = event.participants.find(
      (p) => p.userId.toString() === userId
    );
    if (exists) return res.status(400).json({ message: "Utente già iscritto" });

    event.participants.push({ userId, points: 0 });
    await event.save();

    res.json({ message: "Utente aggiunto all'evento" });
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiunta dell'utente" });
  }
};

// PUT /api/events/assign-points
export const assignPoints = async (req, res) => {
  const { eventId, userId, points } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Evento non trovato" });

    const participant = event.participants.find(
      (p) => p.userId.toString() === userId
    );
    if (!participant)
      return res.status(400).json({ message: "Partecipante non trovato" });

    participant.points = points;
    await event.save();

    res.json({ message: "Punti aggiornati con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore nell'assegnazione dei punti" });
  }
};
// PUT /api/events/:eventId/participants/:userId/increment
export const incrementPoints = async (req, res) => {
  const { eventId, userId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Evento non trovato" });

    const participant = event.participants.find(
      (p) => p.userId.toString() === userId
    );
    if (!participant)
      return res.status(400).json({ message: "Partecipante non trovato" });

    participant.points = (participant.points || 0) + 1;
    await event.save();

    res.json({ message: "Punti incrementati", points: participant.points });
  } catch (error) {
    res.status(500).json({ message: "Errore nell'incremento dei punti" });
  }
};

// PUT /api/events/:eventId/participants/:userId/decrement
export const decrementPoints = async (req, res) => {
  const { eventId, userId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Evento non trovato" });

    const participant = event.participants.find(
      (p) => p.userId.toString() === userId
    );
    if (!participant)
      return res.status(400).json({ message: "Partecipante non trovato" });

    participant.points = Math.max(0, (participant.points || 0) - 1); // evita punti negativi
    await event.save();

    res.json({ message: "Punti decrementati", points: participant.points });
  } catch (error) {
    res.status(500).json({ message: "Errore nel decremento dei punti" });
  }
};
