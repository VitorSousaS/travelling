import { createContext, ReactNode, useMemo } from "react";
import { useTravelling } from "./hooks";
import {
  AttractionType,
  EstablishmentType,
  ModalModeType,
  TravellingType,
} from "../interfaces";

interface TravellingProviderProps {
  children: ReactNode;
}

type TravellingProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  mode: ModalModeType;
  setMode: (mode: ModalModeType) => void;
  selectedTravelling: TravellingType | null;
  setSelectedTravelling: (local: TravellingType | null) => void;
  activeTravelling: boolean;
  setActiveTravelling: (value: boolean) => void;
  selectedLocal: AttractionType | EstablishmentType | null;
  setSelectedLocal: (local: AttractionType | EstablishmentType | null) => void;
};

const initialValues = {
  open: false,
  mode: "create" as ModalModeType,
  selectedTravelling: null,
  activeTravelling: false,
  selectedLocal: null,
};

const TravellingContext = createContext({} as TravellingProps);

const TravellingProvider = (props: TravellingProviderProps) => {
  const authProps = useTravelling(initialValues);

  return (
    <TravellingContext.Provider value={useMemo(() => authProps, [authProps])}>
      {props.children}
    </TravellingContext.Provider>
  );
};

export { TravellingContext, TravellingProvider };
