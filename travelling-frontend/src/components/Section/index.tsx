import { useMemo } from "react";
import { useQuery } from "react-query";
import { SectionType } from "../../interfaces";
import { getAttractions, getEstablishments } from "../../services";
import { Loading, SnapCarousel, SwitchComponents } from "..";
import { AxiosError } from "axios";
import { message } from "antd";

export const Section: React.FC<SectionType> = ({
  title,
  type,
  queryParams,
}) => {
  const request_attractions = useMemo(() => {
    return {
      queryKey: ["attractions", type, queryParams],
      queryFn: () => getAttractions(queryParams),
      enabled: type === "attraction",
      onError: (error: AxiosError) => {
        if (error.response?.status === 500) {
          message.error(
            "Não foi possível carregar as atrações, tente novamente!"
          );
        }
      },
    };
  }, [queryParams, type]);

  const request_establishments = useMemo(() => {
    return {
      queryKey: ["establishments", type, queryParams],
      queryFn: () => getEstablishments(queryParams),
      enabled: type === "establishment",
      onError: (error: AxiosError) => {
        if (error.response?.status === 500) {
          message.error(
            "Não foi possível carregar os estabelecimentos, tente novamente!"
          );
        }
      },
    };
  }, [queryParams, type]);

  const { data: attractions, isLoading: isLoadingAttraction } =
    useQuery(request_attractions);

  const { data: establishments, isLoading: isLoadingEstablishment } = useQuery(
    request_establishments
  );

  const isLoading = isLoadingAttraction || isLoadingEstablishment;

  if (isLoading) return <Loading />;

  return (
    <div className="px-8 my-8">
      <h2 className="text-primary-dark font-semibold text-2xl pb-4">{title}</h2>
      <SwitchComponents active={type}>
        <SnapCarousel name="attraction" locals={attractions?.data ?? []} />
        <SnapCarousel
          name="establishment"
          locals={establishments?.data ?? []}
        />
      </SwitchComponents>
    </div>
  );
};
