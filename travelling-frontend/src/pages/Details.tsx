import { useContext, useMemo } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import {
  CarouselMedias,
  Header,
  Loading,
  MoreDescription,
  ChipList,
  Contact,
} from "../components";
import {
  getAttractionById,
  getCategories,
  getEstablishmentById,
  setterCategoriesFromId,
  transformStringToOptions,
} from "../services";
import { AttractionType, EstablishmentType, LocalType } from "../interfaces";
import { AxiosError } from "axios";
import { message } from "antd";
import { AuthContext } from "../context";

export default function Details() {
  const { UnauthorizeSession } = useContext(AuthContext);

  const [searchParams] = useSearchParams();

  const localId = searchParams.get("localId");

  const type = (searchParams.get("type") ?? "attraction") as LocalType;

  const request_categories = useMemo(() => {
    return {
      queryKey: ["categories"],
      queryFn: () => getCategories(),
      onError: (error: AxiosError) => {
        if (error.response?.status === 500) {
          message.error(
            "Não foi possível carregar as categorias, tente novamente!"
          );
        }
      },
    };
  }, []);

  const { data: categories, isLoading: isLoadingCategories } =
    useQuery(request_categories);

  const request_attraction = useMemo(() => {
    return {
      queryKey: ["attraction-by-id", localId],
      enabled: !!localId && type === "attraction",
      queryFn: () => getAttractionById(localId ?? ""),
      onError: (error: AxiosError) => {
        if (error.response?.status === 500) {
          message.error(
            "Não foi possível carregar as atrações, tente novamente!"
          );
        } else if (error.response?.status === 401) {
          UnauthorizeSession();
        }
      },
    };
  }, [localId, type]);

  const { data: attraction, isLoading: isLoadingAttraction } =
    useQuery(request_attraction);

  const request_establishment = useMemo(() => {
    return {
      queryKey: ["establishments-by-id", localId],
      enabled: !!localId && type === "establishment",
      queryFn: () => getEstablishmentById(localId ?? ""),
      onError: (error: AxiosError) => {
        if (error.response?.status === 500) {
          message.error(
            "Não foi possível carregar os estabelecimentos, tente novamente!"
          );
        } else if (error.response?.status === 401) {
          UnauthorizeSession();
        }
      },
    };
  }, [localId, type]);

  const { data: establishment, isLoading: isLoadingEstablishment } = useQuery(
    request_establishment
  );

  const local = attraction || establishment;

  const isLoading =
    isLoadingAttraction || isLoadingEstablishment || isLoadingCategories;

  if (isLoading) return <Loading />;

  const defaultProps = {
    local,
    type,
  };

  return (
    <div className="flex-1 p-8 xs:p-6">
      <Header {...defaultProps} />
      <CarouselMedias
        title="Mais fotos do local:"
        medias={local.generalMedias}
      />
      <MoreDescription {...defaultProps} />
      {type === "establishment" && (
        <CarouselMedias
          title="Serviços ofertados:"
          medias={(local as EstablishmentType).menuOfServicesMedia}
        />
      )}
      <ChipList
        title="Categorias vinculadas"
        chips={setterCategoriesFromId(local.categories, categories?.data) ?? []}
      />
      {type === "attraction" && (
        <ChipList
          title="Se praparar para o atrativo:"
          chips={
            transformStringToOptions((local as AttractionType).whatToTake) ?? []
          }
        />
      )}
      {type === "attraction" && <Contact local={local} />}
    </div>
  );
}
