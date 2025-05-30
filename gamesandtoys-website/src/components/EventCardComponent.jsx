import React, { useState } from "react";
import { motion } from "framer-motion";

export default function EventCard({
  event,
  users,
  userCategory,
  token,
  onUpdatePoints,
  onSaveEdit,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(event.desc || "");
  const [selectedParticipants, setSelectedParticipants] = useState(
    event.participants?.map((p) => p.userId) || []
  );

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
    onSaveEdit(event._id, editedDescription, selectedParticipants);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedDescription(event.desc || "");
    setSelectedParticipants(event.participants?.map((p) => p.userId) || []);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
      className={`bg-gray-800 p-6 rounded-xl border-4 ${borderColor} shadow-lg relative ${pulseClass}`}
    >
      <h2 className="text-2xl font-semibold mb-2 tracking-tight">{event.name}</h2>
      <p className="text-sm text-gray-300 mb-4">
        {" "}
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
          <p className="mb-4 text-gray-300 whitespace-pre-wrap">{event.desc}</p>

          <div className="mb-4">
            <h3 className="font-bold text-orange-400 mb-2">Partecipanti:</h3>
            {event.participants?.length > 0 ? (
              event.participants.map((p) => {
                const user = users.find((u) => u._id === p.userId);
                if (!user) return null;

                return (
                  <motion.div
                    key={p.userId}
                    className="flex items-center justify-between bg-gray-700 rounded-md p-3 mb-2 shadow-sm hover:bg-gray-600 transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        {userCategory === "admin" && (
                            <button
                            onClick={() => onUpdatePoints(event._id, p.userId, -1)}
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm font-semibold transition"
                            >
                            -1
                            </button>
                        )}
                        <span className="font-mono text-lg">{p.points}</span>
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
            >
              Modifica Evento
            </button>
          )}
        </>
      )}

      {isEditing && (
        <>
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            rows={5}
            className="w-full p-3 rounded-lg bg-gray-900 border border-orange-500 text-white resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            placeholder="Descrizione evento..."
          ></textarea>

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
                <span className="text-white">{user.name} ({user.email})</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={handleCancelClick}
              className="px-5 py-2 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Annulla
            </button>
            <button
              onClick={handleSaveClick}
              className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              Salva
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
