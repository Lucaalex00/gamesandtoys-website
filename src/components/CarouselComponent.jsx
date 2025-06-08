import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function CarouselComponent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Errore nel caricamento eventi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-center text-lg py-10">Caricamento...</div>;
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      className="pb-12"
      fadeEffect
    >
      {events.map((event) => (
        <SwiperSlide key={event._id}>
          <div className="bg-yellow-900 text-center text-black rounded-xl shadow-md flex flex-col h-[360px] w-full max-w-xs mx-auto">
            <img
              src={event.img}
              alt={event.name}
              className="h-36 w-full object-cover rounded-t-xl"
            />
            <div className="flex-1 flex flex-col p-4">
              <h3 className="font-bold text-lg mb-1">{event.name}</h3>
              <p className="text-gray-900  text-sm mb-2">
                {new Date(event.date).toLocaleDateString()}
              </p>
              <div className="text-sm text-black overflow-y-auto flex-1 max-h-[100px] pr-1 custom-scrollbar-card">
                {event.description || event.desc}
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
