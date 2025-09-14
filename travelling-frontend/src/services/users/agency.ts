import { AgencyCreateType, AgencyEditType } from "../../interfaces";
import api from "../api";

interface EditAgencyType {
  agencyData: AgencyEditType;
  agencyId: string;
}

export const createAgency = async (agencyData: AgencyCreateType) => {
  const options = {
    url: "/agency",
    method: "POST",
    data: agencyData,
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const editAgency = async ({ agencyData, agencyId }: EditAgencyType) => {
  const options = {
    url: `/agency/${agencyId}`,
    method: "PUT",
    data: agencyData,
    withCredentials: false,
  };
  const response = await api.request(options);
  return response.data;
};
