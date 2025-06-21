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
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  const userCategory = useSelector((state) => state.auth.userCategory);
  const token = localStorage.getItem("token");

  // Gestione immagine: unico input per nome file o URL
  const [inputValue, setInputValue] = useState(""); // nome file o URL
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const hiddenFileInputRef = useRef(null);
  const [imageReadyToConfirm, setImageReadyToConfirm] = useState(false);


  const imgRef = useRef(null);
  const nameRef = useRef();
  const dateRef = useRef();
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
        setErrorMessage("Errore nel caricamento dati");
        setTimeout(() => setErrorMessage(""), 4000);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);


  // Quando clicco sul bottone blu apro file picker
  const handleClickFilePicker = () => {
    hiddenFileInputRef.current.click();
  };

 const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(file);
    setInputValue(file.name);
    setImageReadyToConfirm(false); // reset stato conferma
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);

    if (imgRef.current) imgRef.current.value = "";
  }
};

  

  // Carico il file selezionato
  const handleUploadFile = async () => {
  if (!selectedFile) {
    setErrorMessage("Seleziona prima un file");
    setTimeout(() => setErrorMessage(""), 4000);
    return;
  }

  setUploading(true);
  setImageReadyToConfirm(false); // resetta stato

  const formData = new FormData();
  formData.append("image", selectedFile);

  try {
    const res = await axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    imgRef.current.value = res.data.imagePath;
    setPreviewUrl(res.data.imagePath);
    setSuccessMessage("Immagine caricata con successo!");
    setImageReadyToConfirm(true); // immagine pronta
    setTimeout(() => setSuccessMessage(""), 3000);
  } catch (error) {
    setErrorMessage("Errore nel caricamento immagine");
    setTimeout(() => setErrorMessage(""), 4000);
  } finally {
    setUploading(false);
  }
};


  // Usa link immagine da input
 const handleUseLink = () => {
  if (!inputValue.startsWith("http://") && !inputValue.startsWith("https://")) {
    setErrorMessage("Inserisci un link immagine valido che inizi con http:// o https://");
    setTimeout(() => setErrorMessage(""), 4000);
    return;
  }
  imgRef.current.value = inputValue;
  setPreviewUrl(inputValue);
  setSelectedFile(null); // resetto file selezionato
  setImageReadyToConfirm(false);
  setSuccessMessage("Link immagine impostato");
  setTimeout(() => setSuccessMessage(""), 3000);
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
      setErrorMessage("Errore nell'aggiornamento punti");
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  const handleSaveEdit = async (eventId, newDesc, participantIds, newImg, newDate) => {
    try {
      const response = await axios.put(
        `/api/events/${eventId}`,
        {
          desc: newDesc,
          participants: participantIds.map((userId) => ({ userId })),
          img: newImg,
          date: newDate,
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
      setErrorMessage("Errore nel salvataggio evento");
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents((prev) => prev.filter((ev) => ev._id !== eventId));
      setSuccessMessage("Evento eliminato con successo!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Errore nella cancellazione:", err);
      setErrorMessage("Errore nell'eliminazione dell'evento");
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  const handleAddEvent = async () => {
  setAddError("");
  setAdding(true);

  try {
    let imagePath = imgRef.current.value.trim();

    // Se c'è un file selezionato, fai l'upload prima di salvare evento
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const resUpload = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      imagePath = resUpload.data.imagePath;
    }

    const newEvent = {
      name: nameRef.current.value.trim(),
      date: dateRef.current.value,
      img: imagePath,
      desc: descRef.current.value.trim(),
    };

    if (!newEvent.name || !newEvent.date || !newEvent.img || !newEvent.desc) {
      setAddError("Compila tutti i campi");
      setAdding(false);
      return;
    }

    const res = await axios.post("/api/events", newEvent, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setEvents((prev) => [...prev, res.data.event]);

    // Reset form e stato immagini
    nameRef.current.value = "";
    dateRef.current.value = "";
    descRef.current.value = "";
    imgRef.current.value = "";
    setInputValue("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageReadyToConfirm(false);

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

      {/* Messaggi generali di errore e successo */}
      <div className="max-w-5xl mx-auto mb-6">
        {errorMessage && (
          <div className="p-3 bg-red-600 rounded text-white text-center">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="p-3 bg-green-600 rounded text-white text-center">{successMessage}</div>
        )}
      </div>

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

          {/* INPUT UNICO per nome file o URL immagine */}
          <input
            type="text"
            placeholder="Nome file o URL immagine"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full mb-3 p-2 rounded bg-gray-900 text-white"
          />

          {/* input file nascosto */}
          <input
            type="file"
            accept="image/*"
            ref={hiddenFileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

         <div className="flex gap-3 mb-4">
          {previewUrl && (
            <button
              onClick={() => {
                setInputValue("");
                setSelectedFile(null);
                setPreviewUrl(null);
                setImageReadyToConfirm(false);
                if (imgRef.current) imgRef.current.value = "";
              }}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Reset Immagine
            </button>
          )}

          <button
            onClick={handleClickFilePicker}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Seleziona file
          </button>

          <button
            onClick={handleUseLink}
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
                alt="Anteprima immagine"
                className="max-h-40 rounded-lg border border-gray-600"
              />
            </div>
          )}

          {/* input nascosto dove mettiamo il valore finale immagine */}
          <input type="hidden" ref={imgRef} />

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
          className="flex-grow p-2 rounded bg-gray-900 text-white"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 rounded bg-gray-900 text-white sm:max-w-xs"
        >
          <option value="all">Tutti</option>
          <option value="future">Futuri</option>
          <option value="past">Passati</option>
        </select>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 px-2">

        {filteredEvents.length === 0 && (
          <p className="text-center text-gray-400 col-span-full">Nessun evento trovato</p>
        )}
        {filteredEvents.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            users={users}
            onUpdatePoints={handleUpdatePoints}
            onSaveEdit={handleSaveEdit}
            onDeleteEvent={handleDeleteEvent}
            userCategory={userCategory}
          />
        ))}
      </div>
    </div>
  );
}
