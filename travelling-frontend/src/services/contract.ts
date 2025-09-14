import api from "./api";
import {
  ContractCreateType,
  ContractEditType,
  UserRoleType,
} from "../interfaces";

export const createContract = async (contractData: ContractCreateType) => {
  const { attractionId, agencyId, touristId } = contractData;

  const options = {
    url: `/contract/${attractionId}/${agencyId}/${touristId}`,
    method: "POST",
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const editContract = async (contractData: ContractEditType) => {
  const { contractId, status } = contractData;

  const options = {
    url: `/contract/${contractId}`,
    method: "PATCH",
    data: {
      status,
    },
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const getContracts = async (userId: string, userRole: UserRoleType) => {
  const urlByRole = {
    AGENCY: "contractsByAgency",
    TOURIST: "contractsByTourist",
  };

  const options = {
    url: `/contract/${urlByRole[userRole as keyof typeof urlByRole]}/${userId}`,
    method: "GET",
    withCredentials: false,
  };
  const response = await api.request(options);
  return response.data;
};
