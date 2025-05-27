import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="min-h-screen flex items-center justify-center bg-transparent text-white px-4">
      <form className="bg-black p-8 rounded shadow-md w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Profilo utente</h2>
        
        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}

        <div>
          <label className="block mb-1 font-semibold" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={userData.email || ""}
            readOnly
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 cursor-not-allowed text-gray-300"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="userId">ID Utente</label>
          <input
            id="userId"
            type="text"
            value={userData._id || ""}
            readOnly
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 cursor-not-allowed text-gray-300"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="category">Categoria</label>
          <input
            id="category"
            type="text"
            value={userData.category || ""}
            readOnly
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 cursor-not-allowed text-gray-300"
          />
        </div>
      </form>
    </div>
  );
}
