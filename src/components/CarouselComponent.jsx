import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Spinner from './SpinnerComponent';
import { linkify } from '../utils/linkify';

export default function CarouselComponent({ token }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      const now = new Date();

      // Funzione per calcolare la differenza assoluta in giorni tra due date
      const diffInDays = (date1, date2) => {
        const diffTime = Math.abs(date1.getTime() - date2.getTime());
        return diffTime / (1000 * 60 * 60 * 24);
      };

      // Ordino gli eventi in base alla differenza dalla data odierna
      const sortedEvents = data
        .sort((a, b) => {
          return diffInDays(new Date(a.date), now) - diffInDays(new Date(b.date), now);
        })
        .slice(0, 8); // Prendo massimo 8 eventi

      setEvents(sortedEvents);
    } catch (err) {
      console.error("Errore nel caricamento eventi:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, [token]);

  const classifyEventDate = (eventDateStr) => {
    const today = new Date();
    const eventDate = new Date(eventDateStr);

    const isToday =
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear();

    const isPast = eventDate < today && !isToday;

    const label = isToday
      ? 'OGGI'
      : isPast
      ? 'PASSATO'
      : 'IN ARRIVO';

    return {
      isToday,
      isPast,
      label,
      textColor: "text-yellow-300",
      bgColor: "bg-[#1f1f1f]",
      shadowClass: isToday
        ? "shadow-[0_0_28px_#fbbf24aa]"
        : isPast
        ? "shadow-[0_0_24px_#dc262666]"
        : "shadow-[0_0_24px_#10b98188]",
      shadowHover: isToday
        ? "hover:shadow-[0_0_42px_#fbbf24dd]"
        : isPast
        ? "hover:shadow-[0_0_36px_#dc2626aa]"
        : "hover:shadow-[0_0_36px_#10b981cc]",
    };
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      loop={true}
      speed={1000}
      breakpoints={{
        640: { slidesPerView: 1 },
        770: { slidesPerView: 2 },
        1080: { slidesPerView: 3 },
        1440: { slidesPerView: 4},

      }}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      className=""
    >
      {events.map((event) => {
        const {
          textColor,
          bgColor,
          shadowClass,
          shadowHover,
          label,
        } = classifyEventDate(event.date);

        return (
          <SwiperSlide key={event._id}>
            <div
              className={`${bgColor} ${shadowClass} ${shadowHover} ease-in-out transition-transform my-10 duration-300 hover:scale-102 text-center rounded-xl flex flex-col h-[400px] w-full max-w-xs mx-auto relative`}
            >
              {/* Badge */}
              <div className="absolute top-2 right-2 bg-yellow-500 opacity-50 text-black text-xs font-bold px-2 py-1 rounded-md shadow-md">
                {label}
              </div>

              {/* Image */}
              <img
                src={event.img}
                alt={event.name}
                className="max-h-[160px] w-full object-cover rounded-t-xl"
              />

              {/* Content */}
              <div className="flex-1 flex flex-col gap-3 p-4">
                <h3 className="font-bold text-lg mb-1 text-yellow-200">
                  {event.name}
                </h3>
                <p className={`text-sm mb-2 ${textColor}`}>
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <div className="text-sm text-yellow-100 overflow-y-auto flex-1 max-h-[100px] pr-1 custom-scrollbar-card">
                  <span className="whitespace-pre-wrap break-words">
                    {linkify(event.description || event.desc)}
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
