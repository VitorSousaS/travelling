import { useMemo, useState } from "react";
import { AttractionType } from "../../interfaces";
import { useQuery } from "react-query";
import { getAttractionsByAgency } from "../../services";
import { AxiosError } from "axios";

type AgencyType = {
  attractions: AttractionType[];
};

export const useAgency = (initialValues: AgencyType) => {
  const [attractions, setAttractions] = useState<AttractionType[]>(
    initialValues.attractions
  );

  const getAttractions = (
    userId: string,
    onError: (error: AxiosError) => void
  ) => {
    const request_attractions = useMemo(() => {
      return {
        queryKey: ["attractions-by-agency", userId],
        queryFn: () => getAttractionsByAgency(userId),
        onError: (error: AxiosError) => onError(error),
      };
    }, [userId]);

    const { data, isLoading } = useQuery(request_attractions);

    return { data, isLoading };
  };

  return {
    attractions,
    setAttractions,
    getAttractions,
  };
};
