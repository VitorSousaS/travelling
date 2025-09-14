export type UserRoleType = "ADMIN" | "AGENCY" | "TOURIST" | "BUSINESS";

export type UserType = {
  id: string;
  name: string;
  email: string;
  userRole: UserRoleType;
};

export type OptionType = {
  label: string;
  value: string;
};

export type GeneralUserType = {
  id: string;
  name: string;
  email: string;
  phone: string;
};
