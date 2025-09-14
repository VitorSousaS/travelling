import { Dispatch } from "react";
import { LocalType } from ".";

export type FilterLocalType = LocalType | "commom";

export type SelectedFilterType = {
  label: string;
  filterKey: string;
  value: string[] | string;
  type?: FilterLocalType;
};

export interface DefaultFiltersType extends SelectedFilterType {
  icon: string;
}

export type FilterContextType = {
  query: string;
  setQuery: (query: string) => void;
  prevQuery: { current: string };
  setPrevQuery: (prevQuery: { current: string }) => void;
  selectedFilters: SelectedFilterType[];
  setSelectedFilters: Dispatch<React.SetStateAction<SelectedFilterType[]>>;
  defaultSelectedFilters: SelectedFilterType[];
  setDefaultSelectedFilters: Dispatch<
    React.SetStateAction<SelectedFilterType[]>
  >;
  categories: FilterContextType["selectedFilters"];
  setCategories: (categories: SelectedFilterType[]) => void;
  setFiltersForage: (filters: SelectedFilterType[]) => void;
  getFiltersForage: () => Promise<SelectedFilterType[]>;
  restoreSession: () => void;
  validateQuery: () => void;
};
