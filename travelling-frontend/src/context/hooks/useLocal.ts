import { useState } from "react";
import {
  AttractionType,
  EstablishmentType,
  ModalModeType,
} from "../../interfaces";

type LocalType = {
  open: boolean;
  mode: ModalModeType;
  selectedLocal: AttractionType | EstablishmentType | null;
};

export const useLocal = (initialValues: LocalType) => {
  const [open, setOpen] = useState<boolean>(initialValues.open);
  const [mode, setMode] = useState<ModalModeType>(initialValues.mode);
  const [selectedLocal, setSelectedLocal] = useState<
    AttractionType | EstablishmentType | null
  >(initialValues.selectedLocal);

  return { open, setOpen, mode, setMode, selectedLocal, setSelectedLocal };
};
