import { useContext } from "react";
import { DefaultFiltersType } from "../../../interfaces";
import { FiltersContext } from "../../../context";
import { tv } from "tailwind-variants";
import _ from "lodash";

interface FilterChipProps {
  filter: DefaultFiltersType;
}

const button = tv({
  base: "flex items-center justify-center bg-transparent border border-secondary-dark rounded-full px-3 py-1 gap-2 select-none transition-all duration-200 hover:cursor-pointer hover:opacity-75",
  variants: {
    active: {
      true: "bg-secondary-dark text-auxiliary-beige",
      false: "bg-transparent text-secondary-dark",
    },
  },
});

export const FilterChip: React.FC<FilterChipProps> = ({ filter }) => {
  const { selectedFilters, setSelectedFilters } = useContext(FiltersContext);

  const handleApplyFilter = () => {
    // Verifique se já existe um filtro com a mesma chave
    const existingFilterIndex = selectedFilters.findIndex(
      (filter) => filter.filterKey === filter.filterKey
    );

    if (existingFilterIndex !== -1 && !_.isEmpty(filter.value)) {
      // Se já existe um filtro mas o valor é vazio, remova-o da lista
      setSelectedFilters((selected) => {
        const updatedFilters = selected.filter(
          (_, index) => index !== existingFilterIndex
        );
        return updatedFilters;
      });
    } else {
      // Caso contrário, adicione o novo filtro à lista
      setSelectedFilters((selected) => [...selected, filter]);
    }
  };

  return (
    <button
      className={button({
        active: selectedFilters.some((f) => f.value === filter.value),
      })}
      onClick={handleApplyFilter}
    >
      <i className={`${filter.icon}`} />
      <p className="text-sm">{filter.label}</p>
    </button>
  );
};
