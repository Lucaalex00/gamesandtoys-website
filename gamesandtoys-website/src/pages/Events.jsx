import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import * as jwtDecodeModule from "jwt-decode";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]); // lista utenti
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | future | past
  const [editEventId, setEditEventId] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]); // id utenti selezionati
  const [successMessage, setSuccessMessage] = useState("");

  const userCategory = useSelector((state) => state.auth.userCategory);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecodeModule(token);
        console.log("Decoded token:", decoded);
      } catch (err) {
        console.warn("Token non valido:", err);
      }
    }
  }, []);

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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsers(res.data);
        } catch (err) {
          console.error("Errore nel caricamento utenti:", err);
        }
      };
    
    fetchEvents();
    fetchUsers();
  }, []);
    
  const handleIncrementPoints = async (eventId, userId) => {
    try {
      const response = await axios.put(
        `/api/events/${eventId}/participants/${userId}/increment`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev._id === eventId
            ? {
                ...ev,
                participants: ev.participants.map((p) =>
                  p.userId === userId
                    ? { ...p, points: response.data.points }
                    : p
                ),
              }
            : ev
        )
      );
    } catch (err) {
      console.error("Errore nell'incremento dei punti:", err);
      alert("Errore nell'incremento dei punti");
    }
    };
    
const handleDecrementPoints = async (eventId, userId) => {
    try {
        const response = await axios.put(
        `/api/events/${eventId}/participants/${userId}/decrement`,
        {},
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );
    
        setEvents((prevEvents) =>
        prevEvents.map((ev) =>
            ev._id === eventId
            ? {
                ...ev,
                participants: ev.participants.map((p) =>
                    p.userId === userId
                    ? { ...p, points: response.data.points }
                    : p
                ),
                }
            : ev
        )
        );
    } catch (err) {
        console.error("Errore nel decremento dei punti:", err);
        alert("Errore nel decremento dei punti");
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

  const handleEditClick = (event) => {
    setEditEventId(event._id);
    setEditedDescription(event.desc || "");
    // imposto i partecipanti selezionati
    const participantsIds = event.participants?.map(p => p.userId) || [];
    setSelectedParticipants(participantsIds);
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(`/api/events/${editEventId}`, {
        desc: editedDescription,
        participants: selectedParticipants.map(userId => ({ userId })) // array di oggetti userId
      });

      setEvents((prev) =>
        prev.map((ev) =>
          ev._id === editEventId
            ? { ...ev, desc: editedDescription, participants: selectedParticipants.map(userId => ({ userId })) }
            : ev
        )
      );
      setEditEventId(null);
      setEditedDescription("");
      setSelectedParticipants([]);

      setSuccessMessage(response.data.message || "Evento aggiornato!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Errore nel salvataggio evento:", err);
      alert("Errore nel salvataggio evento");
    }
  };

  const handleCancelClick = () => {
    setEditEventId(null);
    setEditedDescription("");
    setSelectedParticipants([]);
  };

  const toggleParticipant = (userId) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="min-h-screen px-4 py-8 text-white">
      <h1 className="text-3xl font-bold text-center mb-8">Eventi</h1>

      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 mb-8 px-2">
        <input
          type="text"
          placeholder="Cerca per nome (inizia con...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow p-3 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`p-3 rounded bg-gray-800 border border-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-500 ${
            filter === "future"
              ? "text-green-400"
              : filter === "past"
              ? "text-red-400"
              : "text-white"
          }`}
        >
          <option value="all" className="text-white">
            Tutti
          </option>
          <option value="future" className="text-green-400">
            Futuri
          </option>
          <option value="past" className="text-red-400">
            Passati
          </option>
        </select>
      </div>

      {userCategory === "admin" &&
        successMessage && (
          <div className="fixed bottom-0 z-10 text-center w-1/3 mx-auto max-w-4xl mb-4 bg-green-600 text-white py-2 rounded shadow">
            {successMessage}
          </div>
        )}

      <div className="max-w-4xl mx-auto space-y-6 px-2">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
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

            const isEditing = editEventId === event._id;

            return (
              <div
                key={event._id}
                className={`bg-gray-800 p-5 rounded-lg shadow-md border-2 ${borderColor} ${pulseClass}`}
              >
                <h2 className="text-2xl font-semibold mb-1">{event.name}</h2>
                <p className="text-sm text-gray-400">Data: {eventDate.toLocaleString()}</p>

                {userCategory === "admin" ? (
                  isEditing ? (
                    <>
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="mt-3 p-2 w-full bg-gray-700 text-white rounded resize-y"
                        rows={4}
                      />

                      <div className="mt-3">
                        <label className="block mb-1 font-semibold">
                          Seleziona partecipanti:
                        </label>
                        <div className="max-h-40 overflow-y-auto bg-gray-900 p-2 rounded border border-gray-600">
                          {users.map((user) => (
                            <div key={user._id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedParticipants.includes(user._id)}
                                onChange={() => toggleParticipant(user._id)}
                                id={`user-${user._id}`}
                                className="cursor-pointer"
                              />
                              <label htmlFor={`user-${user._id}`} className="cursor-pointer">
                                {user.name || user.username || user.email}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={handleSaveClick}
                          className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
                        >
                          Salva
                        </button>
                        <button
                          onClick={handleCancelClick}
                          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
                        >
                          Annulla
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="mt-3 text-gray-200">{event.desc}</p>
                      <p className="mt-2 font-semibold">Partecipanti:</p>
                      <ul className="list-disc list-inside mb-5">
                      {(event.participants || []).map((p) => {
                            const user = users.find((u) => u._id === p.userId);
                            return (
                                <li key={p.userId} className="flex items-center mb-3 justify-between">
                                <span>
                                    {user ? user.name || user.username || user.email : p.userId}
                                    {" - Punti: "}{p.points ?? 0}
                                </span>
                                {userCategory === "admin" &&  (
                                    <div className="flex gap-2">
                                        <button
                                        onClick={() => handleIncrementPoints(event._id, p.userId)}
                                        className="px-2 flex items-center justify-center py-1 w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                                            >
                                            <span className="cursor-pointer">
                                                ➕​
                                            </span>
                                        </button>
                                        <button
                                        onClick={() => handleDecrementPoints(event._id, p.userId)}
                                        className="px-2 flex items-center justify-center w-8 h-8 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                                            >
                                            <span className="cursor-pointer">
                                                ➖
                                            </span>
                                        </button>
                                    </div>
                                    )}
                                </li>
                            );
                            })}
                        </ul>
                      <button
                        onClick={() => handleEditClick(event)}
                        className="mt-3 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
                      >
                        Modifica
                      </button>
                    </>
                  )
                ) : (
                    <>
                    <p className="mt-3 text-gray-200">{event.desc}</p>
                    <p className="mt-2 font-semibold">Partecipanti:</p>
                    <ul className="list-disc list-inside">
                      {(event.participants || []).map((p) => {
                        const user = users.find((u) => u._id === p.userId);
                        return (
                          <li key={p.userId} className="flex justify-between items-center mb-2">
                            <span>
                              {user ? user.name || user.username || user.email : p.userId}
                              {" - Punti: "}{p.points ?? 0}
                            </span>
                            {userCategory === "admin" && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleIncrementPoints(event._id, p.userId)}
                                  className="px-2 flex items-center justify-center py-1 w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                                >
                                  ➕​
                                </button>
                                <button
                                  onClick={() => handleDecrementPoints(event._id, p.userId)}
                                  className="px-2 flex items-center justify-center w-8 h-8 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                                >
                                  ➖
                                </button>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400 bg-gray-800 mx-4 p-6 rounded-lg">Nessun evento trovato.</p>
        )}
      </div>
    </div>
  );
}
