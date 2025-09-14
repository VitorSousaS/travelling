export type RatingAttractionCreateType = {
  value: number;
  attractionId: string;
  touristId: string;
};

export type GeneralRating = {
  id: string;
  touristId: string | null;
  attractionId: string;
  value: number;
  createdAt: string;
  updatedAt: string;
};
