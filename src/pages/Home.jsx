import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CarouselComponent from "../components/CarouselComponent";
import { motion } from "framer-motion";
import Footer from "../components/FooterComponent";

export default function Home() {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
    setCheckingLogin(false);
  }, []);

  return (
    <div className="bg-[#0d0d0d] min-h-screen px-4 sm:px-6 py-20 font-sans text-[#f3e6d8] relative overflow-x-hidden">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-3xl mx-auto mb-5"
      >
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-wide drop-shadow-[0_0_15px_rgba(255,106,0,0.8)] mb-4">
          <span className="text-[#ff6a00]">Games</span>
          &
          <span className="text-[#ff6a00]">Toys</span>
        </h1>
        <p className="text-xl sm:text-2xl font-semibold text-[#f3e6d8cc] drop-shadow-md">
          Il tuo negozio per giochi di carte, boardgames e magia!
        </p>
        <motion.div
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px #ff6a00" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="inline-block mt-10 mb-5"
        >
          <Link
            to="/events"
            className="relative inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-[#ff6a00] to-[#ffb347] text-black font-bold overflow-hidden group shadow-lg"
          >
            <span
              className="absolute inset-0 bg-[#ff6a00] translate-x-[-110%] group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-xl"
              aria-hidden="true"
            ></span>
            <span className="relative z-10">Scopri tutti gli eventi</span>
          </Link>
        </motion.div>
      </motion.div >

      {/* Carousel Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className=""
      >
        <h2 className="text-center text-4xl font-bold mb-10 drop-shadow-[0_0_10px_rgba(255,106,0,0.7)]">
          Eventi in evidenza
        </h2>

        {checkingLogin ? (
          <div className="text-center flex justify-center text-orange-400 text-lg font-semibold">
            Controllo accesso...
          </div>
        ) : isLoggedIn ? (
          <CarouselComponent token={token} />
        ) : (
          <p className="text-center text-orange-400 text-lg font-semibold">
            Fai il login per vedere gli eventi in evidenza
          </p>
        )}
      </motion.div>
      <Footer />
    </div>
  );
}
