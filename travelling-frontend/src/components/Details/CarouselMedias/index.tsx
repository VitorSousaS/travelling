import { useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
// import required modules
import { Navigation } from "swiper/modules";

interface CarouselMediasProps {
  medias: string[];
  title: string;
}

export const CarouselMedias: React.FC<CarouselMediasProps> = ({
  title,
  medias,
}) => {
  const [swiperRef, setSwiperRef] = useState<any | null>(null);

  return (
    <div className="flex flex-col">
      <h2 className="font-semibold text-primary-dark text-2xl py-4">{title}</h2>
      <div className="relative w-full h-96">
        {medias.length > 0 && (
          <Swiper
            className="h-full"
            slidesPerView={2}
            spaceBetween={32}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              1280: {
                slidesPerView: 2,
              },
            }}
            onSwiper={(swiper) => setSwiperRef(swiper)}
            modules={[Navigation]}
          >
            <button
              className="absolute h-full right-0 top-1/2 rounded-lg -translate-y-1/2 transition duration-500 hover:bg-[#000] hover:opacity-40 z-10 text-auxiliary-beige"
              onClick={() => swiperRef.slideNext()}
            >
              <i className="fa-solid fa-chevron-right px-4 text-3xl text-secondary-light" />
            </button>
            {medias.map((media) => {
              return (
                <SwiperSlide key={media} className="h-full rounded-xl">
                  <div className="bg-green-400 h-full rounded-xl overflow-hidden">
                    <img
                      src={media}
                      alt="Imagem do local"
                      className="w-full h-full"
                    />
                  </div>
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
        {medias.length === 0 && (
          <div className="w-full h-full flex flex-col gap-6 items-center justify-center py-8 bg-red-500">
            <img src="/img/empty.svg" alt="Empty" className="h-48 w-auto" />
            <p className="font-semibold text-2xl text-primary-light">
              Oops... Não há outras midias para esse local...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
