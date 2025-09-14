import { CategoryType, GeneralUserType } from "..";

export type TouristCreateType = {
  name: string;
  lastname: string;
  age: number;
  phone: string;
  email: string;
  password: string;
  favoriteCategories?: string[];
};

export type TouristEditType = {
  name: string;
  lastname: string;
  age: number;
  phone: string;
  email: string;
  favoriteCategories?: string[];
};

export type TouristType = {
  id: string;
  lastname: string;
  age: number;
  userId: string;
  favoriteCategories: CategoryType[];
  user: GeneralUserType;
};
