import { useContext, useMemo, useState } from "react";
import { Spin, message } from "antd";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import z, { TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, InputField, SelectField } from "../..";
import {
  Forage,
  createTourist,
  editTourist,
  formatPhone,
  getCategories,
  getUserById,
  setUserDataCookie,
  setterCategoriesFromId,
  transformCategoriesToOptions,
} from "../../../services";
import InputMask from "react-input-mask";
import { AxiosError } from "axios";
import { AuthContext } from "../../../context";
import { CategoryType } from "../../../interfaces";

interface TouristFormProps {
  name: string;
  mode: "create" | "edit";
}

interface TogglerPasswordProps {
  showPassword: boolean;
  toggleShowPassword: () => void;
}

const TogglerPassword: React.FC<TogglerPasswordProps> = ({
  showPassword,
  toggleShowPassword,
}) => {
  return showPassword ? (
    <i
      className="fa-solid fa-eye cursor-pointer text-xl text-primary-dark"
      onClick={toggleShowPassword}
    />
  ) : (
    <i
      className="fa-solid fa-eye-slash cursor-pointer text-xl text-primary-dark"
      onClick={toggleShowPassword}
    />
  );
};

const phoneNumberRegex = /(\d{2})(\d{1})(\d{4})(\d{4})/;

export const TouristForm: React.FC<TouristFormProps> = ({ mode }) => {
  const { user, setUser, UnauthorizeSession, setOpenModalProfile } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const request_user = useMemo(() => {
    return {
      queryKey: ["user-by-id", user.id],
      queryFn: () => getUserById(user.id),
      enabled: mode === "edit",
      onError: (error: AxiosError) => {
        if (error.response?.status === 401) {
          UnauthorizeSession();
        } else if (error.response?.status === 500) {
          message.error(
            "Não foi possível carregar o usuário, tente novamente!"
          );
        }
      },
    };
  }, [user.id]);

  const { data: currentUser, isLoading: isLoadingUser } =
    useQuery(request_user);

  const request_categories = useMemo(() => {
    return {
      queryKey: ["categories"],
      queryFn: () => getCategories(),
      onError: (error: AxiosError) => {
        if (error.response?.status === 500) {
          message.error(
            "Não foi possível carregar suas atrações, tente novamente!"
          );
        }
      },
    };
  }, []);

  const { data: categories, isLoading: isLoadingCategories } =
    useQuery(request_categories);

  const { mutate: mutateCreateTourist, isLoading: isLoadingCreate } =
    useMutation(createTourist, {
      onSuccess: async () => {
        message.success("Cadastro realizado com sucesso!");
        navigate("/login");
      },
      onError: () => {
        message.error("Desculpe, não foi possivel cadastrar, tente novamente!");
      },
    });

  const { mutate: mutateEditTourist, isLoading: isLoadingEdit } = useMutation(
    editTourist,
    {
      onSuccess: async (response) => {
        const updatedUser = {
          id: response.id,
          name: response.name,
          email: response.email,
          userRole: response.userRole,
        };
        setUser(updatedUser);
        setUserDataCookie(updatedUser);

        Forage.setForageCategories(response.favoriteCategories);

        message.success("Editação realizada com sucesso!");

        setOpenModalProfile(false);
      },
      onError: () => {
        message.error("Desculpe, não foi possivel editar, tente novamente!");
      },
    }
  );

  const touristSchema = z
    .object({
      name: z.string().min(1, "Nome inválido!"),
      lastname: z.string().min(1, "Sobrenome inválido!"),
      age: z.string().min(1, "Idade inválida"),
      phone: z.string().refine((value) => !phoneNumberRegex.test(value), {
        message: "Número de telefone inválido",
      }),
      favoriteCategories: z.array(z.string()).optional(),
      email: z.string().email("E-mail inválido!").min(1, "E-mail inválido!"),
      password:
        mode === "create"
          ? z.string().min(8, { message: "Senha inválida!" })
          : z.string(),
      confirmPassword:
        mode === "create"
          ? z.string().min(8, { message: "Senha inválida!" })
          : z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "As senhas não coincidem",
      path: ["confirmPassword"],
    });

  // ? Infer the Schema to get the TS Type
  type TouristRegisterType = TypeOf<typeof touristSchema>;

  // ? Default Values
  const defaultValues: TouristRegisterType = {
    name: "",
    lastname: "",
    phone: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
    favoriteCategories: [],
  };

  const values: TouristRegisterType = {
    name: mode === "edit" && !!currentUser ? currentUser.name : "",
    lastname:
      mode === "edit" && !!currentUser ? currentUser.tourist.lastname : "",
    phone:
      mode === "edit" && !!currentUser
        ? formatPhone(currentUser.phone.replace("55", ""))
        : "",
    email: mode === "edit" && !!currentUser ? currentUser.email : "",
    age:
      mode === "edit" && !!currentUser
        ? currentUser.tourist.age.toString()
        : "",
    favoriteCategories:
      mode === "edit" && !!currentUser
        ? (currentUser.tourist.favoriteCategories.map(
            (item: CategoryType) => item.id
          ) as string[])
        : [],
    password: "",
    confirmPassword: "",
  };

  // ? The object returned from useForm Hook
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    control,
  } = useForm<TouristRegisterType>({
    resolver: zodResolver(touristSchema),
    defaultValues,
    values,
  });

  const isValidSubmit = Object.keys(errors).length === 0 || isValid;
  // ? Submit Handler
  const onSubmitHandler: SubmitHandler<TouristRegisterType> = async (
    values: TouristRegisterType
  ) => {
    const { email, name, lastname, phone, age, password, favoriteCategories } =
      values;

    if (mode === "create") {
      mutateCreateTourist({
        email,
        name,
        lastname,
        phone: "55" + phone.replace(/\D/g, "").trim(),
        password,
        age: Number(age),
        favoriteCategories,
      });
    } else if (mode === "edit") {
      mutateEditTourist({
        touristData: {
          name,
          lastname,
          email,
          phone: "55" + phone.replace(/\D/g, "").trim(),
          age: Number(age),
          favoriteCategories,
        },
        touristId: currentUser.id,
      });
    } else {
      message.error("Operação inválida, tente novamente!");
    }
  };

  if (isLoadingCategories || isLoadingUser) return <Spin size="large" />;

  const isLoading = isLoadingCreate || isLoadingEdit;

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
    <form
      className="flex flex-col justify-center gap-6 mt-12 mx-8 h-full"
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      <div className="flex gap-6">
        <InputField
          id="name"
          type="text"
          placeholder="Digite seu nome"
          hasError={!!errors["name"]}
          helperText={errors["name"] ? errors["name"].message : ""}
          {...register("name")}
        />
        <InputField
          id="lastname"
          type="text"
          placeholder="Digite seu sobrenome"
          hasError={!!errors["lastname"]}
          helperText={errors["lastname"] ? errors["lastname"].message : ""}
          {...register("lastname")}
        />
      </div>
      <InputField
        id="email"
        type="text"
        placeholder="Digite seu e-mail"
        hasError={!!errors["email"]}
        helperText={errors["email"] ? errors["email"].message : ""}
        {...register("email")}
      />
      <div className="flex gap-6 xs:flex-col sm:flex-col">
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
                placeholder="Digite seu telefone"
                hasError={!!errors["phone"]}
                helperText={errors["phone"] ? errors["phone"].message : ""}
                ref={field.ref}
              />
            </InputMask>
          )}
        />

        <InputField
          id="age"
          type="text"
          mask="number"
          placeholder="Digite sua idade"
          hasError={!!errors["age"]}
          helperText={errors["age"] ? errors["age"].message : ""}
          {...register("age")}
        />
      </div>
      {mode === "create" && (
        <div className="flex gap-6 xs:flex-col sm:flex-col">
          <InputField
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            icon={
              <TogglerPassword
                showPassword={showPassword}
                toggleShowPassword={toggleShowPassword}
              />
            }
            hasError={!!errors["password"]}
            helperText={errors["password"] ? errors["password"].message : ""}
            {...register("password")}
          />
          <InputField
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirme sua senha"
            hasError={!!errors["confirmPassword"]}
            helperText={
              errors["confirmPassword"] ? errors["confirmPassword"].message : ""
            }
            icon={
              <TogglerPassword
                showPassword={showPassword}
                toggleShowPassword={toggleShowPassword}
              />
            }
            {...register("confirmPassword")}
          />
        </div>
      )}
      <SelectField
        id="favoriteCategories"
        control={control}
        placeholder="Escolha suas categorias favoritas"
        hasError={!!errors["favoriteCategories"]}
        helperText={
          errors["favoriteCategories"]
            ? errors["favoriteCategories"].message
            : ""
        }
        defaultSelected={setterCategoriesFromId(
          currentUser?.tourist.favoriteCategories,
          categories?.data
        )}
        options={transformCategoriesToOptions(categories?.data)}
        {...register("favoriteCategories")}
      />

      <Button
        className="mt-6"
        label={textToShow}
        type="submit"
        state={isValidSubmit ? "enabled" : "disabled"}
      />
    </form>
  );
};
