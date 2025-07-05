import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function AdminUserList() {
  // Prendi il token dall'autenticazione (redux store)
  const { token } = useSelector((state) => state.auth);

  // Stato per lista utenti
  const [users, setUsers] = useState([]);

  // Stato per messaggi di errore/successo
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Stato per le nuove password da assegnare a ogni utente
  const [resetPasswords, setResetPasswords] = useState({});

  // Stato per il filtro (input ricerca)
  const [searchQuery, setSearchQuery] = useState("");

  // Stato per gestire quali accordion sono aperti (id utenti)
  const [openUserIds, setOpenUserIds] = useState([]);

  //Note Si/No
  const [noteVisibleIds, setNoteVisibleIds] = useState([]);


  // Chiamata API per caricare tutti gli utenti
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Errore nel caricamento utenti");
    }
  };

  // Esegui il fetch utenti appena il token è disponibile
  useEffect(() => {
    fetchUsers();
  }, [token]);

  // Gestione modifiche input (nome, email, ecc.)
  const handleInputChange = (userId, field, value) => {
  setUsers((prevUsers) =>
    prevUsers.map((user) =>
      user._id === userId ? { ...user, [field]: value } : user
    )
  );
};
  // Gestione modifica campo password per utente
  const handleResetPasswordChange = (userId, value) => {
    setResetPasswords((prev) => ({ ...prev, [userId]: value }));
  };

  // Salva le modifiche fatte a un utente
  const handleSave = async (user) => {
    try {
      const { _id, name, email, category, credito, note } = user;
      await axios.put(
        `/api/users/${_id}`,
        { name, email, category, credito, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Utente aggiornato correttamente");
      setTimeout(() => setSuccessMessage(""), 2000);
      await fetchUsers();
      console.log(note);
    } catch (err) {
      console.error(err);
      setError("Errore durante il salvataggio");
    }
  };

  // Esegue il reset della password per un utente
  const handleResetPassword = async (userId) => {
    const newPassword = resetPasswords[userId];
    if (!newPassword || newPassword.trim() === "") {
      setError("Inserisci una nuova password per il reset");
      return;
    }

    try {
      await axios.put(
        `/api/users/${userId}/reset-password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Password resettata con successo");
      setResetPasswords((prev) => ({ ...prev, [userId]: "" }));
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error(err.response || err);
      setError("Errore durante il reset della password");
    }
  };

  // Mostra/Nasconde l'accordion per un utente
  const toggleAccordion = (userId) => {
    setOpenUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const toggleNoteVisibility = (userId) => {
  setNoteVisibleIds((prev) =>
    prev.includes(userId)
      ? prev.filter((id) => id !== userId)
      : [...prev, userId]
  );
};


  return (
    <div className="min-h-full px-6 bg-[#0d0d0d] text-white">
      {/* Titolo */}
      <h1 className="text-xl text-center font-bold mb-3">Gestione utenti (Admin)</h1>

      {/* Messaggi di errore o successo */}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      {/* Campo input per la ricerca utenti */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cerca per nome o email..."
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Lista utenti filtrati */}
      <div className="space-y-4 overflow-auto h-[500px] sm:min-h-screen">
        {users.map((user) => {
          // Filtro direttamente dentro la map
          const match =
            user.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().startsWith(searchQuery.toLowerCase());

          if (!match) return null;

          const isOpen = openUserIds.includes(user._id);

          return (
            <div
              key={user._id}
              className="bg-gray-900 rounded-xl border border-gray-700"
            >
              {/* Intestazione accordion */}
              <button
                onClick={() => toggleAccordion(user._id)}
                className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-t-xl flex justify-between items-center"
              >
                <span className="text-lg font-semibold">
                  {user.name} ({user.email})
                </span>
                <span className="text-sm text-gray-400">{isOpen ? "▲" : "▼"}</span>
              </button>

              {/* Corpo accordion */}
              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden relative py-3"
              >
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Nome</label>
                      <input
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                        value={user.name}
                        onChange={(e) =>
                          handleInputChange(user._id, "name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Email</label>
                      <input
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                        value={user.email}
                        onChange={(e) =>
                          handleInputChange(user._id, "email", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Categoria</label>
                      <select
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                        value={user.category}
                        onChange={(e) =>
                          handleInputChange(user._id, "category", e.target.value)
                        }
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Credito (€)</label>
                      <input
                        type="number"
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                        value={user.credito}
                        onChange={(e) =>
                          handleInputChange(user._id, "credito", Number(e.target.value))
                        }
                      />
                    </div>
                  </div>

                  {/* Pulsante salvataggio */}
                  <button
                    onClick={() => handleSave(user)}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
                  >
                    Salva modifiche
                  </button>

                  {/* Reset password */}
                  <div className="mt-4">
                    <label className="text-sm text-gray-400 mr-2">
                      Reset Password
                    </label>
                    <input
                      type="password"
                      placeholder="Nuova password"
                      className="p-2 bg-gray-800 border border-gray-600 rounded mr-2"
                      value={resetPasswords[user._id] || ""}
                      onChange={(e) =>
                        handleResetPasswordChange(user._id, e.target.value)
                      }
                    />
                    <button
                      onClick={() => handleResetPassword(user._id)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                {/* NOTE in basso a destra */}
                <div className="absolute bottom-0 right-1 w-32 sm:w-64">
                  <div className="flex items-center justify-end gap-3 mb-1">
                    <label className="text-sm text-gray-700 font-semibold">Note</label>
                    <button
                      onClick={() => toggleNoteVisibility(user._id)}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      {noteVisibleIds.includes(user._id) ? "Nascondi" : "Mostra"}
                    </button>
                  </div>

                  {noteVisibleIds.includes(user._id) && (
                    <textarea
                      rows={3}
                      className="w-full p-2 text-center rounded bg-yellow-200 text-black border border-yellow-400 focus:outline-none resize-none"
                      value={user.note || ""}
                      onChange={(e) => handleInputChange(user._id, "note", e.target.value)}
                    />
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
