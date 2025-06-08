import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import EventCard from "../components/EventCardComponent";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");

  const userCategory = useSelector((state) => state.auth.userCategory);
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Errore nel caricamento eventi:", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Errore nel caricamento utenti:", err);
      }
    };

    fetchEvents();
    fetchUsers();
  }, [token]);

  const handleUpdatePoints = async (eventId, userId, delta) => {
    try {
      const endpoint =
        delta > 0
          ? `/api/events/${eventId}/participants/${userId}/increment`
          : `/api/events/${eventId}/participants/${userId}/decrement`;

      const response = await axios.put(
        endpoint,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev._id === eventId
            ? {
                ...ev,
                participants: ev.participants.map((p) =>
                  p.userId === userId ? { ...p, points: response.data.points } : p
                ),
              }
            : ev
        )
      );
    } catch (err) {
      console.error("Errore nell'aggiornamento punti:", err);
      alert("Errore nell'aggiornamento punti");
    }
  };

  const handleSaveEdit = async (eventId, newDesc, participantIds) => {
    try {
      const response = await axios.put(
        `/api/events/${eventId}`,
        {
          desc: newDesc,
          participants: participantIds.map((userId) => ({ userId })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Ottieni l'evento aggiornato dalla risposta
      const updatedEvent = response.data.updatedEvent;
  
      // Ordina i partecipanti per punti decrescenti
      updatedEvent.participants.sort((a, b) => b.points - a.points);
  
      // Aggiorna gli eventi con l'evento ordinato
      setEvents((prevEvents) =>
        prevEvents.map((ev) => (ev._id === eventId ? updatedEvent : ev))
      );
  
      setSuccessMessage(response.data.message || "Evento aggiornato!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Errore nel salvataggio evento:", err);
      alert("Errore nel salvataggio evento");
    }
  };

  const filteredEvents = useMemo(() => {
    const now = new Date();
    const searchLower = search.toLowerCase();

    return events.filter((event) => {
      const eventDate = new Date(event.date);
      const eventNameLower = event.name.toLowerCase();

      const matchName = eventNameLower.startsWith(searchLower);

      if (filter === "future") return eventDate > now && matchName;
      if (filter === "past") return eventDate < now && matchName;
      return matchName;
    });
  }, [events, search, filter]);

  return (
    <div className="min-h-screen px-4 py-8 text-white bg-[#0d0d0d]">
      <h1 className="text-4xl font-extrabold text-center mb-10 tracking-wide">Eventi</h1>

      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-5 mb-10 px-3">
        <input
          type="text"
          placeholder="Cerca per nome (inizia con...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`p-3 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer focus:outline-none focus:ring-1 transition duration-400 ${
            filter === "future"
              ? "border-green-400"
              : filter === "past"
              ? "border-red-400"
              : "border-white"
          }`}
        >
          <option value="all">Tutti</option>
          <option value="future">Futuri</option>
          <option value="past">Passati</option>
        </select>
      </div>

      {userCategory === "admin" && successMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-4xl w-1/3 bg-green-600 text-white text-center py-2 rounded-lg shadow-lg">
          {successMessage}
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-8 px-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              users={users}
              userCategory={userCategory}
              token={token}
              onUpdatePoints={handleUpdatePoints}
              onSaveEdit={handleSaveEdit}
            />
          ))
        ) : (
          <p className="text-center text-gray-400 bg-gray-800 rounded-lg p-6">
            Nessun evento trovato.
          </p>
        )}
      </div>
    </div>
  );
}
