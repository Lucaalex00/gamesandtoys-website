import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import EventCard from "../components/EventCardComponent";
import SpinnerComponent from "../components/SpinnerComponent";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  const userCategory = useSelector((state) => state.auth.userCategory);
  const token = localStorage.getItem("token");

  //IMGs MANAGEMENT
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const nameRef = useRef();
  const dateRef = useRef();
  const imgRef = useRef();
  const descRef = useRef();

  useEffect(() => {
    async function fetchData() {
      try {
        const [resEvents, resUsers] = await Promise.all([
          axios.get("/api/events"),
          axios.get("/api/users", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setEvents(resEvents.data);
        setUsers(resUsers.data);
      } catch (err) {
        console.error("Errore nel caricamento dati:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  // Quando l’admin seleziona un file
const handleImageSelect = (e) => {
  setSelectedFile(e.target.files[0]);
};

// Quando clicca "Carica Immagine"
const handleUploadImage = async () => {
  if (!selectedFile) return;
  setUploading(true);
  const formData = new FormData();
  formData.append("image", selectedFile);

  try {
    const res = await axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    // path restituito es. "/events/1592837643-miofile.jpg"
    imgRef.current.value = res.data.path;
    setSuccessMessage("Immagine caricata con successo!");
    setTimeout(() => setSuccessMessage(""), 3000);
  } catch (err) {
    console.error("Errore nell'upload:", err);
    setAddError("Errore nel caricamento immagine");
  } finally {
    setUploading(false);
  }
};

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

  const handleSaveEdit = async (eventId, newDesc, participantIds, newImg) => {
  try {
    const response = await axios.put(
      `/api/events/${eventId}`,
      {
        desc: newDesc,
        participants: participantIds.map((userId) => ({ userId })),
        img: newImg, // aggiungi immagine qui
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const updatedEvent = response.data.updatedEvent;
    updatedEvent.participants.sort((a, b) => b.points - a.points);

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

  // Nuova funzione per eliminare un evento
  const handleDeleteEvent = async (eventId) => {
    const confirmDelete = window.confirm("Sei sicuro di voler eliminare questo evento?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents((prev) => prev.filter((ev) => ev._id !== eventId));
      setSuccessMessage("Evento eliminato con successo!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Errore nella cancellazione:", err);
      alert("Errore nell'eliminazione dell'evento");
    }
  };

  const handleAddEvent = async () => {
    setAddError("");
    setAdding(true);

    const newEvent = {
      name: nameRef.current.value.trim(),
      date: dateRef.current.value,
      img: imgRef.current.value.trim(),
      desc: descRef.current.value.trim(),
    };

    if (!newEvent.name || !newEvent.date || !newEvent.img || !newEvent.desc) {
      setAddError("Compila tutti i campi");
      setAdding(false);
      return;
    }

    try {
      const res = await axios.post("/api/events", newEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents((prev) => [...prev, res.data.event]);

      // Reset form
      nameRef.current.value = "";
      dateRef.current.value = "";
      imgRef.current.value = "";
      descRef.current.value = "";

      setSuccessMessage("Evento creato con successo!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Errore nell'aggiunta evento:", err);
      setAddError("Errore nel creare evento");
    } finally {
      setAdding(false);
    }
  };

  const now = new Date();
  const searchLower = search.toLowerCase();

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const eventNameLower = event.name.toLowerCase();

    const matchName = eventNameLower.startsWith(searchLower);

    if (filter === "future") return eventDate > now && matchName;
    if (filter === "past") return eventDate < now && matchName;
    return matchName;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
        <SpinnerComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 text-white bg-[#0d0d0d]">
      <h1 className="text-4xl font-extrabold text-center mb-10 tracking-wide">Eventi</h1>

      {userCategory === "admin" && (
        <div className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-lg mb-10">
          <h2 className="text-2xl font-semibold mb-4">Aggiungi nuovo evento</h2>
          <input
            ref={nameRef}
            placeholder="Nome evento"
            className="w-full mb-3 p-2 rounded bg-gray-900 text-white"
          />
          <input
            ref={dateRef}
            type="date"
            className="w-full mb-3 p-2 rounded bg-gray-900 text-white"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="w-full mb-3 p-2 rounded bg-gray-900 text-white"
          />
          <button
            onClick={handleUploadImage}
            disabled={!selectedFile || uploading}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition mb-3"
          >
            {uploading ? "Caricamento..." : "Carica Immagine"}
          </button>

              {/* --- LINK ALTERNATIVO --- */}
              <div className="flex gap-2 items-center mb-3">
                <input
                  type="text"
                  placeholder="oppure incolla un link immagine"
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-grow p-2 rounded bg-gray-900 text-white"
                />
                <button
                  onClick={() => {
                    if (!imageUrlInput.startsWith("http")) {
                      alert("Inserisci un link valido");
                      return;
                    }
                    imgRef.current.value = imageUrlInput;
                    setPreviewUrl(imageUrlInput);
                  }}
                  className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                  Usa link
                </button>
              </div>

              {previewUrl && (
                <div className="mb-3">
                  <p className="text-sm text-gray-400 mb-1">Anteprima:</p>
                  <img
                    src={previewUrl}
                    alt="Anteprima"
                    className="max-h-40 rounded-lg border border-gray-600"
                  />
                </div>
              )}

          {/* Campo testo (popolato automaticamente con il path) */}
          <input
            ref={imgRef}
            placeholder="URL/path immagine"
            className="w-full mb-3 p-2 rounded bg-gray-900 text-white"
          />
          <textarea
            ref={descRef}
            placeholder="Descrizione"
            className="w-full mb-3 p-2 rounded bg-gray-900 text-white"
            rows={3}
          />
          {addError && <p className="text-red-500 mb-2">{addError}</p>}
          <button
            onClick={handleAddEvent}
            disabled={adding}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
          >
            {adding ? "Aggiungo..." : "Aggiungi Evento"}
          </button>
        </div>
      )}

      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-5 mb-10 px-3">
        <input
          type="text"
          placeholder="Cerca per nome (inizia con...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
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
              onDeleteEvent={handleDeleteEvent} 
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
