import { Rate, message } from "antd";
import {
  AttractionType,
  EstablishmentType,
  LocalType,
} from "../../../interfaces";
import {
  createRatingToEstablishment,
  editRatingToEstablishment,
  formatDate,
  formatDaysOpen,
  formatPriceRange,
  formatterMoney,
  queryClient,
} from "../../../services";
import { useContext } from "react";
import { AuthContext } from "../../../context";
import { AxiosError } from "axios";
import { useMutation } from "react-query";

interface HeaderProps {
  type: LocalType;
  local: EstablishmentType | AttractionType;
}

type GeneralLocal = {
  icon: string;
  owner: string;
  date: string;
  location: string;
  pricing: string;
  rating: number;
};

interface GeneralLocalProps {
  currentLocal: GeneralLocal;
}

const getCurrentLocal = (
  local: HeaderProps["local"],
  type: LocalType
): GeneralLocal => {
  const baseLocal: Partial<GeneralLocal> = {
    icon: "",
    owner: "",
    date: "",
    location: "",
    pricing: "",
    rating: 0,
  };

  switch (type) {
    case "attraction":
      const attraction = local as AttractionType;
      return {
        ...baseLocal,
        icon: "fa-solid fa-person-walking-luggage",
        owner: attraction?.agency?.user.name ?? baseLocal.owner,
        date: formatDate(attraction?.date) ?? baseLocal.date,
        location: attraction?.location ?? baseLocal.location,
        pricing: formatterMoney(attraction?.pricing) ?? baseLocal.pricing,
        rating: attraction.averageRating,
      };

    case "establishment":
      const establishment = local as EstablishmentType;
      return {
        ...baseLocal,
        icon: "fa-solid fa-bell-concierge",
        owner: establishment?.business?.user.name ?? baseLocal.owner,
        date: formatDaysOpen(establishment?.openDays) ?? baseLocal.date,
        location: establishment?.location ?? baseLocal.location,
        pricing:
          formatPriceRange(establishment?.minPrice, establishment?.maxPrice) ??
          baseLocal.pricing,
        rating: establishment.averageRating,
      };

    default:
      return baseLocal as GeneralLocal;
  }
};

const Banner: React.FC<HeaderProps> = ({ local }) => (
  <div
    className="rounded-2xl overflow-hidden h-2/3 bg-cover bg-center bg-no-repeat xs:h-1/2 sm:h-1/2"
    style={{ backgroundImage: `url("${local.banner}")` }}
  />
);

const IconLocal: React.FC<GeneralLocalProps> = ({ currentLocal }) => (
  <div className="absolute top-9 left-6 rounded-full w-10 h-10 flex items-center justify-center bg-primary-dark xs:w-8 xs:h-8 sm:w-8 sm:h-8">
    <i
      className={`text-secondary-light text-xl ${currentLocal.icon} xs:text-base sm:text-base`}
    />
  </div>
);

const Rating: React.FC<HeaderProps> = ({ local }) => (
  <div className="flex items-center justify-center gap-2 absolute top-10 right-6 xs:gap-1 xs:right-4 xs:top-9 sm:gap-1 sm:right-4 sm:top-9">
    <i className="fa-solid fa-star text-secondary-light text-2xl xs:text-base sm:text-base" />
    <p className="text-secondary-dark font-semibold text-xl xs:text-base sm:text-base">
      {local.averageRating.toFixed(1)}
    </p>
  </div>
);

const Title: React.FC<HeaderProps> = ({ local }) => (
  <h1 className="font-bold text-primary-dark text-5xl text-center mx-1 xs:text-xl xs:mx-4 sm:text-2xl sm:mx-4 md:text-3xl">
    {local.name}
  </h1>
);

const Subtitle: React.FC<HeaderProps> = ({ local }) => (
  <h3 className="text-primary-light text-lg text-center mx-16 mt-6 line-clamp-4 overflow-hidden xs:mx-1 xs:text-base sm:mx-1 sm:text-base">
    {local.description}
  </h3>
);

const Date: React.FC<GeneralLocalProps> = ({ currentLocal }) => (
  <div className="flex items-center justify-end gap-2 pt-8 xs:justify-center xs:py-2 sm:justify-center sm:py-2">
    <p className="text-base text-primary-light font-medium">
      {currentLocal.date}
    </p>
    <i className="fa-solid fa-calendar-days text-lg text-primary-dark" />
  </div>
);

const Location: React.FC<GeneralLocalProps> = ({ currentLocal }) => (
  <div className="flex items-center gap-2 xs:mt-4 sm:mt-4">
    <i className="fa-solid fa-location-dot text-lg text-primary-dark" />
    <p className="text-base text-primary-light font-medium xs:text-center sm:text-center">
      {currentLocal.location}
    </p>
  </div>
);

const Owner: React.FC<GeneralLocalProps> = ({ currentLocal }) => (
  <div className="flex items-center gap-2">
    <i className="fa-solid fa-building text-lg text-primary-dark" />
    <p className="text-base text-primary-light font-medium">
      {currentLocal.owner}
    </p>
  </div>
);

const RatingEstablishment: React.FC<HeaderProps> = ({ local }) => {
  const { user, UnauthorizeSession } = useContext(AuthContext);

  const ratingByTourist = local.ratings?.find(
    (rating) => rating.touristId === user.id
  );

  const { mutate: mutateCreateRating } = useMutation(
    createRatingToEstablishment,
    {
      onSuccess: async (response) => {
        queryClient.setQueryData<EstablishmentType | undefined>(
          ["establishments-by-id", local.id],
          (oldItem) => {
            if (oldItem) {
              const touristIndex = oldItem.ratings.findIndex(
                (rating) => rating.touristId === user.id
              );
              if (touristIndex !== -1) {
                // Atualizar o item correspondente com os novos dados de 'response.data'
                let updatedItem = { ...oldItem };
                updatedItem.ratings = [response.data];

                return { ...oldItem, ...updatedItem };
              }
              return oldItem;
            } else {
              return oldItem;
            }
          }
        );
        message.success("Obrigado por avaliar este estabelecimento!");
      },
      onError: (error: AxiosError) => {
        if (error.response?.status === 401) {
          UnauthorizeSession();
        } else {
          message.error(
            "Desculpe, não foi possivel atribuir a nota, tente novamente!"
          );
        }
      },
    }
  );

  const { mutate: mutateEditRating } = useMutation(editRatingToEstablishment, {
    onSuccess: async (response) => {
      queryClient.setQueryData<EstablishmentType | undefined>(
        ["establishments-by-id", local.id],
        (oldItem) => {
          if (oldItem) {
            const touristIndex = oldItem.ratings.findIndex(
              (rating) => rating.touristId === user.id
            );
            if (touristIndex !== -1) {
              // Atualizar o item correspondente com os novos dados de 'response.data'
              let updatedItem = { ...oldItem };
              updatedItem.ratings = [response.data];

              return { ...oldItem, ...updatedItem };
            }
            return oldItem;
          } else {
            return oldItem;
          }
        }
      );
      message.success("Obrigado por avaliar este estabelecimento!");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        UnauthorizeSession();
      } else {
        message.error(
          "Desculpe, não foi possivel atribuir a nota, tente novamente!"
        );
      }
    },
  });

  const handleAtributeRating = (value: number) => {
    if (!!ratingByTourist?.value) {
      mutateEditRating({
        value: value,
        establishmentId: local.id,
        touristId: user.id,
      });
    } else {
      mutateCreateRating({
        value: value,
        establishmentId: local.id,
        touristId: user.id,
      });
    }
  };
  return (
    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-auxiliary-beige rounded-lg px-2 py-1 flex flex-col gap-1 z-10 shadow-md xs:w-[80%] xs:items-center xs:justify-center">
      <p className="text-secondary-dark text-xs font-light">
        {ratingByTourist?.value === 0 ? "Dê uma nota:" : "Sua nota:"}
      </p>
      <Rate value={ratingByTourist?.value} onChange={handleAtributeRating} />
    </div>
  );
};

export const Header: React.FC<HeaderProps> = (props) => {
  const currentLocal = getCurrentLocal(props.local, props.type);

  return (
    <header className="relative h-[50rem]">
      <Banner {...props} />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-1/2 shadow-md rounded-lg xs:w-[90%] sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%]">
        <div className="flex flex-col relative p-8 bg-auxiliary-beige rounded-lg">
          {props.type === "establishment" && <RatingEstablishment {...props} />}
          <IconLocal currentLocal={currentLocal} />
          <Rating {...props} />
          <Title {...props} />
          <Subtitle {...props} />

          <div className="mt-6">
            <Date currentLocal={currentLocal} />
            <div className="flex items-center justify-between xs:flex-col sm:flex-col">
              <Owner currentLocal={currentLocal} />
              <p className="font-light text-primary-light text-sm xs:text-center xs:mt-4 sm:text-center sm:mt-4">
                A partir de:
              </p>
            </div>
            <div className="flex items-end justify-between xs:items-center xs:flex-col-reverse sm:items-center sm:flex-col-reverse">
              <Location currentLocal={currentLocal} />
              <p className="text-3xl font-semibold text-secondary-dark text-right xs:text-center xs:text-xl sm:text-center sm:text-2xl">
                {currentLocal.pricing}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
