import {
  AttractionType,
  EstablishmentType,
  LocalType,
} from "../../../interfaces";

interface MoreDescriptionProps {
  type: LocalType;
  local: EstablishmentType | AttractionType;
}

type GeneralLocal = {
  leftTitle: string;
  leftInfo: string;
  rightTitle: string;
  rightInfo: string;
};

const getCurrentLocal = (
  local: MoreDescriptionProps["local"],
  type: LocalType
): GeneralLocal => {
  const baseLocal: GeneralLocal = {
    leftTitle: "",
    leftInfo: "",
    rightTitle: "",
    rightInfo: "",
  };

  switch (type) {
    case "attraction":
      const attraction = local as AttractionType;
      return {
        ...baseLocal,
        leftTitle: "O que você encontrará no atrativo:",
        leftInfo: attraction.foundInAttraction,
        rightTitle: "O que você não encontrará no atrativo:",
        rightInfo: attraction.notFoundInAttraction,
      };

    case "establishment":
      const establishment = local as EstablishmentType;
      return {
        ...baseLocal,
        leftTitle: "O que você encontrará no estabelecimento:",
        leftInfo: establishment.foundInEstablishment,
        rightTitle: "Outras informações:",
        rightInfo: establishment.otherInformation,
      };

    default:
      return baseLocal as GeneralLocal;
  }
};

export const MoreDescription: React.FC<MoreDescriptionProps> = (props) => {
  const currentLocal = getCurrentLocal(props.local, props.type);

  return (
    <div className="flex items-center py-6 gap-8 xs:flex-col sm:flex-col">
      <div className="flex-1 flex flex-col">
        <h3 className="text-primary-dark font-semibold text-2xl xs:text-center sm:text-center">
          {currentLocal.leftTitle}
        </h3>
        <p className="text-primary-light text-base py-3 xs:text-center sm:text-center">
          {currentLocal.leftInfo}
        </p>
      </div>
      <div className="flex-1 flex flex-col">
        <h3 className="text-primary-dark font-semibold text-2xl xs:text-center sm:text-center">
          {currentLocal.rightTitle}
        </h3>
        <p className="text-primary-light text-base py-3 xs:text-center sm:text-center">
          {currentLocal.rightInfo}
        </p>
      </div>
    </div>
  );
};
