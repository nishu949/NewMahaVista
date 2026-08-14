import santhaliDance from "../assets/images/santhali-dance.jpg";
import folkMusic from "../assets/images/folk-music.png";
import ArtistCard from "./ArtistCard";
import "swiper/css";
import "swiper/css/autoplay";
// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

const FeaturedArtists = () => {
  return (
    <div className="bg-[#2d1e12] p-6 rounded-2xl">
      <h3 className="text-white mb-6 text-2xl font-bold">
        Featured Artists
      </h3>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView={2}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
      >
        <SwiperSlide>
          <ArtistCard
            img={santhaliDance}
            title="Santhali Dance Performance"
            subtitle="Live Now"
          />
        </SwiperSlide>

        <SwiperSlide>
          <ArtistCard
            img={folkMusic}
            title="Folk Music by Ajay Oraon"
            subtitle="Tonight 7 PM"
          />
        </SwiperSlide>

        {/* Duplicate for smooth looping */}
        <SwiperSlide>
          <ArtistCard
            img={santhaliDance}
            title="Traditional Dance Show"
            subtitle="Streaming"
          />
        </SwiperSlide>

        <SwiperSlide>
          <ArtistCard
            img={folkMusic}
            title="Live Folk Band"
            subtitle="8 PM"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default FeaturedArtists;