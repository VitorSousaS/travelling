import { Card, Popconfirm, message } from "antd";
import {
  AttractionType,
  EstablishmentType,
  LocalType,
} from "../../../interfaces";
import { useContext } from "react";
import { AuthContext, LocalContext } from "../../../context";
import { AxiosError } from "axios";
import {
  deleteAttraction,
  deleteEstablishment,
  queryClient,
} from "../../../services";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
const { Meta } = Card;

interface LocalCardProps {
  card: EstablishmentType | AttractionType;
  type: LocalType;
}

export const LocalCard: React.FC<LocalCardProps> = ({ card, type }) => {
  const navigate = useNavigate();

  const { user, UnauthorizeSession } = useContext(AuthContext);
  const { setMode, setOpen, setSelectedLocal } = useContext(LocalContext);

  const {
    mutate: mutateDeleteAttraction,
    isLoading: isLoadingDeleteAttraction,
  } = useMutation(deleteAttraction, {
    onSuccess: async () => {
      queryClient.setQueryData<AttractionType[] | undefined>(
        ["attractions-by-agency", user.id],
        (oldList) => {
          if (oldList) {
            // Encontrar o índice do elemento que deseja remover
            const indexToRemove = oldList.findIndex(
              (item) => item.id === card.id
            );

            if (indexToRemove !== -1) {
              // Se o elemento existe na lista, removê-lo
              const newList = [
                ...oldList.slice(0, indexToRemove),
                ...oldList.slice(indexToRemove + 1),
              ];
              return newList;
            } else {
              // Se o elemento não foi encontrado, retornar a lista existente
              return oldList;
            }
          } else {
            // Se a lista não existir, não há nada para remover
            return oldList;
          }
        }
      );
      message.info("Atração foi deletada!");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        UnauthorizeSession();
      } else {
        message.error("Desculpe, não foi possivel deletar, tente novamente!");
      }
    },
  });

  const {
    mutate: mutateDeleteEstablishment,
    isLoading: isLoadingDeleteEstablishment,
  } = useMutation(deleteEstablishment, {
    onSuccess: async () => {
      queryClient.setQueryData<EstablishmentType[] | undefined>(
        ["establishments-by-business", user.id],
        (oldList) => {
          if (oldList) {
            // Encontrar o índice do elemento que deseja remover
            const indexToRemove = oldList.findIndex(
              (item) => item.id === card.id
            );

            if (indexToRemove !== -1) {
              // Se o elemento existe na lista, removê-lo
              const newList = [
                ...oldList.slice(0, indexToRemove),
                ...oldList.slice(indexToRemove + 1),
              ];
              return newList;
            } else {
              // Se o elemento não foi encontrado, retornar a lista existente
              return oldList;
            }
          } else {
            // Se a lista não existir, não há nada para remover
            return oldList;
          }
        }
      );
      message.info("Estabelecimento foi deletado!");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        UnauthorizeSession();
      } else {
        message.error("Desculpe, não foi possivel deletar, tente novamente!");
      }
    },
  });

  const isLoading = isLoadingDeleteAttraction || isLoadingDeleteEstablishment;

  const DICT = {
    attraction: {
      title: "Deletar atração turistica.",
      subtitle: "Deseja deletar esta atração turistica?",
    },
    establishment: {
      title: "Deletar estabelecimento.",
      subtitle: "Deseja deletar este estabelecimento?",
    },
  };

  const onDelete = () => {
    if (type === "attraction") {
      mutateDeleteAttraction(card.id);
    } else if (type === "establishment") {
      mutateDeleteEstablishment(card.id);
    }
  };

  const onEdit = () => {
    setMode("edit");
    setSelectedLocal(card);
    setOpen(true);
  };

  const handleOpenDetails = () => {
    const queryParameters = { localId: card.id, type: type };
    const query = new URLSearchParams(queryParameters).toString();
    navigate({
      pathname: "/details",
      search: query,
    });
  };

  return (
    <Card
      className="w-auto max-w-xs xs:max-w-none xs:w-full"
      cover={
        <img
          src={card.banner}
          className="h-[13rem] w-full bg-primary-dark"
          alt="example"
          loading="lazy"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = "/img/logo-word.svg";
            currentTarget.className += " p-3";
          }}
        />
      }
      actions={[
        <i
          key="edit"
          className="fa-solid fa-pen-to-square text-auxiliary-info hover:opacity-75"
          onClick={onEdit}
        />,
        <Popconfirm
          title={DICT[type].title}
          description={DICT[type].subtitle}
          onConfirm={onDelete}
          placement="bottom"
          okButtonProps={{ style: { background: "#043419" } }}
          okText={isLoading ? "Deletando..." : "Sim"}
          cancelText="Não"
        >
          <i
            key="delete"
            className="fa-solid fa-trash text-auxiliary-error hover:opacity-75"
          />
        </Popconfirm>,
        <i
          key="details"
          className="fa-solid fa-arrow-up-right-from-square text-secondary-dark hover:opacity-75"
          onClick={handleOpenDetails}
        />,
      ]}
    >
      <Meta
        avatar={
          <div className="w-10 h-10 flex items-center justify-center bg-primary-light rounded-full">
            <i
              className={`text-secondary-light text-lg ${
                type === "attraction"
                  ? "fa-solid fa-person-walking-luggage"
                  : "fa-solid fa-bell-concierge"
              }`}
            />
          </div>
        }
        title={<p className="overflow-hidden w-[90%] truncate">{card.name}</p>}
        description={
          <p className="h-12 line-clamp-2 overflow-hidden w-[90%]">
            {card.location}
          </p>
        }
      />
    </Card>
  );
};
