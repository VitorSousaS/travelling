import { useState } from "react";
import {
  AttractionType,
  EstablishmentType,
  ModalModeType,
  TravellingType,
} from "../../interfaces";

type TravellinProps = {
  open: boolean;
  mode: ModalModeType;
  selectedTravelling: TravellingType | null;
  activeTravelling: boolean;
  selectedLocal: AttractionType | EstablishmentType | null;
};

export const useTravelling = (initialValues: TravellinProps) => {
  const [open, setOpen] = useState<boolean>(initialValues.open);
  const [mode, setMode] = useState<ModalModeType>(initialValues.mode);
  const [selectedTravelling, setSelectedTravelling] =
    useState<TravellingType | null>(initialValues.selectedTravelling);
  const [activeTravelling, setActiveTravelling] = useState<boolean>(
    initialValues.activeTravelling
  );
  const [selectedLocal, setSelectedLocal] = useState<
    AttractionType | EstablishmentType | null
  >(initialValues.selectedLocal);

  return {
    open,
    setOpen,
    mode,
    setMode,
    selectedTravelling,
    setSelectedTravelling,
    selectedLocal,
    setSelectedLocal,
    activeTravelling,
    setActiveTravelling,
  };
};
