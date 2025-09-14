import api from "./api";
import { RatingAttractionCreateType } from "../interfaces";

export const createRatingToAttraction = async (
  ratingAttractionData: RatingAttractionCreateType
) => {
  const { attractionId, touristId, value } = ratingAttractionData;

  const options = {
    url: `/ratingToAttraction/${touristId}/${attractionId}`,
    method: "POST",
    data: {
      value,
    },
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const editRatingToAttraction = async (
  ratingAttractionData: RatingAttractionCreateType
) => {
  const { attractionId, touristId, value } = ratingAttractionData;

  const options = {
    url: `/ratingToAttraction/${touristId}/${attractionId}`,
    method: "PUT",
    data: {
      value,
    },
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};
