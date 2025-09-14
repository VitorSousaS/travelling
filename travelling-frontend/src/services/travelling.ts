import api from "./api";
import { TravellingCreateType, TravellingEditType } from "../interfaces";

export const createTravelling = async ({
  travellingData,
  touristId,
}: TravellingCreateType) => {
  const options = {
    url: `/travelling/${touristId}`,
    method: "POST",
    data: travellingData,
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const editTravelling = async ({
  travellingData,
  travellingId,
}: TravellingEditType) => {
  const options = {
    url: `/travelling/${travellingId}`,
    method: "PUT",
    data: travellingData,
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const deleteTravelling = async (travellingId: string) => {
  const options = {
    url: `/travelling/${travellingId}`,
    method: "DELETE",
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const getTravellingByTourist = async (touristId: string) => {
  const options = {
    url: `/travelling/travellingsByTourist/${touristId}`,
    method: "GET",
    withCredentials: false,
  };
  const response = await api.request(options);
  return response.data;
};
