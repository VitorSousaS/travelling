import { BusinessCreateType, BusinessEditType } from "../../interfaces";
import api from "../api";

interface EditBusinessType {
  businessData: BusinessEditType;
  businessId: string;
}

export const createBusiness = async (businessData: BusinessCreateType) => {
  const options = {
    url: "/business",
    method: "POST",
    data: businessData,
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const editBusiness = async ({
  businessData,
  businessId,
}: EditBusinessType) => {
  const options = {
    url: `/business/${businessId}`,
    method: "PUT",
    data: businessData,
    withCredentials: false,
  };
  const response = await api.request(options);
  return response.data;
};
