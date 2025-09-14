import api from "./api";
import { AttractionCreateType } from "../interfaces";

interface CreateType {
  attractionData: AttractionCreateType;
  userId: string;
}

interface EditType {
  attractionData: AttractionCreateType;
  attractionId: string;
}

export const createAttraction = async ({
  attractionData,
  userId,
}: CreateType) => {
  const options = {
    url: `/attraction/${userId}`,
    method: "POST",
    data: attractionData,
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const editAttraction = async ({
  attractionData,
  attractionId,
}: EditType) => {
  const options = {
    url: `/attraction/${attractionId}`,
    method: "PUT",
    data: attractionData,
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const getAttractions = async (query: string) => {
  const options = {
    url: `/attraction?${query}`,
    method: "GET",
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const getAttractionsByAgency = async (agencyId: string) => {
  const options = {
    url: `/attraction/attractionByAgency/${agencyId}`,
    method: "GET",
    withCredentials: false,
  };
  const response = await api.request(options);
  return response.data;
};

export const getAttractionById = async (attractionId: string) => {
  const options = {
    url: `/attraction/${attractionId}`,
    method: "GET",
    withCredentials: false,
  };
  const response = await api.request(options);
  return response.data;
};

export const deleteAttraction = async (attractionId: string) => {
  const options = {
    url: `/attraction/${attractionId}`,
    method: "DELETE",
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const getLocationByCEP = async (cep: string) => {
  const options = {
    baseURL: `https://viacep.com.br/ws/${cep}/json`,
    method: "GET",
    withCredentials: false,
  };

  const response = await api.request(options);
  return response;
};
