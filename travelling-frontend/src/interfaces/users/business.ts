import { GeneralUserType } from ".";

export type BusinessCreateType = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

export type BusinessEditType = {
  name: string;
  phone: string;
  email: string;
};

export type BusinessType = {
  id: string;
  user: GeneralUserType;
};
