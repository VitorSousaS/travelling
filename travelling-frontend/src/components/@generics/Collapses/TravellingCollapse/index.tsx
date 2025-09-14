import { Collapse, CollapseProps, Empty, Popconfirm, message } from "antd";
import {
  AttractionType,
  EstablishmentType,
  TravellingType,
} from "../../../../interfaces";
import { SnapCarouselReorder } from "../..";
import {
  deleteTravelling,
  editTravelling,
  queryClient,
  sortLocalsByPosition,
} from "../../../../services";
import { useMutation } from "react-query";
import { useContext, useState } from "react";
import { AuthContext, TravellingContext } from "../../../../context";
import { AxiosError } from "axios";
import { tv } from "tailwind-variants";

interface TravellingCollapseProps {
  travellings: TravellingType[];
}

interface CustomPanelProps {
  travelling: TravellingType;
  isReorderMode: boolean;
}

const CustomPanel: React.FC<CustomPanelProps> = ({
  travelling,
  isReorderMode,
}) => {
  const { user, UnauthorizeSession } = useContext(AuthContext);

  const { mutate: mutateEditTravelling } = useMutation(editTravelling, {
    onSuccess: async (response) => {
      queryClient.setQueryData<TravellingType[] | undefined>(
        ["travellings", user.id],
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
      message.success("O StoryTravelling foi modificado com sucesso!");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        UnauthorizeSession();
      } else {
        message.error("Desculpe, não foi possivel modificar a ordem!");
      }
    },
  });

  const handleChangeOrderTravelling = (
    orderedLocals: (AttractionType | EstablishmentType)[]
  ) => {
    const updatedLocals = orderedLocals.map((local, index) => {
      return {
        localId: local.id,
        type: local.type,
        position: index,
      };
    });
    const travellingData = { title: travelling.title, locals: updatedLocals };

    mutateEditTravelling({ travellingData, travellingId: travelling.id });
  };

  const handleRemoveLocalFromTravelling = (
    removeLocal: AttractionType | EstablishmentType
  ) => {
    const filteredTravellings = travelling.locals.filter(
      (local) => local[local.type].id !== removeLocal.id
    );

    const updatedLocals = filteredTravellings.map((local, index) => {
      return {
        localId: local[local.type].id,
        type: local.type,
        position: index,
      };
    });

    const travellingData = { title: travelling.title, locals: updatedLocals };

    mutateEditTravelling({ travellingData, travellingId: travelling.id });
  };

  return (
    <div>
      {travelling && travelling.locals.length > 0 ? (
        <div className="w-full">
          <SnapCarouselReorder
            name="travelling"
            locals={sortLocalsByPosition(travelling.locals)}
            onChange={handleChangeOrderTravelling}
            onRemoveLocal={handleRemoveLocalFromTravelling}
            isReorderMode={isReorderMode}
          />
        </div>
      ) : (
        <div className="w-full flex items-center justify-center py-4">
          <Empty
            description={
              <h1 className="text-auxiliary-beige text-base text-center select-none">
                Seu StoryTravelling está vázio!
              </h1>
            }
          />
        </div>
      )}
    </div>
  );
};

const reorderIcon = tv({
  base: "fa-solid fa-sort text-xl transition duration-200 hover:cursor-pointer hover:opacity-80 h-7 w-7 flex items-center justify-center rounded-full",
  variants: {
    active: {
      true: "bg-secondary-light text-primary-light",
      false: "text-secondary-light",
    },
  },
});

export const TravellingCollapse: React.FC<TravellingCollapseProps> = ({
  travellings,
}) => {
  const [isReorderMode, setIsReorderMode] = useState(false);
  const { user, UnauthorizeSession } = useContext(AuthContext);
  const { setOpen, setMode, setSelectedTravelling } =
    useContext(TravellingContext);

  const blockStyle = {
    marginBottom: 24,
    borderRadius: "1rem",
    border: "none",
    background: "#6B7D5C",
    padding: "0.5rem 0",
  };

  const { mutate: mutateDeleteTravelling, isLoading: isLoadingDelete } =
    useMutation(deleteTravelling, {
      onSuccess: async (response) => {
        queryClient.setQueryData<TravellingType[] | undefined>(
          ["travellings", user.id],
          (oldList) => {
            if (oldList) {
              // Encontrar o índice do elemento que deseja remover
              const indexToRemove = oldList.findIndex(
                (item) => item.id === response.data.id
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
        message.info("StoryTravelling foi deletado!");
      },
      onError: (error: AxiosError) => {
        if (error.response?.status === 401) {
          UnauthorizeSession();
        } else {
          message.error("Desculpe, não foi possivel deletar, tente novamente!");
        }
      },
    });

  const genExtra = (travelling: TravellingType) => (
    <div className="flex items-center gap-4">
      <i
        className={reorderIcon({ active: isReorderMode })}
        onClick={(event) => {
          event.stopPropagation();
          setIsReorderMode((isReorderMode) => !isReorderMode);
        }}
      />
      <i
        className="fa-solid fa-pen-to-square text-xl text-auxiliary-info transition duration-200 hover:cursor-pointer hover:opacity-80"
        onClick={(event) => {
          event.stopPropagation();
          setMode("edit");
          setSelectedTravelling(travelling);
          setOpen(true);
        }}
      />
      <Popconfirm
        title="Deletar StoryTravelling"
        description="Deseja realmente deletar esse StoryTravelling? Todo progresso será perdido!"
        onConfirm={() => mutateDeleteTravelling(travelling.id)}
        placement="left"
        okText={isLoadingDelete ? "Deletando..." : "Sim"}
        cancelText="Não"
      >
        <i
          className="fa-solid fa-trash text-xl text-auxiliary-error transition duration-200 hover:cursor-pointer hover:opacity-80"
          onClick={(event) => {
            event.stopPropagation();
          }}
        />
      </Popconfirm>
    </div>
  );

  const items: CollapseProps["items"] = travellings.map((travelling) => ({
    key: travelling.id,
    label: (
      <p className="text-auxiliary-beige text-base select-none">
        {travelling.title}
      </p>
    ),
    children: (
      <CustomPanel travelling={travelling} isReorderMode={isReorderMode} />
    ),
    style: blockStyle,
    extra: genExtra(travelling),
  }));

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={["1"]}
      expandIcon={({ isActive }) =>
        isActive ? (
          <i className="fa-solid fa-chevron-down text-base text-auxiliary-beige" />
        ) : (
          <i className="fa-solid fa-chevron-right text-base text-auxiliary-beige" />
        )
      }
      items={items}
      style={{ background: "transparent" }}
    />
  );
};
