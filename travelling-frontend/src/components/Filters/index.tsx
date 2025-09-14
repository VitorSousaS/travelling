import { useContext } from "react";
import { tv } from "tailwind-variants";
import { Button, Modal } from "..";
import { AuthContext, FiltersContext, TravellingContext } from "../../context";
import { DefaultFiltersType } from "../../interfaces";
import { FilterChip } from "./FilterChip";
import { FilterSection } from "./FilterSection";
import { Badge } from "antd";

interface FiltersProps {}

const button = tv({
  base: "w-fit px-6 py-2 flex gap-2 border border-transparent xs:text-sm xs:px-3",
  variants: {
    active: {
      true: "bg-primary-light text-secondary-light",
      false: "bg-transparent text-primary-light border-primary-light",
    },
  },
});

const defaultFilters: DefaultFiltersType[] = [
  {
    label: "Trilha",
    filterKey: "categories",
    type: "commom",
    value: ["Trilha"],
    icon: "fa-solid fa-person-hiking",
  },
  {
    label: "Para mergulhar",
    filterKey: "categories",
    type: "commom",
    value: ["Mergulho"],
    icon: "fa-solid fa-person-swimming",
  },
  {
    label: "Restaurantes",
    filterKey: "categories",
    type: "commom",
    value: ["Restaurante"],
    icon: "fa-solid fa-utensils",
  },
  {
    label: "Hotéis",
    filterKey: "categories",
    type: "commom",
    value: ["Hotel"],
    icon: "fa-solid fa-hotel",
  },
];

export const Filters: React.FC<FiltersProps> = ({}) => {
  const { user } = useContext(AuthContext);

  const { openModal, setOpenModal, selectedFilters } =
    useContext(FiltersContext);

  const { activeTravelling, setActiveTravelling } =
    useContext(TravellingContext);

  const handleOpenFilter = () => {
    setOpenModal(true);
  };

  return (
    <header className="px-8 py-6 flex items-center justify-between xs:flex-col xs:gap-4 xs:items-start sm:flex-col sm:gap-4 sm:items-start md:flex-col md:gap-4 md:items-start">
      <Modal
        title={
          <h1 className="font-semibold text-2xl w-full text-center text-auxiliary-beige">
            Outros <span className="text-secondary-light">Filtros</span>
          </h1>
        }
        open={openModal}
        setOpen={setOpenModal}
      >
        <FilterSection />
      </Modal>

      {user.userRole === "TOURIST" && (
        <Button
          className={button({ active: activeTravelling })}
          label="Montar StoryTravelling"
          onConfirm={() => setActiveTravelling(!activeTravelling)}
          startIcon={<i className="fa-solid fa-bars-staggered" />}
        />
      )}

      <div className="ml-auto flex items-center justify-end gap-1 xs:ml-0 xs:gap-3 xs:justify-start xs:flex-grow xs:flex-wrap sm:ml-0 sm:gap-3 sm:justify-start sm:flex-grow sm:flex-wrap md:ml-0">
        {defaultFilters.map((filter, index) => {
          return <FilterChip key={index} filter={filter} />;
        })}
        <Badge count={selectedFilters.length}>
          <button
            className="flex items-center justify-center bg-transparent border border-primary-light rounded-full px-3 py-1 gap-2 select-none transition-all duration-200 hover:cursor-pointer hover:opacity-75"
            onClick={handleOpenFilter}
          >
            <i className="fa-solid fa-filter text-primary-light" />
            <p className="text-primary-light text-sm">Mais filtros</p>
          </button>
        </Badge>
      </div>
    </header>
  );
};
