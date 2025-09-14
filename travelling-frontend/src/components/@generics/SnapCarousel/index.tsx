import { useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
// import required modules
import { Navigation } from "swiper/modules";
import { AttractionType, EstablishmentType } from "../../../interfaces";
import { AttractionCard, EstablishmentCard, SwitchComponents } from "../..";

interface SnapCarouselProps {
  name: string;
  locals:
    | AttractionType[]
    | EstablishmentType[]
    | (AttractionType | EstablishmentType)[];
}

export const SnapCarousel: React.FC<SnapCarouselProps> = ({ locals }) => {
  const [swiperRef, setSwiperRef] = useState<any | null>(null);

  return (
    <div className="w-full relative">
      {locals.length > 0 && (
        <Swiper
          slidesPerView="auto"
          spaceBetween={32}
          modules={[Navigation]}
          onSwiper={(swiper) => setSwiperRef(swiper)}
          className="overflow-y-visible"
        >
          <button
            className="absolute h-full right-0 top-1/2 rounded-lg -translate-y-1/2 transition duration-500 hover:bg-[#000] hover:opacity-40 z-10 text-auxiliary-beige"
            onClick={() => swiperRef.slideNext()}
          >
            <i className="fa-solid fa-chevron-right px-4 text-3xl text-secondary-light" />
          </button>
          {locals.map((local) => {
            return (
              <SwiperSlide
                key={local.id}
                className="w-80 h-80 xs:w-60 xs:h-60 sm:w-60 sm:h-60 transform transition duration-500 hover:scale-110 hover:cursor-pointer"
              >
                <SwitchComponents active={local.type}>
                  <AttractionCard
                    name="attraction"
                    card={local as AttractionType}
                  />
                  <EstablishmentCard
                    name="establishment"
                    card={local as EstablishmentType}
                  />
                </SwitchComponents>
              </SwiperSlide>
            );
          })}
          <button
            className="absolute h-full left-0 top-1/2 rounded-lg -translate-y-1/2 transition duration-500 hover:bg-[#000] hover:opacity-40 z-10 text-auxiliary-beige"
            onClick={() => swiperRef.slidePrev()}
          >
            <i className="fa-solid fa-chevron-left px-4 text-3xl text-secondary-light" />
          </button>
        </Swiper>
      )}
      {locals.length === 0 && (
        <div className="w-full h-full flex flex-col gap-6 items-center justify-center py-8">
          <img src="/img/empty.svg" alt="Empty" className="h-36 w-auto" />
          <p className="font-semibold text-2xl text-primary-light">
            Oops... Não há locais para essa modalidade.
          </p>
        </div>
      )}
    </div>
  );
};
