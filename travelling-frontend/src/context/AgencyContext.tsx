import { createContext, ReactNode, useMemo } from "react";
import { useAgency } from "./hooks";
import { AttractionType } from "../interfaces";
import { AxiosError } from "axios";

interface AgencyProviderProps {
  children: ReactNode;
}

type AgencyType = {
  attractions: AttractionType[];
  setAttractions: (attractions: AttractionType[]) => void;
  getAttractions: (
    userId: string,
    onError: (error: AxiosError) => void
  ) => {
    data: AttractionType[];
    isLoading: boolean;
  };
};

const initialValues = {
  attractions: [],
};

const AgencyContext = createContext({} as AgencyType);

const AgencyProvider = (props: AgencyProviderProps) => {
  const agencyProps = useAgency(initialValues);

  return (
    <AgencyContext.Provider value={useMemo(() => agencyProps, [agencyProps])}>
      {props.children}
    </AgencyContext.Provider>
  );
};

export { AgencyContext, AgencyProvider };
