import { AgencyType, AttractionType, TouristType } from ".";

export type ContractCreateType = {
  attractionId: string;
  agencyId: string;
  touristId: string;
};

export type ContractEditType = {
  contractId: string;
  status: ContractStatusType;
};

export type ContractStatusType =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELED"
  | "FINISHED";

export type ContractType = {
  id: string;
  touristId: string;
  tourist: TouristType;
  agencyId: string;
  agency: AgencyType;
  attractionId: string;
  attraction: AttractionType;
  status: ContractStatusType;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
};
