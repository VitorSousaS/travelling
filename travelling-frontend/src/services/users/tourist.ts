import { getUserDataCookie } from "..";
import { TouristCreateType, TouristEditType } from "../../interfaces";
import api from "../api";

interface EditTouristType {
  touristData: TouristEditType;
  touristId: string;
}

export const createTourist = async (touristData: TouristCreateType) => {
  const options = {
    url: "/tourist",
    method: "POST",
    data: touristData,
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const editTourist = async ({
  touristData,
  touristId,
}: EditTouristType) => {
  const options = {
    url: `/tourist/${touristId}`,
    method: "PUT",
    data: touristData,
    withCredentials: false,
  };
  const response = await api.request(options);
  return response.data;
};

export const getTouristById = async () => {
  const touristId = getUserDataCookie()?.id;

  const options = {
    url: `/tourist/${touristId}`,
    method: "GET",
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};
