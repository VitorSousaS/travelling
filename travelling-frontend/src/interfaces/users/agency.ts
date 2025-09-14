import { GeneralUserType } from ".";

export type AgencyCreateType = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

export type AgencyEditType = {
  name: string;
  phone: string;
  email: string;
};

export type AgencyType = {
  id: string;
  user: GeneralUserType;
};
