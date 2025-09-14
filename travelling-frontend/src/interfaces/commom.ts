import { AttractionType, EstablishmentType } from ".";

export type LocalType = "attraction" | "establishment";

export type ModalModeType = "create" | "edit";

export type SectionType = {
  title: string;
  type: LocalType;
  queryParams: string;
};

export type PanelsLocalType = {
  key: string;
  title: string;
  type: LocalType;
  list: EstablishmentType[] | AttractionType[];
  enabled: boolean;
};
