import { Link } from "react-router-dom";
import CarouselComponent from "../components/CarouselComponent";
import SpinnerComponent from "../components/SpinnerComponent";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 min-h-screen text-[#f3e6d8]">
      {/* Hero */}
      <div className="text-center py-10 sm:py-14">
        <h1 className="text-4xl sm:text-6xl font-extrabold drop-shadow-lg tracking-wide">
          GamesAndToys
        </h1>
        <p className="mt-4 text-lg sm:text-xl font-semibold drop-shadow-md">
          Il tuo negozio per giochi di carte, boardgames e magia!
        </p>
        <Link
          to="/catalog"
          className="mt-8 inline-block bg-[#d9822b] text-[#3b2f2f] font-bold px-6 py-3 sm:px-8 sm:py-3 rounded-xl shadow-lg hover:bg-[#6e4a18] hover:text-[#f3e6d8] duration-300 transition"
        >
          Scopri tutti gli eventi
        </Link>
      </div>

      {/* Carousel */}
      <div className="mt-16">
        <h2 className="text-2xl sm:text-4xl font-bold mb-8 text-center drop-shadow-md">
          Eventi in evidenza
        </h2>
        <CarouselComponent />
      </div>
    </div>
  );
}
