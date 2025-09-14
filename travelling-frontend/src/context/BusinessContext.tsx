import { createContext, ReactNode, useMemo } from "react";
import { useBusiness } from "./hooks";
import { EstablishmentType } from "../interfaces";
import { AxiosError } from "axios";

interface BusinessProviderProps {
  children: ReactNode;
}

type BusinessType = {
  establishments: EstablishmentType[];
  setEstablishments: (establishments: EstablishmentType[]) => void;
  getEstablishments: (
    userId: string,
    onError: (error: AxiosError) => void
  ) => {
    data: EstablishmentType[];
    isLoading: boolean;
  };
};

const initialValues = {
  establishments: [],
};

const BusinessContext = createContext({} as BusinessType);

const BusinessProvider = (props: BusinessProviderProps) => {
  const BusinessProps = useBusiness(initialValues);

  return (
    <BusinessContext.Provider
      value={useMemo(() => BusinessProps, [BusinessProps])}
    >
      {props.children}
    </BusinessContext.Provider>
  );
};

export { BusinessContext, BusinessProvider };
