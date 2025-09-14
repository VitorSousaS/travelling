import { AttractionType, EstablishmentType, LocalType } from ".";

export type LocalTypeRegister = {
  position: number;
  type: LocalType;
  localId: string;
};

export type TravellingLocalType = {
  position: number;
  type: LocalType;
  attraction: AttractionType;
  establishment: EstablishmentType;
};

export type TravellingRegisterType = {
  title: string;
  locals: LocalTypeRegister[];
};
export type TravellingCreateType = {
  travellingData: TravellingRegisterType;
  touristId: string;
};

export type TravellingEditType = {
  travellingData: TravellingRegisterType;
  travellingId: string;
};

export type TravellingType = {
  id: string;
  touristId: string;
  title: string;
  locals: TravellingLocalType[];
  createdAt: string;
  updatedAt: string;
};
