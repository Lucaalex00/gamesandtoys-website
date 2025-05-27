import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function CarouselComponent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
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
    return <div className="text-center text-lg">Caricamento...</div>;
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
      autoplay={{ delay: 2500 }}
      className="pb-20"
    >
      {events.map((event) => (
        <SwiperSlide key={event._id}>
          <div className="bg-[#3b2f2f] text-[#f3e6d8] rounded-lg overflow-hidden shadow-lg">
            <img src={event.img} alt={event.name} className="w-full h-48 object-cover border-black border-2 border-b-0" />
            <div className="p-4 border-black border-2 border-t-1">
              <h3 className="text-xl font-bold mb-2">{event.name}</h3>
              <p className="text-sm mb-2">{new Date(event.date).toLocaleDateString()}</p>
              <p className="text-sm">{event.desc}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
