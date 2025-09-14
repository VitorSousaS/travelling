import { createContext, ReactNode, useMemo } from "react";
import { useLocal } from "./hooks";
import {
  AttractionType,
  EstablishmentType,
  ModalModeType,
} from "../interfaces";

interface LocalProviderProps {
  children: ReactNode;
}

type LocalType = {
  open: boolean;
  setOpen: (value: boolean) => void;
  mode: ModalModeType;
  setMode: (mode: ModalModeType) => void;
  selectedLocal: AttractionType | EstablishmentType | null;
  setSelectedLocal: (local: AttractionType | EstablishmentType | null) => void;
};

const initialValues = {
  open: false,
  mode: "create" as ModalModeType,
  selectedLocal: null,
};

const LocalContext = createContext({} as LocalType);

const LocalProvider = (props: LocalProviderProps) => {
  const authProps = useLocal(initialValues);

  return (
    <LocalContext.Provider value={useMemo(() => authProps, [authProps])}>
      {props.children}
    </LocalContext.Provider>
  );
};

export { LocalContext, LocalProvider };
