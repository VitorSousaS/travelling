import { useContext, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import z, { TypeOf } from "zod";
import { Button, InputField } from "../..";
import { message } from "antd";
import {
  createTravelling,
  editTravelling,
  queryClient,
} from "../../../services";
import { useMutation } from "react-query";
import { AuthContext, TravellingContext } from "../../../context";
import { AxiosError } from "axios";
import { TravellingType } from "../../../interfaces";

interface TravellingFormProps {
  closeModal: () => void;
}

export const TravellingForm: React.FC<TravellingFormProps> = ({
  closeModal,
}) => {
  const { user, UnauthorizeSession } = useContext(AuthContext);
  const { mode, selectedTravelling } = useContext(TravellingContext);

  const isEditable = mode === "edit" && selectedTravelling;

  const travellingEditable = useMemo(() => {
    if (isEditable) {
      return selectedTravelling as TravellingType;
    } else {
      return {} as TravellingType;
    }
  }, [isEditable]);

  const travellingSchema = z.object({
    title: z.string().min(1, "Titulo inválido!"),
  });

  // ? Infer the Schema to get the TS Type
  type TravellingRegisterType = TypeOf<typeof travellingSchema>;

  // ? Default Values
  const defaultValues: TravellingRegisterType = {
    title: "",
  };

  const values: TravellingRegisterType = {
    title: isEditable ? travellingEditable?.title : "",
  };

  // ? The object returned from useForm Hook
  const {
    register,
    formState: { errors, isValid },
    reset,
    handleSubmit,
  } = useForm<TravellingRegisterType>({
    resolver: zodResolver(travellingSchema),
    defaultValues,
    values,
  });

  const { mutate: mutateCreateTravelling, isLoading: isLoadingCreate } =
    useMutation(createTravelling, {
      onSuccess: async (response) => {
        queryClient.setQueryData<TravellingType[] | undefined>(
          ["travellings", user.id],
          (oldList) => {
            if (oldList) {
              // Adicionar o novo item à lista existente
              return [response.data, ...oldList];
            } else {
              // Caso a lista não exista, criar uma nova lista com o novo item
              return [response.data];
            }
          }
        );
        message.success("Cadastro realizado com sucesso!");
        reset(defaultValues);
        closeModal();
      },
      onError: (error: AxiosError) => {
        if (error.response?.status === 401) {
          UnauthorizeSession();
        } else {
          message.error(
            "Desculpe, não foi possivel cadastrar, tente novamente!"
          );
        }
      },
    });

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
        message.success("Edição realizada com sucesso!");
        reset(defaultValues);
        closeModal();
      },
      onError: (error: AxiosError) => {
        if (error.response?.status === 401) {
          UnauthorizeSession();
        } else {
          message.error("Desculpe, não foi possivel editar o StoryTravelling!");
        }
      },
    });

  const isLoading = isLoadingCreate || isLoadingEdit;

  const isValidSubmit = Object.keys(errors).length === 0 || isValid;
  // ? Submit Handler
  const onSubmitHandler: SubmitHandler<TravellingRegisterType> = async (
    values: TravellingRegisterType
  ) => {
    const travellingData = {
      title: values.title,
      locals: [],
    };

    if (mode === "create") {
      mutateCreateTravelling({
        travellingData,
        touristId: user.id,
      });
    } else if (mode === "edit") {
      mutateEditTravelling({
        travellingData,
        travellingId: selectedTravelling?.id ?? "-1",
      });
    } else {
      message.error("Operação inválida!");
    }
  };

  const buttonTexts = {
    create: {
      isLoading: "Cadastrando...",
      notLoading: "Cadastrar",
    },
    edit: {
      isLoading: "Editando...",
      notLoading: "Editar",
    },
  };

  const textToShow = isLoading
    ? buttonTexts[mode].isLoading
    : buttonTexts[mode].notLoading;

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} id="travelling-forms">
      <div className="max-h-[38rem] overflow-y-scroll px-10">
        <div className="h-full flex flex-col gap-6 justify-center mt-6">
          <InputField
            id="title"
            type="text"
            label="Titulo do StoryTravelling"
            placeholder="Bonito com a família"
            hasError={!!errors["title"]}
            helperText={errors["title"] ? errors["title"].message : ""}
            {...register("title")}
          />
        </div>
      </div>
      <Button
        className="mt-10 w-[90%] mx-auto"
        label={textToShow}
        type="submit"
        state={isValidSubmit ? "enabled" : "disabled"}
      />
    </form>
  );
};
