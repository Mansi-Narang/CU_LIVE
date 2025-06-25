import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import EventCard from "./EventCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axiosClient from "../api/axiosClient";

const EventCarousel = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async() => {
      const response = await axiosClient.get("/events");
      return response.data.data;
    };

    fetchEvents().then((data) => {
      setEvents(data);
    });
  }, []);

  const swiperRef = useRef(null);

  return (
    <div className="py-10 relative">
      <h2 className="text-center text-white text-3xl font-semibold mb-6">
      GRAB YOUR OPPURTUNITY NOW!
      </h2>

      <div className="relative max-w-5xl mx-auto px-4">
        {/* Left Arrow */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:scale-110 transition z-10"
        >
          <ChevronLeft size={28} className="text-black" />
        </button>

        <Swiper
          modules={[Navigation]}
          spaceBetween={10}  // Reduced gap between slides
          slidesPerView={3}
          breakpoints={{
            1024: { slidesPerView: 3 },
            768: { slidesPerView: 2 },
            480: { slidesPerView: 1 },
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className="px-2"
        >
          {events.map((event, index) => (
            <SwiperSlide key={index}>
              <a href={`/events/${event._id}`}><EventCard event={event} /></a>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Right Arrow */}
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:scale-110 transition z-10"
        >
          <ChevronRight size={28} className="text-black" />
        </button>
      </div>
    </div>
  );
};

export default EventCarousel;
