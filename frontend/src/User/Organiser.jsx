import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Organisernav from "../components/Organisernav";
import OrganiserCard from "./OrganiserCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const hostedEvents = [
  {
    image: "https://marketplace.canva.com/EAGMfKHvKo0/1/0/1131w/canva-colorful-watercolor-paint-school-college-art-fair-event-poster-ZGG78kx7RcY.jpg",
    title: "Art Fair",
    date: "March 10 - March 18 | 9AM Onwards",
    location: "D7 Auditorium",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMrccxj7Zay5iWH8Pza7Ht3-ejrdH-fewyMQ&s",
    title: "Social Media Impacts",
    date: "March 1 | 12PM",
    location: "DACA Block",
  },
  {
    image: "https://marketplace.canva.com/EAFve9IQa2k/1/0/1131w/canva-elegant-minimalist-graduation-party-invitation-poster--QubhEOx0h0.jpg",
    title: "Graduation Party: 2025",
    date: "April 10 | 7PM",
    location: "Main Ground, C1",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCj9_-qG6QDtSiAiB-XH1j9khoiC3faIdoLw&s",
    title: "Sunburn Festival - Mumbai",
    date: "April 5 | 6PM",
    location: "Mahalaxmi Racecourse",
  },
];

const OrganiserPanel = () => {
  const swiperRef = useRef(null);

  return (
    <div className="bg-black py-10 relative">
      <Organisernav />
      <h2 className="text-center text-white text-2xl font-semibold mb-6">
        MANAGE & ANALYSE YOUR PAST EVENTS!
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
          spaceBetween={10} 
          slidesPerView={3}
          breakpoints={{
            1024: { slidesPerView: 3 },
            768: { slidesPerView: 2 },
            480: { slidesPerView: 1 },
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className="px-2"
        >
          {hostedEvents.map((event, index) => (
            <SwiperSlide key={index}>
              <OrganiserCard event={event} />
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

      {/* Button to Add New Event */}
      
    </div>
  );
};

export default OrganiserPanel;
