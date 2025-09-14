import { useContext, useEffect, useMemo, useState } from "react";
import { Button, Modal, SingleSelectField, TravellingForm } from "../..";
import { Spin, message } from "antd";
import {
  editTravelling,
  getTravellingByTourist,
  queryClient,
  transformLocalsType,
  transformTravellingToOption,
} from "../../../services";
import { useMutation, useQuery } from "react-query";
import { AuthContext, TravellingContext } from "../../../context";
import { AxiosError } from "axios";
import { OptionType, TravellingType } from "../../../interfaces";

interface MountTravellingFormProps {
  closeModal: () => void;
}

export const MountTravellingForm: React.FC<MountTravellingFormProps> = ({
  closeModal,
}) => {
  const { selectedLocal } = useContext(TravellingContext);
  const { user, UnauthorizeSession } = useContext(AuthContext);
  const [selectedTravelling, setSelectedTravelling] =
    useState<OptionType | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const request_travellings = useMemo(() => {
    return {
      queryKey: ["travellings", user.id],
      enabled: !!user && user.userRole === "TOURIST",
      queryFn: () => getTravellingByTourist(user.id),
      onError: (error: AxiosError) => {
        if (error.response?.status === 500) {
          message.error(
            "Não foi possível carregar os StoryTravellings, tente novamente!"
          );
        } else if (error.response?.status === 401) {
          UnauthorizeSession();
        }
      },
    };
  }, [user.id]);

  const { data: travellings, isLoading: isLoadingTravellings } =
    useQuery(request_travellings);

  useEffect(() => {
    if (travellings && travellings.length === 0) {
      setOpenModal(true);
    } else {
      setOpenModal(false);
    }
  }, [travellings]);

  const [isValidSubmit, setIsValidSubmit] = useState(false);

  useEffect(() => {
    if (selectedTravelling !== null) {
      setIsValidSubmit(true);
    }
  }, [selectedTravelling]);

  const { mutate: mutateEditTravelling, isLoading: isLoadingEdit } =
    useMutation(editTravelling, {
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
        message.success("O local foi adicionando ao StoryTravelling!");
        closeModal();
      },
      onError: (error: AxiosError) => {
        if (error.response?.status === 401) {
          UnauthorizeSession();
        } else {
          message.error(
            "Desculpe, não foi possivel inserir o local ao StoryTravelling!"
          );
        }
      },
    });

  const isLoading = isLoadingEdit;

  // ? Submit Handler
  const onSubmit = async () => {
    if (selectedTravelling !== null && selectedLocal !== null) {
      const currentLocals =
        (travellings as TravellingType[]).find(
          (travelling) => travelling.id === selectedTravelling.value
        )?.locals ?? [];

      const formattedLocals = transformLocalsType(currentLocals);

      formattedLocals.push({
        localId: selectedLocal.id,
        type: selectedLocal.type,
        position: formattedLocals.length,
      });

      const travellingData = {
        title: selectedTravelling.label,
        locals: formattedLocals,
      };

      mutateEditTravelling({
        travellingData,
        travellingId: selectedTravelling.value,
      });
    } else {
      setIsValidSubmit(false);
      message.error("Você não selecionou nenhum travelling");
    }
  };

  const buttonTexts = {
    register: {
      isLoading: "Adicionando...",
      notLoading: "Adicionar",
    },
  };

  const textToShow = isLoading
    ? buttonTexts["register"].isLoading
    : buttonTexts["register"].notLoading;

  if (isLoadingTravellings) return <Spin size="large" />;

  return (
    <div>
      <Modal
        title={
          <h1 className="font-semibold text-2xl w-full text-center text-auxiliary-beige">
            Cadastrar{" "}
            <span className="text-secondary-light">StoryTravelling</span>
          </h1>
        }
        open={openModal}
        setOpen={setOpenModal}
      >
        <TravellingForm closeModal={() => setOpenModal(false)} />
      </Modal>
      <div className="max-h-[38rem] px-10">
        <div className="h-full flex flex-col gap-6 justify-center mt-6">
          <SingleSelectField
            id="travellings"
            label="Seus StoryTravellings"
            placeholder="Escolha um travelling para adicionar o local"
            value={selectedTravelling}
            onChange={(value) => setSelectedTravelling(value)}
            options={transformTravellingToOption(travellings)}
          />
        </div>
      </div>
      <Button
        className="mt-10 w-[90%] mx-auto"
        label={textToShow}
        onConfirm={onSubmit}
        state={isValidSubmit ? "enabled" : "disabled"}
      />
    </div>
  );
};
