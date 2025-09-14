import { useMemo, useState } from "react";
import { EstablishmentType } from "../../interfaces";
import { useQuery } from "react-query";
import { getEstablishmentsByBusiness } from "../../services";
import { AxiosError } from "axios";

type BusinessType = {
  establishments: EstablishmentType[];
};

export const useBusiness = (initialValues: BusinessType) => {
  const [establishments, setEstablishments] = useState<EstablishmentType[]>(
    initialValues.establishments
  );

  const getEstablishments = (
    userId: string,
    onError: (error: AxiosError) => void
  ) => {
    const request_establishments = useMemo(() => {
      return {
        queryKey: ["establishments-by-business", userId],
        queryFn: () => getEstablishmentsByBusiness(userId),
        onError: (error: AxiosError) => onError(error),
      };
    }, [userId]);

    const { data, isLoading } = useQuery(request_establishments);

    return { data, isLoading };
  };

  return {
    establishments,
    setEstablishments,
    getEstablishments,
  };
};
