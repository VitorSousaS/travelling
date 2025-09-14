import React, { useContext } from "react";
import { ContractStatus, LabelStatus } from "./Status";
import { Dropdown, MenuProps, Rate, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  ContractStatusType,
  ContractType,
  UserType,
} from "../../../interfaces";
import {
  createRatingToAttraction,
  editContract,
  editRatingToAttraction,
  formatDate,
  queryClient,
} from "../../../services";
import { AuthContext } from "../../../context";
import { useMutation } from "react-query";
import { AxiosError } from "axios";

interface ActionProps {
  user: UserType;
  card: ContractType;
  UnauthorizeSession: () => void;
}

interface ContractCardProps {
  card: ContractType;
}

const Header: React.FC<ContractCardProps> = ({ card }) => {
  return (
    <div className="flex flex-col gap-2 mr-4 xs:mr-0 xs:py-2 sm:py-2 sm:mr-0 md:w-1/2 lg:w-1/2">
      <p className="text-primary-dark text-2xl font-semibold xs:text-center sm:text-center">
        {card.attraction.name}
      </p>
      <div className="flex items-center gap-2">
        <i className="fa-solid fa-location-dot text-primary-light" />
        <p className="text-primary-light text-sm xs:text-center sm:text-center">
          {card.attraction.location}
        </p>
      </div>
    </div>
  );
};

const DateOfRequest: React.FC<ContractCardProps> = ({ card }) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-primary-dark text-sm xs:text-sm xs:text-center sm:text-sm sm:text-center">
        Data do pedido:
      </p>
      <div className="flex items-center gap-2">
        <i className="fa-solid fa-calendar text-primary-light" />
        <p className="text-primary-light font-medium xs:text-sm xs:text-center sm:text-sm sm:text-center">
          {formatDate(card.createdAt)}
        </p>
      </div>
    </div>
  );
};

const DateOfContract: React.FC<ContractCardProps> = ({ card }) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-primary-dark text-sm xs:text-sm xs:text-center sm:text-sm sm:text-center">
        Data do passeio:
      </p>
      <div className="flex items-center gap-2">
        <i className="fa-solid fa-calendar text-primary-light" />
        <p className="text-primary-light font-medium xs:text-sm xs:text-center sm:text-sm sm:text-center">
          {formatDate(card.attraction.date)}
        </p>
      </div>
    </div>
  );
};

const Action: React.FC<ActionProps> = ({ card, user, UnauthorizeSession }) => {
  const navigate = useNavigate();

  const ratingByTourist = card.attraction.ratings?.find(
    (rating) => rating.touristId === user.id
  );

  const { mutate: mutateCreateRating } = useMutation(createRatingToAttraction, {
    onSuccess: async (response) => {
      queryClient.setQueryData<ContractType[] | undefined>(
        ["contracts", user.id],
        (oldList) => {
          if (oldList) {
            const updatedList = oldList.map((item) => {
              if (
                item.touristId === response.data.touristId &&
                item.attractionId === response.data.attractionId
              ) {
                // Atualizar o item correspondente com os novos dados de 'response.data'
                let updatedItem = { ...item };
                updatedItem.attraction.ratings = [response.data];
                return { ...item, ...updatedItem };
              }
              return item;
            });

            return updatedList;
          } else {
            return [];
          }
        }
      );
      message.success("Obrigado por avaliar a atração turistica!");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        UnauthorizeSession();
      } else {
        message.error(
          "Desculpe, não foi possivel atribuir a nota, tente novamente!"
        );
      }
    },
  });

  const { mutate: mutateEditRating } = useMutation(editRatingToAttraction, {
    onSuccess: async (response) => {
      queryClient.setQueryData<ContractType[] | undefined>(
        ["contracts", user.id],
        (oldList) => {
          if (oldList) {
            const updatedList = oldList.map((item) => {
              if (
                item.touristId === response.data.touristId &&
                item.attractionId === response.data.attractionId
              ) {
                // Atualizar o item correspondente com os novos dados de 'response.data'
                let updatedItem = { ...item };
                updatedItem.attraction.ratings = [response.data];
                return { ...item, ...updatedItem };
              }
              return item;
            });

            return updatedList;
          } else {
            return [];
          }
        }
      );
      message.success("Obrigado por avaliar a atração turistica!");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        UnauthorizeSession();
      } else {
        message.error(
          "Desculpe, não foi possivel atribuir a nota, tente novamente!"
        );
      }
    },
  });

  const handleOpenDetails = () => {
    const queryParameters = { localId: card.attractionId, type: "attraction" };
    const query = new URLSearchParams(queryParameters).toString();
    navigate({
      pathname: "/details",
      search: query,
    });
  };

  const handleAtributeRating = (value: number) => {
    if (!!ratingByTourist?.value) {
      mutateEditRating({
        value,
        attractionId: card.attractionId,
        touristId: user.id,
      });
    } else {
      mutateCreateRating({
        value,
        attractionId: card.attractionId,
        touristId: user.id,
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 xs:w-full xs:items-center xs:pb-2 sm:w-full sm:pb-2 sm:items-center md:w-full lg:w-full">
      {user.userRole === "TOURIST" && card.status === "FINISHED" && (
        <Rate
          value={ratingByTourist?.value ?? 0}
          onChange={handleAtributeRating}
        />
      )}
      {user.userRole === "AGENCY" && (
        <div className="flex flex-col">
          <h3 className="text-primary-dark text-sm xs:text-center sm:text-center">
            Cliente:
          </h3>
          <p className="text-secondary-dark font-medium xs:text-center sm:text-center">
            {card.tourist.user.name} {card.tourist.lastname}
          </p>
        </div>
      )}
      <div
        className="flex items-center gap-2 transition duration-200 hover:cursor-pointer hover:opacity-75"
        onClick={handleOpenDetails}
      >
        <p className="text-primary-dark font-semibold xs:text-center sm:text-center">
          Ver Detalhes
        </p>
        <i className="fa-solid fa-arrow-up-right-from-square text-primary-dark" />
      </div>
    </div>
  );
};

export const ContractCard: React.FC<ContractCardProps> = ({ card }) => {
  const { user, UnauthorizeSession } = useContext(AuthContext);

  const { mutate: mutateEditContract, isLoading: isLoadingEdit } = useMutation(
    editContract,
    {
      onSuccess: async (response) => {
        queryClient.setQueryData<ContractType[] | undefined>(
          ["contracts", user.id],
          (oldList) => {
            if (oldList) {
              const updatedList = oldList.map((item) => {
                if (item.id === response.data.id) {
                  // Atualizar o item correspondente com os novos dados de 'response.data'
                  return { ...item, ...response.data };
                }
                return item;
              });

              return updatedList;
            } else {
              return [];
            }
          }
        );
        message.success("Edição realizada com sucesso!");
      },
      onError: (error: AxiosError) => {
        if (error.response?.status === 401) {
          UnauthorizeSession();
        } else {
          message.error("Desculpe, não foi possivel editar, tente novamente!");
        }
      },
    }
  );

  const handleEditContractStatus = (selectedStatus: ContractStatusType) => {
    mutateEditContract({ status: selectedStatus, contractId: card.id });
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <LabelStatus status="CONFIRMED" />,
      onClick: () => handleEditContractStatus("CONFIRMED"),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: <LabelStatus status="PENDING" />,
      onClick: () => handleEditContractStatus("PENDING"),
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: <LabelStatus status="CANCELED" />,
      onClick: () => handleEditContractStatus("CANCELED"),
    },
    {
      type: "divider",
    },
    {
      key: "4",
      label: <LabelStatus status="FINISHED" />,
      onClick: () => handleEditContractStatus("FINISHED"),
    },
  ];

  return (
    <div className="relative bg-zinc-50 h-32 w-full flex items-center rounded-lg shadow-md xs:h-full xs:flex-col xs:max-w-xs sm:max-w-sm sm:h-full sm:flex-col md:h-48 lg:h-48">
      <Dropdown
        menu={{ items }}
        trigger={["click"]}
        disabled={user.userRole !== "AGENCY"}
        getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
      >
        {ContractStatus({ status: card.status, loading: isLoadingEdit })}
      </Dropdown>

      <img
        className="w-32 h-full rounded-lg xs:w-full xs:h-44 sm:w-full sm:h-44 md:w-36 lg:w-48"
        src={card.attraction.banner}
        alt="Banner"
        loading="lazy"
      />

      <div className="w-full h-full flex items-center justify-between px-8 xs:flex-col xs:p-4 sm:p-4 sm:flex-col md:px-4">
        <Header card={card} />

        <div className="flex items-center gap-8 xs:flex-col sm:flex-col">
          <div className="flex items-center gap-10 xs:w-full xs:gap-6 xs:mt-3 sm:mt-3 sm:w-full sm:gap-6 md:flex-col md:gap-6 md:w-full lg:flex-col lg:gap-6 lg:w-full">
            <DateOfRequest card={card} />
            <DateOfContract card={card} />
          </div>

          <Action
            card={card}
            user={user}
            UnauthorizeSession={UnauthorizeSession}
          />
        </div>
      </div>
    </div>
  );
};
