import { useContext, useMemo } from "react";
import { Filters, Modal, MountTravellingForm, Section } from "../components";
import { SectionType } from "../interfaces";
import { FiltersContext, TravellingContext } from "../context";
import { generateQuery } from "../services";

export default function Tourist() {
  const { categories, selectedFilters } = useContext(FiltersContext);
  const { open, setOpen, setSelectedTravelling, setSelectedLocal } =
    useContext(TravellingContext);

  const sections: SectionType[] = useMemo(() => {
    if (selectedFilters.length > 0) {
      const commomQuery = generateQuery(
        selectedFilters.filter((filter) => filter.type === "commom")
      );

      const attractionQuery = generateQuery(
        selectedFilters.filter((filter) => filter.type === "attraction")
      );

      const establishmentQuery = generateQuery(
        selectedFilters.filter((filter) => filter.type === "establishment")
      );

      return [
        {
          title: "Atrativos selecionados",
          type: "attraction",
          queryParams: `${commomQuery}&${attractionQuery}`,
        },
        {
          title: "Estabelecimentos selecionados",
          type: "establishment",
          queryParams: `${commomQuery}&${establishmentQuery}`,
        },
      ];
    } else {
      return [
        {
          title: "Atrativos para você",
          type: "attraction",
          queryParams: `${generateQuery(categories)}`,
        },
        {
          title: "Atrativos mais bem avaliados",
          type: "attraction",
          queryParams: "averageRating=4.5",
        },
        {
          title: "Seleção de restaurantes e hotelaria",
          type: "establishment",
          queryParams: "categories=Hotel,Restaurante",
        },
      ];
    }
  }, [selectedFilters]);

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedTravelling(null);
    setSelectedLocal(null);
  };

  return (
    <div className="w-full h-full">
      <Modal
        title={
          <h1 className="font-semibold text-2xl w-full text-center text-auxiliary-beige">
            Adicionar ao{" "}
            <span className="text-secondary-light">StoryTravelling</span>
          </h1>
        }
        open={open}
        setOpen={setOpen}
      >
        <MountTravellingForm closeModal={handleCloseModal} />
      </Modal>
      <Filters />
      {sections.map((section, index) => {
        return <Section key={index} {...section} />;
      })}
    </div>
  );
}
