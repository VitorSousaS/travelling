import { createContext, ReactNode, useMemo } from "react";
import { useFilters } from "./hooks";
import { FilterContextType } from "../interfaces";

interface IFiltersProvider {
  children: ReactNode;
}

interface FiltersProps extends FilterContextType {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
}

const initialValues = {
  query: "",
  prevQuery: { current: "" },
  selectedFilters: [],
  defaultSelectedFilters: [],
  categories: [],
  openModal: false,
};

const FiltersContext = createContext({} as FiltersProps);

const FiltersProvider = (props: IFiltersProvider) => {
  const authProps = useFilters(initialValues);

  return (
    <FiltersContext.Provider value={useMemo(() => authProps, [authProps])}>
      {props.children}
    </FiltersContext.Provider>
  );
};

export { FiltersContext, FiltersProvider };
