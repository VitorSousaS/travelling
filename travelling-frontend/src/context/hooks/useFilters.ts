import { useEffect, useState } from "react";
import { CategoryType, FilterContextType } from "../../interfaces";
import { Forage, generateQuery } from "../../services";

type FiltersType = {
  selectedFilters: FilterContextType["selectedFilters"];
  categories: FilterContextType["selectedFilters"];
  defaultSelectedFilters: FilterContextType["defaultSelectedFilters"];
  query: FilterContextType["query"];
  prevQuery: FilterContextType["prevQuery"];
  openModal: boolean;
};

export const useFilters = (initialValues: FiltersType) => {
  const KEY_FILTERS_FORAGE = "filters";

  const [openModal, setOpenModal] = useState(initialValues.openModal);
  const [selectedFilters, setSelectedFilters] = useState(
    initialValues.selectedFilters
  );
  const [defaultSelectedFilters, setDefaultSelectedFilters] = useState(
    initialValues.defaultSelectedFilters
  );
  const [query, setQuery] = useState(initialValues.query);
  const [prevQuery, setPrevQuery] = useState(initialValues.prevQuery);
  const [categories, setCategories] = useState(initialValues.categories);

  const setInitialFilters = async () => {
    const filtersForage = await getFiltersForage();

    const categoriesForage = await getCategoriesForage();

    const isEmptyCategories =
      categoriesForage === null ||
      Object.keys(categoriesForage ?? {}).length === 0;

    if (!isEmptyCategories) {
      setCategories([
        {
          filterKey: "categories",
          value: categoriesForage.map((item) => item.id),
          label: "categories",
        },
      ]);
    }

    const isEmptyObject =
      filtersForage === null || Object.keys(filtersForage ?? {}).length === 0;

    if (!isEmptyObject) {
      const params = generateQuery(filtersForage);
      setSelectedFilters(filtersForage);
      setDefaultSelectedFilters([]);
      setQuery(params);
      setPrevQuery({ current: params });
    } else {
      const params = generateQuery(defaultSelectedFilters);
      setSelectedFilters(defaultSelectedFilters);
      setQuery(params);
      setPrevQuery({ current: params });
    }
  };

  useEffect(() => {
    setInitialFilters();
  }, []);

  const setFiltersForage = (filters: FilterContextType["selectedFilters"]) => {
    Forage.setForageFilters(KEY_FILTERS_FORAGE, filters);
  };

  const getFiltersForage = async () => {
    return (await Forage.getForageFilters(
      KEY_FILTERS_FORAGE
    )) as FilterContextType["selectedFilters"];
  };

  const getCategoriesForage = async (): Promise<CategoryType[]> => {
    return await Forage.getForageCategories();
  };

  const validateQuery = () => {
    if (query !== prevQuery.current) {
      setPrevQuery({ current: query });
    }
  };

  const restoreSession = async () => {
    setInitialFilters();
  };

  return {
    openModal,
    setOpenModal,
    selectedFilters,
    setSelectedFilters,
    query,
    setQuery,
    prevQuery,
    categories,
    setCategories,
    setPrevQuery,
    validateQuery,
    setInitialFilters,
    defaultSelectedFilters,
    setDefaultSelectedFilters,
    setFiltersForage,
    getFiltersForage,
    restoreSession,
  };
};
