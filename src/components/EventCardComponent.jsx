import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { linkify } from "../utils/linkify";

export default function EventCard({
  event,
  users,
  userCategory,
  token,
  onUpdatePoints,
  onSaveEdit,
  onDeleteEvent,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(event.desc || "");
  const [editedImg, setEditedImg] = useState(event.img || "");
  const [editedDate, setEditedDate] = useState(event.date ? event.date.slice(0, 10) : "");
  const [selectedParticipants, setSelectedParticipants] = useState(
    event.participants?.map((p) => p.userId) || []
  );

  //IMGs
  const [imageMode, setImageMode] = useState("upload"); // 'upload', 'url', 'existing'
  const [availableImages, setAvailableImages] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [existingImages, setExistingImages] = useState([]);


  useEffect(() => {
  if (imageMode === "existing") {
    async function fetchExistingImages() {
      try {
        const res = await fetch("/api/upload");
        const data = await res.json();
        setExistingImages(data); // data è un array di path es: ["/uploads/img1.jpg"]
      } catch (err) {
        console.error("Errore nel caricare le immagini:", err);
      }
    }

    fetchExistingImages();
  }
}, [imageMode]);

  const toggleParticipant = (userId) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Errore durante l'upload");

      setEditedImg(data.imagePath); // salva path come /uploads/filename.jpg
    } catch (error) {
      console.error("Errore upload immagine:", error);
      alert("Errore durante l'upload immagine.");
    }
  };

  const handleSaveClick = () => {
    let fullImgPath = editedImg;
    if (!editedImg.startsWith("http") && !editedImg.startsWith("/uploads/")) {
      fullImgPath = "/uploads/" + editedImg;
    }

    onSaveEdit(event._id, editedDescription, selectedParticipants, fullImgPath, editedDate);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedDescription(event.desc || "");
    setEditedImg(event.img || "");
    setEditedDate(event.date ? event.date.slice(0, 10) : "");
    setSelectedParticipants(event.participants?.map((p) => p.userId) || []);
    setImageMode("upload");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-800 p-6 rounded-xl border-4 border-gray-700 shadow-lg relative max-w-full"
    >
      {/* Titolo evento */}
      <h2 className="text-2xl font-semibold mb-2 break-words">{event.name}</h2>

      {/* Data evento */}
      <p className="text-sm text-gray-300 mb-4">
        <time className="font-mono text-orange-400">
          {new Date(event.date).toLocaleDateString("it-IT", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }).toUpperCase()}
        </time>
      </p>

      {!isEditing ? (
        <>
          {/* Descrizione evento */}
          <p className="text-sm text-gray-300 whitespace-pre-wrap break-words mb-4">
            {linkify(event.desc)}
          </p>

          {/* Partecipanti */}
          <div className="mb-4">
            <h3 className="font-bold text-orange-400 mb-2">Partecipanti:</h3>
            {event.participants?.length > 0 ? (
              event.participants.map((p) => {
                const user = users.find((u) => u._id === p.userId);
                if (!user) return null;

                return (
                  <div
                    key={p.userId}
                    className="bg-gray-700 p-3 rounded-md mb-2 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {userCategory === "admin" && (
                        <button onClick={() => onUpdatePoints(event._id, p.userId, -1)} className="bg-red-600 px-2 rounded">-1</button>
                      )}
                      <span className="font-mono">{p.points ?? 0}</span>
                      {userCategory === "admin" && (
                        <button onClick={() => onUpdatePoints(event._id, p.userId, +1)} className="bg-green-600 px-2 rounded">+1</button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="italic text-gray-400">Nessun partecipante</p>
            )}
          </div>

          {/* Pulsante modifica */}
          {userCategory === "admin" && (
            <button onClick={() => setIsEditing(true)} className="bg-orange-500 px-4 py-2 rounded">
              Modifica Evento
            </button>
          )}
        </>
      ) : (
        <>
          {/* Data */}
          <label className="block mb-1 text-orange-400">Data evento:</label>
          <input
            type="date"
            value={editedDate}
            onChange={(e) => setEditedDate(e.target.value)}
            className="w-full mb-4 p-2 rounded bg-gray-900 border border-orange-500 text-white"
          />

          {/* Modalità immagine */}
          <label className="block mb-1 text-orange-400">Tipo immagine:</label>
          <select
            value={imageMode}
            onChange={(e) => setImageMode(e.target.value)}
            className="w-full mb-4 p-2 rounded bg-gray-900 border border-orange-500 text-white"
          >
            <option value="upload">Carica nuovo file</option>
            <option value="existing">Scegli da immagini caricate</option>
            <option value="url">Inserisci URL</option>
          </select>

          {imageMode === "upload" && (
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full mb-4 text-white" />
          )}

          {imageMode === "existing" && (
            <select
              value={editedImg}
              onChange={(e) => setEditedImg(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-gray-900 border border-orange-500 text-white"
            >
              <option value="">-- Seleziona immagine --</option>
              {existingImages.map((url) => (
                <option key={url} value={url}>
                  {url.replace("/uploads/", "")}
                </option>
              ))}
            </select>
          )}

          {imageMode === "url" && (
            <input
              type="text"
              value={editedImg}
              onChange={(e) => setEditedImg(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full mb-4 p-2 rounded bg-gray-900 border border-orange-500 text-white"
            />
          )}

          {/* Anteprima immagine */}
          {editedImg && (
            <img
              src={editedImg}
              alt="Anteprima"
              className="max-h-40 rounded border border-gray-600 mb-4"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}

          {/* Descrizione */}
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            rows={4}
            className="w-full mb-4 p-2 rounded bg-gray-900 border border-orange-500 text-white"
            placeholder="Descrizione evento"
          />

          {/* Partecipanti */}
          <div className="mb-4">
            <h4 className="text-orange-400 font-semibold mb-2">Seleziona Partecipanti:</h4>
            {users.map((user) => (
              <label key={user._id} className="block text-white mb-1">
                <input
                  type="checkbox"
                  checked={selectedParticipants.includes(user._id)}
                  onChange={() => toggleParticipant(user._id)}
                  className="mr-2"
                />
                {user.name} ({user.email})
              </label>
            ))}
          </div>

          {/* Azioni salvataggio */}
          <div className="flex gap-4">
            <button onClick={handleCancelClick} className="bg-gray-700 px-4 py-2 rounded text-white">
              Annulla
            </button>
            <button onClick={handleSaveClick} className="bg-orange-500 px-4 py-2 rounded text-white">
              Salva
            </button>
          </div>
        </>
      )}

      {/* Conferma eliminazione */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-sm w-full text-white text-center">
            <h2 className="text-xl font-bold mb-4">Confermi l'eliminazione?</h2>
            <p className="text-red-400 mb-6">Questa azione è irreversibile.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  onDeleteEvent(event._id);
                  setShowConfirmDelete(false);
                }}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Elimina
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="bg-gray-700 px-4 py-2 rounded"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
