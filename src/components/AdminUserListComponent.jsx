import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function AdminUserList() {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Stato per password reset, per ogni utente
  const [resetPasswords, setResetPasswords] = useState({});

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

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleInputChange = (index, field, value) => {
    const updated = [...users];
    updated[index][field] = value;
    setUsers(updated);
  };

  const handleResetPasswordChange = (userId, value) => {
    setResetPasswords((prev) => ({ ...prev, [userId]: value }));
  };

  const handleSave = async (user) => {
    try {
      const { _id, name, email, category, credito } = user;
      await axios.put(`/api/users/${_id}`, 
        { name, email, category, credito },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Utente aggiornato correttamente");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error(err);
      setError("Errore durante il salvataggio");
    }
  };

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

  return (
    <div className="min-h-full px-6 bg-[#0d0d0d] text-white">
      <h1 className="text-xl text-center font-bold mb-3">Gestione utenti (Admin)</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      <div className="space-y-6 overflow-auto h-[300px] sm:min-h-screen">
        {users.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 p-4 rounded-xl border border-gray-700 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* User data fields */}
              <div>
                <label className="text-sm text-gray-400">Nome</label>
                <input
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                  value={user.name}
                  onChange={(e) => handleInputChange(index, "name", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <input
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                  value={user.email}
                  onChange={(e) => handleInputChange(index, "email", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Categoria</label>
                <select
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                  value={user.category}
                  onChange={(e) => handleInputChange(index, "category", e.target.value)}
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
                  onChange={(e) => handleInputChange(index, "credito", Number(e.target.value))}
                />
              </div>
            </div>

            <button
              onClick={() => handleSave(user)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
            >
              Salva modifiche
            </button>

            {/* Reset password */}
            <div className="mt-4">
              <label className="text-sm text-gray-400 mr-2">Reset Password</label>
              <input
                type="password"
                placeholder="Nuova password"
                className="p-2 bg-gray-800 border border-gray-600 rounded mr-2"
                value={resetPasswords[user._id] || ""}
                onChange={(e) => handleResetPasswordChange(user._id, e.target.value)}
              />
              <button
                onClick={() => handleResetPassword(user._id)}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
              >
                Reset
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
