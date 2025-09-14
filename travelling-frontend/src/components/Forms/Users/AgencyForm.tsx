import { useContext, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, InputField } from "../..";
import { zodResolver } from "@hookform/resolvers/zod";
import z, { TypeOf } from "zod";
import { useMutation, useQuery } from "react-query";
import { Spin, message } from "antd";
import {
  createAgency,
  editAgency,
  formatPhone,
  getUserById,
  setUserDataCookie,
} from "../../../services";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import { AuthContext } from "../../../context";
import { AxiosError } from "axios";

interface AgencyFormProps {
  name: string;
  mode: "create" | "edit";
}

const phoneNumberRegex = /(\d{2})(\d{1})(\d{4})(\d{4})/;

export const AgencyForm: React.FC<AgencyFormProps> = ({ mode }) => {
  const { user, setUser, UnauthorizeSession, setOpenModalProfile } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
  }, []);

  const { data: currentUser, isLoading: isLoadingUser } =
    useQuery(request_user);

  const toggleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const { mutate: mutateCreateAgency, isLoading: isLoadingCreate } =
    useMutation(createAgency, {
      onSuccess: async () => {
        message.success("Cadastro realizado com sucesso!");
        navigate("/login");
      },
      onError: () => {
        message.error("Desculpe, não foi possivel cadastrar, tente novamente!");
      },
    });

  const { mutate: mutateEditAgency, isLoading: isLoadingEdit } = useMutation(
    editAgency,
    {
      onSuccess: async (response) => {
        message.success("Editação realizada com sucesso!");
        const updatedUser = {
          id: response.id,
          name: response.name,
          email: response.email,
          userRole: response.userRole,
        };
        setUser(updatedUser);
        setUserDataCookie(updatedUser);
        setOpenModalProfile(false);
      },
      onError: () => {
        message.error("Desculpe, não foi possivel editar, tente novamente!");
      },
    }
  );

  const agencySchema = z
    .object({
      name: z.string().min(1, "Nome inválido!"),
      phone: z.string().refine((value) => !phoneNumberRegex.test(value), {
        message: "Número de telefone inválido",
      }),
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
  type AgencyRegisterType = TypeOf<typeof agencySchema>;

  // ? Default Values
  const defaultValues: AgencyRegisterType = {
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const values: AgencyRegisterType = {
    name: mode === "edit" && !!currentUser ? currentUser.name : "",
    phone:
      mode === "edit" && !!currentUser
        ? formatPhone(currentUser.phone.replace("55", ""))
        : "",
    email: mode === "edit" && !!currentUser ? currentUser.email : "",
    password: "",
    confirmPassword: "",
  };

  // ? The object returned from useForm Hook
  const {
    register,
    formState: { errors, isValid },
    control,
    handleSubmit,
  } = useForm<AgencyRegisterType>({
    resolver: zodResolver(agencySchema),
    defaultValues,
    values,
  });

  const isValidSubmit = Object.keys(errors).length === 0 || isValid;
  // ? Submit Handler
  const onSubmitHandler: SubmitHandler<AgencyRegisterType> = async (
    values: AgencyRegisterType
  ) => {
    const { email, name, password, phone } = values;

    if (mode === "create") {
      mutateCreateAgency({
        email,
        name,
        phone: "55" + phone.replace(/\D/g, "").trim(),
        password,
      });
    } else if (mode === "edit") {
      mutateEditAgency({
        agencyData: {
          name,
          email,
          phone: "55" + phone.replace(/\D/g, "").trim(),
        },
        agencyId: currentUser.id,
      });
    } else {
      message.error("Operação inválida, tente novamente!");
    }
  };

  if (isLoadingUser) return <Spin size="large" />;

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
      className="flex flex-col gap-6 justify-center mt-12 mx-8 h-full"
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      <InputField
        id="name"
        type="text"
        placeholder="Digite o nome da agência"
        hasError={!!errors["name"]}
        helperText={errors["name"] ? errors["name"].message : ""}
        {...register("name")}
      />
      <InputField
        id="email"
        type="text"
        placeholder="Digite o e-mail"
        hasError={!!errors["email"]}
        helperText={errors["email"] ? errors["email"].message : ""}
        {...register("email")}
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
              placeholder="Digite seu telefone"
              hasError={!!errors["phone"]}
              helperText={errors["phone"] ? errors["phone"].message : ""}
              ref={field.ref}
            />
          </InputMask>
        )}
      />
      {mode === "create" && (
        <div className="flex gap-6 xs:flex-col sm:flex-col">
          <InputField
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            icon={
              showPassword ? (
                <i
                  className="fa-solid fa-eye cursor-pointer text-xl text-primary-dark"
                  onClick={toggleShowPassword}
                />
              ) : (
                <i
                  className="fa-solid fa-eye-slash cursor-pointer text-xl text-primary-dark"
                  onClick={toggleShowPassword}
                />
              )
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
              showPassword ? (
                <i
                  className="fa-solid fa-eye cursor-pointer text-xl text-primary-dark"
                  onClick={toggleShowPassword}
                />
              ) : (
                <i
                  className="fa-solid fa-eye-slash cursor-pointer text-xl text-primary-dark"
                  onClick={toggleShowPassword}
                />
              )
            }
            {...register("confirmPassword")}
          />
        </div>
      )}

      <Button
        className="mt-10"
        label={textToShow}
        type="submit"
        state={isValidSubmit ? "enabled" : "disabled"}
      />
    </form>
  );
};
