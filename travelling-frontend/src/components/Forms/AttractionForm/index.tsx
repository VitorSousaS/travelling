import { useContext, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import z, { TypeOf } from "zod";
import {
  Button,
  DateField,
  InputField,
  InputLocation,
  InputTextArea,
  MultiFile,
  SelectField,
  SingleFile,
} from "../..";
import { Spin, message } from "antd";
import {
  createAttraction,
  editAttraction,
  formatCurrency,
  getCategories,
  queryClient,
  setterCategoriesFromId,
  transformCategoriesToOptions,
  transformStringToOptions,
} from "../../../services";
import { useMutation, useQuery } from "react-query";
import { AuthContext, LocalContext } from "../../../context";
import { AxiosError } from "axios";
import { AttractionType } from "../../../interfaces";

interface AttractionFormProps {
  name: string;
  closeModal: () => void;
}

export const AttractionForm: React.FC<AttractionFormProps> = ({
  closeModal,
}) => {
  const { user, UnauthorizeSession } = useContext(AuthContext);
  const { mode, selectedLocal } = useContext(LocalContext);

  const isEditable = mode === "edit" && selectedLocal;

  const attractionEditable = useMemo(() => {
    if (isEditable) {
      return selectedLocal as AttractionType;
    } else {
      return {} as AttractionType;
    }
  }, [isEditable]);

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

  const attractionSchema = z.object({
    name: z.string().min(1, "Nome inválido!"),
    description: z.string().min(1, "Descrição inválida!"),
    banner: z.string().optional(),
    pricing: z.string().min(1, "Preço inválido!"),
    date: z.string().min(1, "Data inválida!"),
    location: z.string().min(1, "Localização inválida!"),
    foundInAttraction: z.string().min(1, "Valor inválido!"),
    notFoundInAttraction: z.string().min(1, "Valor inválido!"),
    categories: z
      .array(z.string())
      .min(1, { message: "Selecione uma categoria!" }),
    generalMedias: z.array(z.string()).optional(),
    whatToTake: z
      .array(z.string())
      .min(1, { message: "Selecione o que levar!" }),
  });

  // ? Infer the Schema to get the TS Type
  type AttractionRegisterType = TypeOf<typeof attractionSchema>;

  // ? Default Values
  const defaultValues: AttractionRegisterType = {
    name: "",
    description: "",
    banner: "",
    pricing: "",
    date: "",
    location: "",
    foundInAttraction: "",
    notFoundInAttraction: "",
    categories: [],
    whatToTake: [],
    generalMedias: [],
  };

  const values: AttractionRegisterType = {
    name: isEditable ? attractionEditable?.name : "",
    description: isEditable ? attractionEditable.description : "",
    banner: isEditable ? attractionEditable.banner : "",
    pricing: isEditable ? formatCurrency(attractionEditable.pricing) : "",
    date: isEditable ? attractionEditable.date : "",
    location: isEditable ? attractionEditable.location : "",
    foundInAttraction: isEditable ? attractionEditable.foundInAttraction : "",
    notFoundInAttraction: isEditable
      ? attractionEditable.notFoundInAttraction
      : "",
    categories: isEditable
      ? attractionEditable.categories.map((categorie) => categorie.id)
      : [],
    whatToTake: isEditable ? attractionEditable.whatToTake : [],
    generalMedias: isEditable ? attractionEditable.generalMedias : [],
  };

  // ? The object returned from useForm Hook
  const {
    register,
    formState: { errors, isValid },
    control,
    reset,
    handleSubmit,
  } = useForm<AttractionRegisterType>({
    resolver: zodResolver(attractionSchema),
    defaultValues,
    values,
  });

  const { mutate: mutateCreateAttraction, isLoading: isLoadingCreate } =
    useMutation(createAttraction, {
      onSuccess: async (response) => {
        queryClient.setQueryData<AttractionType[] | undefined>(
          ["attractions-by-agency", user.id],
          (oldList) => {
            if (oldList) {
              // Adicionar o novo item à lista existente
              return [...oldList, response.data];
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

  const { mutate: mutateEditAttraction, isLoading: isLoadingEdit } =
    useMutation(editAttraction, {
      onSuccess: async (response) => {
        queryClient.setQueryData<AttractionType[] | undefined>(
          ["attractions-by-agency", user.id],
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
          message.error("Desculpe, não foi possivel editar, tente novamente!");
        }
      },
    });

  const isLoading = isLoadingCreate || isLoadingEdit;

  const isValidSubmit = Object.keys(errors).length === 0 || isValid;
  // ? Submit Handler
  const onSubmitHandler: SubmitHandler<AttractionRegisterType> = async (
    values: AttractionRegisterType
  ) => {
    const pricingNumber =
      parseFloat(values.pricing.replace(/[^0-9]/g, "")) / 100;

    const attractionData = {
      ...values,
      pricing: pricingNumber.toString(),
    };
    const userId = user.id;

    if (mode === "create") {
      mutateCreateAttraction({ attractionData, userId });
    } else if (mode === "edit") {
      mutateEditAttraction({
        attractionData,
        attractionId: selectedLocal?.id ?? "-1",
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

  if (isLoadingCategories) return <Spin size="large" />;

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} id="attraction-forms">
      <div className="max-h-[38rem] overflow-y-scroll px-10">
        <div className="h-full flex flex-col gap-6 justify-center mt-10">
          <div className="flex gap-6 xs:flex-col sm:flex-col">
            <InputField
              id="name"
              type="text"
              label="Nome da atração"
              placeholder="Pão de açucar"
              hasError={!!errors["name"]}
              helperText={errors["name"] ? errors["name"].message : ""}
              {...register("name")}
            />

            <InputField
              id="pricing"
              type="text"
              mask="currency"
              label="Preço da atração"
              placeholder="R$ 2500,00"
              hasError={!!errors["pricing"]}
              helperText={errors["pricing"] ? errors["pricing"].message : ""}
              {...register("pricing")}
            />
          </div>

          <InputTextArea
            id="description"
            label="Descrição"
            placeholder="Local bem arborizado e bonito..."
            hasError={!!errors["description"]}
            helperText={
              errors["description"] ? errors["description"].message : ""
            }
            {...register("description")}
          />

          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DateField
                label="Data"
                hasError={!!errors["date"]}
                helperText={errors["date"] ? errors["date"].message : ""}
                value={field.value}
                onChange={(date) => field.onChange(date)}
              />
            )}
          />

          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <InputLocation
                hasError={!!errors["location"]}
                helperText={
                  errors["location"] ? errors["location"].message : ""
                }
                initialValue={attractionEditable?.location}
                onChange={(location) => field.onChange(location)}
              />
            )}
          />

          <SelectField
            id="categories"
            control={control}
            label="Categorias"
            placeholder="Escolha as categorias do atrativo"
            hasError={!!errors["categories"]}
            helperText={
              errors["categories"] ? errors["categories"].message : ""
            }
            defaultSelected={setterCategoriesFromId(
              attractionEditable?.categories,
              categories?.data
            )}
            options={transformCategoriesToOptions(categories?.data)}
            {...register("categories")}
          />

          <div className="flex gap-6 xs:flex-col sm:flex-col">
            <InputTextArea
              id="foundInAttraction"
              label="O que haverá na atração"
              placeholder="Haverá mato, mosquito..."
              hasError={!!errors["foundInAttraction"]}
              helperText={
                errors["foundInAttraction"]
                  ? errors["foundInAttraction"].message
                  : ""
              }
              {...register("foundInAttraction")}
            />

            <InputTextArea
              id="notFoundInAttraction"
              label="O que NÃO haverá na atração"
              placeholder="Não terá montanhas e piscinas rasas..."
              hasError={!!errors["notFoundInAttraction"]}
              helperText={
                errors["notFoundInAttraction"]
                  ? errors["notFoundInAttraction"].message
                  : ""
              }
              {...register("notFoundInAttraction")}
            />
          </div>
          <SelectField
            id="whatToTake"
            control={control}
            label="O que levar para o atrativo"
            placeholder="Digite um novo e dê 'Enter'"
            mode="inputable"
            hasError={!!errors["whatToTake"]}
            helperText={
              errors["whatToTake"] ? errors["whatToTake"].message : ""
            }
            defaultSelected={transformStringToOptions(
              attractionEditable?.whatToTake
            )}
            options={[
              { label: "Tênis", value: "Tênis" },
              { label: "Legging", value: "Legging" },
              {
                label: "Garrafinha de água",
                value: "Garrafinha de água",
              },
            ]}
            {...register("whatToTake")}
          />
          <Controller
            name="banner"
            control={control}
            render={({ field }) => (
              <SingleFile
                label="Banner (Opcional)"
                defaultFileUrl={attractionEditable?.banner}
                onChange={(fileList) => field.onChange(fileList)}
              />
            )}
          />
          <Controller
            name="generalMedias"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <MultiFile
                label="Imagens (Opcional)"
                defaultFiles={attractionEditable?.generalMedias}
                onChange={(fileList) => field.onChange(fileList)}
              />
            )}
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
