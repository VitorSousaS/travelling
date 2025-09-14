import { BusinessType, CategoryType, GeneralRating, LocalType } from ".";

export type EstablishmentCreateType = {
  name: string;
  description: string;
  banner?: string;
  openHours: string;
  closeHours: string;
  minPrice: string;
  maxPrice: string;
  location: string;
  openDays: string[];
  foundInEstablishment: string;
  otherInformation: string;
  phone?: string;
  categories: string[];
  generalMedias?: string[];
  menuOfServicesMedia?: string[];
};

export type EstablishmentType = {
  id: string;
  businessId: string;
  business: BusinessType;
  type: LocalType;
  name: string;
  description: string;
  banner: string;
  openHours: string;
  closeHours: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  openDays: string[];
  foundInEstablishment: string;
  otherInformation: string;
  phone: string;
  generalMedias: string[];
  menuOfServicesMedia: string[];
  createdAt: string[];
  updatedAt: string[];
  categories: CategoryType[];
  ratings: GeneralRating[];
  averageRating: number;
};
