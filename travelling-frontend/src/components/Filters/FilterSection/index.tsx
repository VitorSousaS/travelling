import { useContext, useEffect, useMemo, useState } from "react";
import {
  Button,
  Divider,
  HourField,
  InputableField,
  MultiSelectField,
  RangeDateField,
  RangeField,
  SlideField,
} from "../..";
import {
  CategoryType,
  FilterLocalType,
  SelectedFilterType,
} from "../../../interfaces";
import {
  getCategories,
  setterCategoriesFromIdString,
  transformCategoriesToOptions,
  transformStringToOptions,
} from "../../../services";
import { AxiosError } from "axios";
import { Spin, message } from "antd";
import { useQuery } from "react-query";
import { FiltersContext } from "../../../context";
import _ from "lodash";

interface FilterSectionProps {
  handleChange: (
    value: string | string[],
    filterKey: string,
    type: FilterLocalType
  ) => void;
  getFilterValue: (filterKey: string) => string | string[] | undefined;
  categories: CategoryType[];
}

const CommomSection: React.FC<FilterSectionProps> = ({
  categories,
  getFilterValue,
  handleChange,
}) => {
  const type = "commom";

  return (
    <div className="flex flex-col">
      <h3 className="text-lg text-secondary-light font-medium">Geral</h3>
      <Divider />
      <div className="flex flex-col gap-6">
        <div className="flex gap-6 xs:flex-col sm:flex-col">
          <InputableField
            id="name"
            label="Nome"
            placeholder="Nascente azul"
            value={getFilterValue("name") ?? ""}
            onChange={(e) => handleChange(e.target.value, "name", type)}
          />
          <InputableField
            id="location"
            label="Localização"
            placeholder="Bonito"
            value={getFilterValue("location") ?? ""}
            onChange={(e) => handleChange(e.target.value, "location", type)}
          />
        </div>
        <MultiSelectField
          id="categories"
          label="Categorias"
          placeholder="Categorias"
          value={
            setterCategoriesFromIdString(
              getFilterValue("categories") as string[],
              categories
            ) ?? []
          }
          defaultSelected={
            setterCategoriesFromIdString(
              getFilterValue("categories") as string[],
              categories
            ) ?? []
          }
          onChange={(value) =>
            handleChange(
              value.map((item) => item.label),
              "categories",
              type
            )
          }
          options={transformCategoriesToOptions(categories)}
        />

        <RangeField
          label="Faixa de preço"
          min={0}
          max={25000}
          minLabel="R$ 0,00"
          maxLabel="R$ 25.000,00"
          value={[
            Number(getFilterValue("minPrice")),
            Number(getFilterValue("maxPrice")),
          ]}
          onChange={(value) => {
            handleChange(value[0]?.toString(), "minPrice", type);
            handleChange(value[1]?.toString(), "maxPrice", type);
          }}
        />
        <SlideField
          label="Avaliação"
          min={0}
          max={5}
          minLabel="0"
          maxLabel="5"
          value={Number(getFilterValue("averageRating"))}
          onChange={(value) =>
            handleChange(value.toString(), "averageRating", type)
          }
        />
      </div>
    </div>
  );
};

const AttractionSection: React.FC<FilterSectionProps> = ({
  getFilterValue,
  handleChange,
}) => {
  const type = "attraction";

  return (
    <div className="flex flex-col">
      <h3 className="text-lg text-secondary-light font-medium">Atrações</h3>
      <Divider />
      <div className="flex gap-6 xs:flex-col sm:flex-col">
        <InputableField
          id="interprise"
          label="Nome da agência"
          placeholder="Nome da agência"
          value={getFilterValue("interprise") ?? ""}
          onChange={(e) => handleChange(e.target.value, "interprise", type)}
        />
        <RangeDateField
          label="Data"
          value={[
            getFilterValue("startDate") as string,
            getFilterValue("endDate") as string,
          ]}
          onChange={(value) => {
            handleChange(value[0], "startDate", type);
            handleChange(value[1], "endDate", type);
          }}
        />
      </div>
    </div>
  );
};

const EstablishmentSection: React.FC<FilterSectionProps> = ({
  getFilterValue,
  handleChange,
}) => {
  const type = "establishment";

  return (
    <div className="flex flex-col">
      <h3 className="text-lg text-secondary-light font-medium">
        Estabelecimentos
      </h3>
      <Divider />

      <div className="flex gap-6 xs:flex-col sm:flex-col">
        <MultiSelectField
          id="openDays"
          label="Dias de funcionamento"
          value={
            transformStringToOptions(getFilterValue("openDays") as string[]) ??
            []
          }
          defaultSelected={
            transformStringToOptions(getFilterValue("openDays") as string[]) ??
            []
          }
          onChange={(value) =>
            handleChange(
              value.map((item) => item.value),
              "openDays",
              type
            )
          }
          placeholder="Dias de funcionamento"
          options={[
            { label: "Segunda", value: "Segunda" },
            { label: "Terça", value: "Terça" },
            { label: "Quarta", value: "Quarta" },
            { label: "Quinta", value: "Quinta" },
            { label: "Sexta", value: "Sexta" },
            { label: "Sábado", value: "Sábado" },
            { label: "Domingo", value: "Domingo" },
          ]}
        />
        <HourField
          label="Horário aberto"
          value={(getFilterValue("openHours") as string) ?? ""}
          onChange={(value) => handleChange(value, "openHours", type)}
        />
      </div>
    </div>
  );
};

export const FilterSection: React.FC = () => {
  const { selectedFilters, setOpenModal, setSelectedFilters } =
    useContext(FiltersContext);

  const [selected, setSelected] = useState<SelectedFilterType[]>([]);

  useEffect(() => {
    setSelected(selectedFilters);
  }, [selectedFilters]);

  const changeFilters = (newFilter: SelectedFilterType) => {
    // Verifique se já existe um filtro com a mesma chave
    const existingFilterIndex = selected.findIndex(
      (filter) => filter.filterKey === newFilter.filterKey
    );

    if (existingFilterIndex !== -1 && !_.isEmpty(newFilter.value)) {
      // Se já existe um filtro com a mesma chave, substitua-o
      setSelected((selected) => {
        const updatedFilters = [...selected];
        updatedFilters[existingFilterIndex] = newFilter;
        return updatedFilters;
      });
    } else if (existingFilterIndex !== -1 && _.isEmpty(newFilter.value)) {
      // Se já existe um filtro mas o valor é vazio, remova-o da lista
      setSelected((selected) => {
        const updatedFilters = selected.filter(
          (_, index) => index !== existingFilterIndex
        );
        return updatedFilters;
      });
    } else {
      // Caso contrário, adicione o novo filtro à lista
      setSelected((selected) => [...selected, newFilter]);
    }
  };

  const request_categories = useMemo(() => {
    return {
      queryKey: ["categories"],
      queryFn: () => getCategories(),
      onError: (error: AxiosError) => {
        if (error.response?.status === 500) {
          message.error(
            "Não foi possível carregar as categorias, tente novamente!"
          );
        }
      },
    };
  }, []);

  const { data: categories, isLoading: isLoadingCategories } =
    useQuery(request_categories);

  const getFilterValue = (filterKey: string) => {
    const filter = selected.find((filter) => filter.filterKey === filterKey);

    if (filter) return filter.value;
  };

  const handleChange = (
    value: string | string[],
    filterKey: string,
    type: FilterLocalType
  ) => {
    const newFilter: SelectedFilterType = {
      label: filterKey,
      filterKey,
      value,
      type,
    };
    changeFilters(newFilter);
  };

  const onApplyFilters = () => {
    setSelectedFilters(selected);
    setOpenModal(false);
  };

  const handleClear = () => {
    setSelected([]);
    setSelectedFilters([]);
    setOpenModal(false);
  };

  if (isLoadingCategories) return <Spin size="large" />;

  const defaultProps = {
    handleChange,
    getFilterValue,
    categories: categories?.data,
  };

  return (
    <div className="flex flex-col">
      <div className="max-h-[40rem] overflow-y-scroll p-6 flex flex-col gap-6 overflow-x-hidden">
        <CommomSection {...defaultProps} />
        <EstablishmentSection {...defaultProps} />
        <AttractionSection {...defaultProps} />
      </div>
      <footer className="flex items-center justify-end gap-2">
        <Button
          key="back"
          label="Limpar"
          onConfirm={handleClear}
          className="w-fit py-1 bg-transparent border border-secondary-light text-secondary-light"
        />
        <Button
          key="submit"
          label="Aplicar"
          onConfirm={onApplyFilters}
          className="w-fit py-1"
        />
      </footer>
    </div>
  );
};
