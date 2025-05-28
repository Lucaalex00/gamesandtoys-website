import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import AdminUserList from "../components/AdminUserListComponent";

export default function Profile() {
  const { token } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("/api/auth", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
      } catch (err) {
        setError("Errore nel caricamento del profilo.");
        console.error(err);
      }
    };

    if (token) fetchUserData();
  }, [token]);
  return (
    <div className="min-h-screen flex py-10 justify-center px-8 bg-[#0d0d0d] text-white">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-sm space-y-6 border border-gray-700"
      >
        <h2 className="text-2xl font-bold text-center tracking-tight">Profilo utente</h2>

        {error && (
          <div className="text-red-500 text-center font-medium">{error}</div>
        )}

        <div>
          <label className="block mb-1 font-semibold text-sm text-gray-300" htmlFor="category">Nome</label>
          <input
            id="name"
            type="text"
            value={userData.name || ""}
            readOnly
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 cursor-not-allowed text-gray-400"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-sm text-gray-300" htmlFor="credito">Credito</label>
          <input
            id="credito"
            type="text"
            value={userData.credito !== undefined ? `${userData.credito} €` : 0}
            readOnly
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 cursor-not-allowed text-gray-400"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-sm text-gray-300" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={userData.email || ""}
            readOnly
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 cursor-not-allowed text-gray-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-sm text-gray-300" htmlFor="userId">ID Utente</label>
          <input
            id="userId"
            type="text"
            value={userData._id || ""}
            readOnly
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 cursor-not-allowed text-gray-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-sm text-gray-300" htmlFor="category">Categoria</label>
          <input
            id="category"
            type="text"
            value={userData.category || ""}
            readOnly
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 cursor-not-allowed text-gray-400"
          />
        </div>
      </motion.form>

      {userData.category === "admin" && (
        <AdminUserList />)}
    </div>
  );
}
