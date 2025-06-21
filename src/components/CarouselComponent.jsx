import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Spinner from './SpinnerComponent';

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

        const sortedEvents = data
          .sort((a, b) => new Date(a.date) - new Date(b.date)) // Ordinamento cronologico
          .sort((a, b) => {
            const isAFuture = new Date(a.date) >= now;
            const isBFuture = new Date(b.date) >= now;
            return isBFuture - isAFuture;
          });

        setEvents(sortedEvents.slice(0, 10)); // Limita a 10 eventi
      } catch (err) {
        console.error("Errore nel caricamento eventi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const classifyEventDate = (eventDateStr) => {
    const today = new Date();
    const eventDate = new Date(eventDateStr);

    const isToday =
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear();

    const isPast = eventDate < today && !isToday;

    return {
      isToday,
      isPast,
      colorClass: isToday
        ? "text-white-400"
        : isPast
        ? "text-red-500"
        : "text-green-500",
      borderClass: isToday ? "animate-pulse border-4 border-yellow-400" : "",
      bgColor : isPast ? "bg-amber-600" : isToday ? "bg-yellow-500" : "bg-amber-400",
    };
  };

  if (loading) {
    return <Spinner/>
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      loop={true} 
      speed={1500}
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      className="pb-12"
    >
      {events.map((event) => {
        const { colorClass, borderClass, bgColor } = classifyEventDate(event.date);
        return (
          <SwiperSlide key={event._id}>
            <div
              className={`${bgColor} text-center text-black rounded-xl shadow-md flex flex-col h-[360px] w-full max-w-xs mx-auto ${borderClass}`}
            >
              <img
                src={event.img}
                alt={event.name}
                className="h-auto w-full object-cover rounded-t-xl"
              />
              <div className="flex-1 flex flex-col gap-3 p-4">
                <h3 className="font-bold text-lg mb-1">{event.name}</h3>
                <p className={`text-sm mb-2 ${colorClass}`}>
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <div className="text-sm text-black overflow-y-auto flex-1 max-h-[100px] pr-1 custom-scrollbar-card">
                  {event.description || event.desc}
                </div>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
