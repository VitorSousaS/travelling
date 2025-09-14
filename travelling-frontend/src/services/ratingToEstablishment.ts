import api from "./api";
import { RatingEstablishmentCreateType } from "../interfaces";

export const createRatingToEstablishment = async (
  ratingEstablishmentData: RatingEstablishmentCreateType
) => {
  const { establishmentId, touristId, value } = ratingEstablishmentData;

  const options = {
    url: `/ratingToEstablishment/${touristId}/${establishmentId}`,
    method: "POST",
    data: {
      value,
    },
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const editRatingToEstablishment = async (
  ratingEstablishmentData: RatingEstablishmentCreateType
) => {
  const { establishmentId, touristId, value } = ratingEstablishmentData;

  const options = {
    url: `/ratingToEstablishment/${touristId}/${establishmentId}`,
    method: "PUT",
    data: {
      value,
    },
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};
