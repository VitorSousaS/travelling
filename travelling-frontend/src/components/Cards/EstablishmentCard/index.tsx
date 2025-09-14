import { useNavigate } from "react-router-dom";
import { EstablishmentType } from "../../../interfaces";
import {
  formatAddress,
  formatDaysOpen,
  formatHours,
  formatPriceRange,
} from "../../../services";
import { useContext } from "react";
import { TravellingContext } from "../../../context";
import { tv } from "tailwind-variants";

interface EstablishmentCardProps {
  name: string;
  card: EstablishmentType;
}

const content = tv({
  base: "w-full h-full bg-primary-dark rounded-lg flex flex-col",
  variants: {
    active: {
      true: "border-4 border-secondary-dark",
      false: "",
    },
  },
});

export const EstablishmentCard: React.FC<EstablishmentCardProps> = ({
  card,
}) => {
  const { setOpen, activeTravelling, setSelectedLocal } =
    useContext(TravellingContext);
  const navigate = useNavigate();

  const handleOpenDetails = () => {
    if (activeTravelling) {
      setSelectedLocal(card);
      setOpen(true);
    } else {
      const queryParameters = { localId: card.id, type: "establishment" };
      const query = new URLSearchParams(queryParameters).toString();
      navigate({
        pathname: "/details",
        search: query,
      });
    }
  };

  return (
    <div
      className={content({ active: activeTravelling })}
      onClick={handleOpenDetails}
    >
      <div className="flex w-full h-[55%] xs:h-[50%] sm:h-[50%] rounded-lg bg-primary-light relative">
        <i className="fa-solid fa-bell-concierge text-secondary-light text-xl absolute right-3 top-3 xs:text-base sm:text-base" />
        <img
          src={card.banner}
          loading="lazy"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = "/img/logo-word.svg";
            currentTarget.className += " p-3";
          }}
          alt="Image not found"
          className="w-full h-full rounded-lg"
        />
        <div className="flex items-center justify-center gap-1 absolute top-3 left-3">
          <i className="fa-solid fa-star text-secondary-light text-base xs:text-sm sm:text-sm" />
          <p className="text-auxiliary-beige text-base font-semibold xs:text-sm sm:text-sm">
            {card.averageRating.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="flex flex-col h-[45%] xs:h-[50%] sm:h-[50%] p-3">
        <h3 className="text-center p-1 text-auxiliary-beige text-lg font-semibold leading-4 xs:text-base xs:leading-3 sm:text-base sm:leading-3">
          {card.name}
        </h3>

        <div className="flex items-center justify-center gap-2 mt-1">
          <i className="fa-solid fa-location-dot text-primary-light xs:text-sm sm:text-sm" />
          <p className="text-white font-base text-sm xs:text-xs sm:text-xs">
            {formatAddress(card.location)}
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-light text-auxiliary-beige xs:text-xs sm:text-xs">
              Faixa de preço:
            </p>
            <div className="flex items-center justify-end gap-2">
              <p className="text-auxiliary-beige text-sm xs:text-xs sm:text-xs">
                {formatDaysOpen(card.openDays)}
              </p>
              <i className="fa-solid fa-building text-primary-light" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-base font-bold text-secondary-light xs:text-sm sm:text-sm">
              {formatPriceRange(card.minPrice, card.maxPrice)}
            </p>
            <div className="flex items-center justify-end gap-2">
              <p className="text-sm text-secondary-light xs:text-xs sm:text-xs">
                {formatHours(card.openHours)} à {formatHours(card.closeHours)}
              </p>
              <i className="fa-solid fa-calendar text-primary-light" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
