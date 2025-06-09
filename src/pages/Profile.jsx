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
  <div
    className="
      max-h-screen w-full 
      flex flex-col sm:flex-row 
      items-start justify-start 
      px-4 sm:px-6 lg:px-8 py-10 
      bg-[#0d0d0d] text-white overflow-x-hidden
    "
    style={{ height: "95vh" }} // Altezza viewport per gestire overflow figli
  >
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="
        bg-gray-900 
        w-1/2 max-w-md mx-auto
        p-6 sm:p-8 
        rounded-xl shadow-lg space-y-6 border border-gray-700
        flex-shrink-0
        sm:h-screen 
        overflow-y-auto
      "
    >
      <h2 className="text-2xl font-bold text-center tracking-tight">Profilo utente</h2>

      {error && (
        <div className="text-red-500 text-center font-medium">{error}</div>
      )}

      <div>
        <label htmlFor="name" className="block mb-1 font-semibold text-sm text-gray-300">Nome</label>
        <input
          id="name"
          type="text"
          value={userData.name || ""}
          readOnly
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 cursor-not-allowed text-gray-400"
        />
      </div>

      <div>
        <label htmlFor="credito" className="block mb-1 font-semibold text-sm text-gray-300">Credito</label>
        <input
          id="credito"
          type="text"
          value={userData.credito !== undefined ? `${userData.credito} €` : "0 €"}
          readOnly
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 cursor-not-allowed text-gray-400"
        />
      </div>

      <div>
        <label htmlFor="email" className="block mb-1 font-semibold text-sm text-gray-300">Email</label>
        <input
          id="email"
          type="email"
          value={userData.email || ""}
          readOnly
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 cursor-not-allowed text-gray-400"
        />
      </div>

      <div>
        <label htmlFor="userId" className="block mb-1 font-semibold text-sm text-gray-300">ID Utente</label>
        <input
          id="userId"
          type="text"
          value={userData._id || ""}
          readOnly
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 cursor-not-allowed text-gray-400"
        />
      </div>

      <div>
        <label htmlFor="category" className="block mb-1 font-semibold text-sm text-gray-300">Categoria</label>
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
      <div
        className="
          w-full 
          max-w-5xl 
          mt-10 sm:mt-0 
          sm:ml-6 
          flex-grow 
          overflow-y-hidden
        "
        style={{ maxHeight: "100vh" }}
      >
        <AdminUserList />
      </div>
    )}
  </div>
);
}
