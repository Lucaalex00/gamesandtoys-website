import React, { useState } from "react";
import { motion } from "framer-motion";

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
  
  // Nuovo stato per la finestra di conferma
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const now = new Date();
  const eventDate = new Date(event.date);
  const isSameDay = now.toDateString() === eventDate.toDateString();
  const isFuture = eventDate > now;
  const isPast = eventDate < now && !isSameDay;

  let borderColor = "border-gray-700";
  let pulseClass = "";

  if (isSameDay) {
    borderColor = "border-yellow-400";
    pulseClass = "animate-pulse";
  } else if (isFuture) {
    borderColor = "border-green-500";
  } else if (isPast) {
    borderColor = "border-red-500";
  }

  const toggleParticipant = (userId) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSaveClick = () => {
    const fullImgPath = editedImg.startsWith("/events/") ? editedImg : "/events/" + editedImg;
    onSaveEdit(event._id, editedDescription, selectedParticipants, fullImgPath, editedDate);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedDescription(event.desc || "");
    setEditedImg(event.img || "");
    setEditedDate(event.date ? event.date.slice(0, 10) : "");
    setSelectedParticipants(event.participants?.map((p) => p.userId) || []);
  };

  // Funzione per trasformare link in anchor
  function linkify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.4 }}
        className={`bg-gray-800 p-6 rounded-xl border-4 ${borderColor} shadow-lg relative ${pulseClass} max-w-full`}
      >
        {/* Pulsante elimina in alto a destra */}
        {userCategory === "admin" && (
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="text-red-500 cursor-pointer absolute sm:top-3 top-1 sm:right-3 right-1 opacity-60 hover:scale-110 hover:opacity-100 hover:text-red-700 font-bold text-xl"
            title="Elimina evento"
            aria-label="Elimina evento"
            type="button"
          >
            ✖
          </button>
        )}

        <div className="flex justify-between items-center mb-2 flex-wrap">
          <h2 className="text-2xl font-semibold tracking-tight break-words max-w-full">{event.name}</h2>
        </div>

        <p className="text-sm text-gray-300 mb-4">
          <time dateTime={event.date} className="font-mono text-orange-400">
            {new Date(event.date).toLocaleDateString("it-IT", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }).toUpperCase()}
          </time>
        </p>

        {!isEditing && (
          <>
            <p className="mb-4 text-xs sm:text-sm text-gray-300 whitespace-pre-wrap break-words">{linkify(event.desc)}</p>

            <div className="mb-4">
              <h3 className="font-bold text-orange-400 mb-2">Partecipanti:</h3>
              {event.participants?.length > 0 ? (
                event.participants.map((p) => {
                  const user = users.find((u) => u._id === p.userId);
                  if (!user) return null;

                  return (
                    <motion.div
                      key={p.userId}
                      className="flex flex-wrap sm:flex-row flex-col  sm:justify-between justify-center sm:items-center items-start gap-2 bg-gray-700 rounded-md p-3 mb-2 shadow-sm hover:bg-gray-600 transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="min-w-0">
                        <p className="font-semibold break-words">{user.name}</p>
                        <p className="text-xs text-gray-400 break-all">{user.email}</p>
                      </div>
                      <div className="flex items-center space-x-2 flex-wrap justify-end">
                        {userCategory === "admin" && (
                          <button
                            onClick={() => onUpdatePoints(event._id, p.userId, -1)}
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm font-semibold transition"
                          >
                            -1
                          </button>
                        )}
                        <span className="font-mono text-lg min-w-[2ch] text-center inline-block">
                          {typeof p.points === "number" ? p.points : 0}
                        </span>
                        {userCategory === "admin" && (
                          <button
                            onClick={() => onUpdatePoints(event._id, p.userId, +1)}
                            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm font-semibold transition"
                          >
                            +1
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-gray-500 italic">Nessun partecipante</p>
              )}
            </div>

            {userCategory === "admin" && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-lg shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                type="button"
              >
                Modifica Evento
              </button>
            )}
          </>
        )}

        {isEditing && (
          <>
            <label className="block mb-2 text-orange-400 font-semibold">
              Data evento:
            </label>
            <input
              type="date"
              value={editedDate}
              onChange={(e) => setEditedDate(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-900 border border-orange-500 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4 transition"
            />

            <label className="block mb-2 text-orange-400 font-semibold">
              URL Immagine:
            </label>
            <input
              type="text"
              value={editedImg.startsWith("/events/") ? editedImg.slice(8) : editedImg}
              onChange={(e) => setEditedImg(e.target.value)}
              placeholder="Inserisci nome file immagine"
              className="w-full p-2 rounded-lg bg-gray-900 border border-orange-500 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4 transition"
            />

            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              rows={5}
              className="w-full p-3 rounded-lg bg-gray-900 border border-orange-500 text-white resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 transition mb-4"
              placeholder="Descrizione evento..."
            />

            <div className="mt-4 max-h-40 overflow-y-auto bg-gray-900 border border-gray-700 rounded-lg p-3">
              <h4 className="text-orange-400 font-semibold mb-2">Seleziona Partecipanti:</h4>
              {users.length === 0 && <p className="text-gray-500 italic">Caricamento utenti...</p>}
              {users.map((user) => (
                <label
                  key={user._id}
                  className="flex items-center space-x-3 mb-1 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(user._id)}
                    onChange={() => toggleParticipant(user._id)}
                    className="form-checkbox h-5 w-5 text-orange-500 rounded focus:ring-orange-400"
                  />
                  <span className="text-white break-words">
                    {user.name} ({user.email})
                  </span>
                </label>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 gap-3 mt-4">
              <button
                onClick={handleCancelClick}
                className="px-5 py-2 bg-gray-700 cursor-pointer rounded-lg text-gray-300 hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
                type="button"
              >
                Annulla
              </button>
              <button
                onClick={handleSaveClick}
                className="px-5 py-2 bg-orange-500 cursor-pointer hover:bg-orange-600 text-white rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-orange-400"
                type="button"
              >
                Salva
              </button>
            </div>

            {userCategory === "admin" && editedImg && (
              <img
                src={editedImg.startsWith("/events/") ? editedImg : "/events/" + editedImg}
                alt={`${event.name} : Immagine non caricata`}
                className="absolute top-3 right-32 w-24 h-24 z-10 rounded-md object-cover opacity-50 hover:opacity-100 duration-300 shadow-lg"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
          </>
        )}
      </motion.div>

      {/* Finestra di conferma eliminazione */}
      {showConfirmDelete && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          aria-modal="true"
          role="dialog"
          aria-labelledby="confirm-delete-title"
          aria-describedby="confirm-delete-description"
        >
          <div className="bg-gray-900 p-6 rounded-lg max-w-sm w-full text-center text-white">
            <h2 id="confirm-delete-title" className="text-xl font-bold mb-4">
              Confermi di voler eliminare questo evento?
            </h2>
            <p id="confirm-delete-description" className="mb-6">
              Questa azione non potrà essere annullata.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
                type="button"
              >
                Annulla
              </button>
              <button
                onClick={() => {
                  onDeleteEvent(event._id);
                  setShowConfirmDelete(false);
                }}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
                type="button"
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
