import { motion } from "framer-motion";

export default function Info() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center px-6 py-16">
      <motion.div
        className="max-w-2xl w-full bg-[#1a1a1a] border border-orange-600 rounded-2xl shadow-lg p-8 space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-orange-500 text-center mb-4">
          Informazioni
        </h1>

        <div className="space-y-4 text-sm sm:text-base">
          <div>
            <p className="text-orange-400 font-semibold mb-1">Email</p>
            <a
              href="mailto:gamesandtoyscanelli@gmail.com"
              className="text-gray-300 hover:text-orange-400 transition text-xs sm:text-base"
            >
              gamesandtoyscanelli@gmail.com
            </a>
          </div>

          <div>
            <p className="text-orange-400 font-semibold mb-1">Telefono</p>
            <a
              href="tel:0141382434"
              className="text-gray-300 hover:text-orange-400 transition"
            >
              0141-382434
            </a>
          </div>

          <div>
            <p className="text-orange-400 font-semibold mb-1">Indirizzo</p>
            <a
              href="https://www.google.com/maps/place/Games+and+Toys/@44.7175626,8.28237,17z/data=!3m1!4b1!4m6!3m5!1s0x4787883899f9f2b7:0x413a490af739ed03!8m2!3d44.7175588!4d8.2849449!16s%2Fg%2F11f3c8wwzj?entry=ttu"
              target="_blank"
              rel="noreferrer"
              className="text-orange-400 hover:underline"
            >
              Canelli, Viale Risorgimento 52 (AT)
            </a>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <p className="text-orange-400 font-semibold mb-2">
              Seguici sui social
            </p>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.facebook.com/gtcanelli?locale=it_IT"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-300 hover:text-orange-400 transition"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/gamesandtoys_mtg/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-300 hover:text-orange-400 transition"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
