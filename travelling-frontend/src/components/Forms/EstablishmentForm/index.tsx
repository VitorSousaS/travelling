import { useContext, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import z, { TypeOf } from "zod";
import {
  Button,
  HourField,
  InputField,
  InputLocation,
  InputTextArea,
  MultiFile,
  SelectField,
  SingleFile,
} from "../..";
import { Spin, message } from "antd";
import {
  createEstablishment,
  editEstablishment,
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
import { EstablishmentType } from "../../../interfaces";
import InputMask from "react-input-mask";

interface EstablishmentFormProps {
  name: string;
  closeModal: () => void;
}

export const EstablishmentForm: React.FC<EstablishmentFormProps> = ({
  closeModal,
}) => {
  const { user, UnauthorizeSession } = useContext(AuthContext);
  const { mode, selectedLocal } = useContext(LocalContext);
  const [values, setValues] = useState<EstablishmentRegisterType>(
    {} as EstablishmentRegisterType
  );

  const isEditable = mode === "edit" && !!selectedLocal;

  const establishmentEditable = useMemo(() => {
    if (isEditable) {
      const establishmentValues = {
        ...selectedLocal,
        minPrice: formatCurrency((selectedLocal as EstablishmentType).minPrice),
        maxPrice: formatCurrency((selectedLocal as EstablishmentType).maxPrice),
        categories: selectedLocal.categories.map((item) => item.id) as string[],
      };
      setValues(establishmentValues as EstablishmentRegisterType);
      return selectedLocal as EstablishmentType;
    } else {
      return {} as EstablishmentType;
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

  const establishmentSchema = z.object({
    name: z.string().min(1, "Nome inválido!"),
    description: z.string().min(1, "Descrição inválida!"),
    banner: z.string().optional(),
    openHours: z.string().min(1, "Horário inválido!"),
    closeHours: z.string().min(1, "Horário inválido!"),
    maxPrice: z.string().min(1, "Preço inválido!"),
    minPrice: z.string().min(1, "Preço inválido!"),
    location: z.string().min(1, "Localização inválida!"),
    foundInEstablishment: z.string().min(1, "Valor inválido!"),
    otherInformation: z.string().min(1, "Valor inválido!"),
    phone: z.string().optional(),
    openDays: z
      .array(z.string())
      .min(1, { message: "Selecione um dia aberto." }),
    categories: z
      .array(z.string())
      .min(1, { message: "Selecione uma categoria!" }),
    generalMedias: z.array(z.string()).optional(),
    menuOfServicesMedia: z.array(z.string()).optional(),
  });

  // ? Infer the Schema to get the TS Type
  type EstablishmentRegisterType = TypeOf<typeof establishmentSchema>;

  // ? Default Values
  const defaultValues: EstablishmentRegisterType = {
    name: "",
    description: "",
    banner: "",
    openHours: "",
    closeHours: "",
    maxPrice: "",
    minPrice: "",
    location: "",
    foundInEstablishment: "",
    otherInformation: "",
    phone: "",
    openDays: [],
    categories: [],
    generalMedias: [],
    menuOfServicesMedia: [],
  };

  // ? The object returned from useForm Hook
  const {
    register,
    formState: { errors, isValid },
    control,
    reset,
    handleSubmit,
  } = useForm<EstablishmentRegisterType>({
    resolver: zodResolver(establishmentSchema),
    defaultValues,
    values,
  });

  const { mutate: mutateCreateEstablishment, isLoading: isLoadingCreate } =
    useMutation(createEstablishment, {
      onSuccess: async (response) => {
        queryClient.setQueryData<EstablishmentType[] | undefined>(
          ["establishments-by-business", user.id],
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

  const { mutate: mutateEditEstablishment, isLoading: isLoadingEdit } =
    useMutation(editEstablishment, {
      onSuccess: async (response) => {
        queryClient.setQueryData<EstablishmentType[] | undefined>(
          ["establishments-by-business", user.id],
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
        message.success("Cadastro realizado com sucesso!");
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
  const onSubmitHandler: SubmitHandler<EstablishmentRegisterType> = async (
    values: EstablishmentRegisterType
  ) => {
    const maxPricing = parseFloat(values.maxPrice.replace(/[^0-9]/g, "")) / 100;

    const minPricing = parseFloat(values.minPrice.replace(/[^0-9]/g, "")) / 100;

    const phoneReplace =
      values.phone && "55" + values.phone.replace(/\D/g, "").trim();

    const establishmentData = {
      ...values,
      phone: phoneReplace,
      maxPrice: maxPricing.toString(),
      minPrice: minPricing.toString(),
    };
    const userId = user.id;

    if (mode === "create") {
      mutateCreateEstablishment({ establishmentData, userId });
    } else if (mode === "edit") {
      mutateEditEstablishment({
        establishmentData,
        establishmentId: selectedLocal?.id ?? "-1",
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
    <form onSubmit={handleSubmit(onSubmitHandler)} id="establishment-forms">
      <div className="max-h-[38rem] overflow-y-scroll px-10">
        <div className="h-full flex flex-col gap-6 justify-center mt-10">
          <InputField
            id="name"
            type="text"
            label="Nome do estabelecimento"
            placeholder="Hotel Transilvânia"
            hasError={!!errors["name"]}
            helperText={errors["name"] ? errors["name"].message : ""}
            {...register("name")}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <InputMask
                mask="(99) 9 9999-9999"
                maskPlaceholder={null}
                disabled={false}
                onChange={field.onChange}
                value={field.value}
              >
                <InputField
                  id="phone"
                  type="text"
                  label="Telefone (Opcional)"
                  placeholder="Digite telefone do estabelecimento"
                  hasError={!!errors["phone"]}
                  helperText={errors["phone"] ? errors["phone"].message : ""}
                  ref={field.ref}
                />
              </InputMask>
            )}
          />

          <InputTextArea
            id="description"
            label="Descrição"
            placeholder="Local climatizado e bonito..."
            hasError={!!errors["description"]}
            helperText={
              errors["description"] ? errors["description"].message : ""
            }
            {...register("description")}
          />

          <div className="flex gap-6 xs:flex-col sm:flex-col">
            <InputField
              id="minPrice"
              type="text"
              mask="currency"
              label="Valor minimo"
              placeholder="R$ 120,00"
              hasError={!!errors["minPrice"]}
              helperText={errors["minPrice"] ? errors["minPrice"].message : ""}
              {...register("minPrice")}
            />
            <InputField
              id="maxPrice"
              type="text"
              mask="currency"
              label="Valor máximo"
              placeholder="R$ 2500,00"
              hasError={!!errors["maxPrice"]}
              helperText={errors["maxPrice"] ? errors["maxPrice"].message : ""}
              {...register("maxPrice")}
            />
          </div>

          <div className="flex gap-6 xs:flex-col sm:flex-col">
            <Controller
              name="openHours"
              control={control}
              render={({ field }) => (
                <HourField
                  label="Horário de abertura"
                  hasError={!!errors["openHours"]}
                  helperText={
                    errors["openHours"] ? errors["openHours"].message : ""
                  }
                  value={field.value}
                  onChange={(openHours) => field.onChange(openHours)}
                />
              )}
            />
            <Controller
              name="closeHours"
              control={control}
              render={({ field }) => (
                <HourField
                  label="Horário de fechamento"
                  hasError={!!errors["closeHours"]}
                  helperText={
                    errors["closeHours"] ? errors["closeHours"].message : ""
                  }
                  value={field.value}
                  onChange={(closeHours) => field.onChange(closeHours)}
                />
              )}
            />
          </div>

          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <InputLocation
                hasError={!!errors["location"]}
                helperText={
                  errors["location"] ? errors["location"].message : ""
                }
                initialValue={establishmentEditable?.location}
                onChange={(location) => field.onChange(location)}
              />
            )}
          />

          <SelectField
            id="categories"
            control={control}
            label="Categorias"
            placeholder="Escolha as categorias do estabelecimento"
            hasError={!!errors["categories"]}
            helperText={
              errors["categories"] ? errors["categories"].message : ""
            }
            defaultSelected={setterCategoriesFromId(
              establishmentEditable?.categories,
              categories?.data
            )}
            options={transformCategoriesToOptions(categories?.data)}
            {...register("categories")}
          />

          <div className="flex gap-6 xs:flex-col sm:flex-col">
            <InputTextArea
              id="foundInEstablishment"
              label="O que o estabelecimento oferece"
              placeholder="Haverá mesas bonitas, vinhos..."
              hasError={!!errors["foundInEstablishment"]}
              helperText={
                errors["foundInEstablishment"]
                  ? errors["foundInEstablishment"].message
                  : ""
              }
              {...register("foundInEstablishment")}
            />

            <InputTextArea
              id="otherInformation"
              label="Outras informações"
              placeholder="Há brindes e área para crianças..."
              hasError={!!errors["otherInformation"]}
              helperText={
                errors["otherInformation"]
                  ? errors["otherInformation"].message
                  : ""
              }
              {...register("otherInformation")}
            />
          </div>

          <SelectField
            id="openDays"
            control={control}
            label="Dias abertos"
            placeholder="Selecione os dias de funcionamento"
            hasError={!!errors["openDays"]}
            helperText={errors["openDays"] ? errors["openDays"].message : ""}
            defaultSelected={transformStringToOptions(
              establishmentEditable?.openDays
            )}
            options={[
              { label: "Segunda", value: "Segunda" },
              { label: "Terça", value: "Terça" },
              { label: "Quarta", value: "Quarta" },
              { label: "Quinta", value: "Quinta" },
              { label: "Sexta", value: "Sexta" },
              { label: "Sábado", value: "Sábado" },
              { label: "Domingo", value: "Domingo" },
            ]}
            {...register("openDays")}
          />

          <Controller
            name="banner"
            control={control}
            render={({ field }) => (
              <SingleFile
                label="Banner (Opcional)"
                defaultFileUrl={establishmentEditable?.banner}
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
                label="Imagens do local (Opcional)"
                defaultFiles={establishmentEditable?.generalMedias}
                onChange={(fileList) => field.onChange(fileList)}
              />
            )}
          />

          <Controller
            name="menuOfServicesMedia"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <MultiFile
                label="Imagens dos serviços (Opcional)"
                defaultFiles={establishmentEditable?.menuOfServicesMedia}
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
