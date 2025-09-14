import api from "./api";
import { EstablishmentCreateType } from "../interfaces";

interface CreateType {
  establishmentData: EstablishmentCreateType;
  userId: string;
}

interface EditType {
  establishmentData: EstablishmentCreateType;
  establishmentId: string;
}

export const createEstablishment = async ({
  establishmentData,
  userId,
}: CreateType) => {
  const options = {
    url: `/establishment/${userId}`,
    method: "POST",
    data: establishmentData,
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const editEstablishment = async ({
  establishmentData,
  establishmentId,
}: EditType) => {
  const options = {
    url: `/establishment/${establishmentId}`,
    method: "PUT",
    data: establishmentData,
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const getEstablishments = async (query: string) => {
  const options = {
    url: `/establishment?${query}`,
    method: "GET",
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const getEstablishmentById = async (establishmentId: string) => {
  const options = {
    url: `/establishment/${establishmentId}`,
    method: "GET",
    withCredentials: false,
  };
  const response = await api.request(options);
  return response.data;
};

export const deleteEstablishment = async (establishmentId: string) => {
  const options = {
    url: `/establishment/${establishmentId}`,
    method: "DELETE",
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const getEstablishmentsByBusiness = async (businessId: string) => {
  const options = {
    url: `/establishment/establishmentByBusiness/${businessId}`,
    method: "GET",
    withCredentials: false,
  };
  const response = await api.request(options);
  return response.data;
};
