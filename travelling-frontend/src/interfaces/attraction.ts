import { AgencyType, CategoryType, GeneralRating, LocalType } from ".";

export type AttractionCreateType = {
  name: string;
  banner?: string;
  date: string;
  location: string;
  foundInAttraction: string;
  notFoundInAttraction: string;
  categories: string[];
  generalMedias?: string[];
  pricing: string;
  description: string;
  whatToTake: string[];
};

export type AttractionType = {
  id: string;
  agencyId: string;
  type: LocalType;
  agency: AgencyType;
  name: string;
  pricing: number;
  location: string;
  date: string;
  description: string;
  foundInAttraction: string;
  notFoundInAttraction: string;
  whatToTake: string[];
  banner: string;
  generalMedias: string[];
  createdAt: string;
  updatedAt: string;
  categories: CategoryType[];
  ratings: GeneralRating[];
  averageRating: number;
};
