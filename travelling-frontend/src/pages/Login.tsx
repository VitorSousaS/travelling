import { useContext, useEffect, useState } from "react";
import { TypeOf, z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, InputField } from "../components";
import {
  login,
  setUserDataCookie,
  setUserTokenCookie,
  getMe,
  getTouristById,
  Forage,
} from "../services";
import { AxiosResponse } from "axios";
import { useMutation } from "react-query";
import { AuthContext } from "../context";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";

export default function Login() {
  const navigate = useNavigate();
  const { setAuthorized, isExpiredSession, authorized } =
    useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isExpiredSession && !authorized) {
      message.warning("Ops... sua sessão foi expirada!");
    }
  }, [isExpiredSession, authorized]);

  const handleAuthenticate = async (response: AxiosResponse<any, any>) => {
    try {
      setUserTokenCookie(response.data.access_token);

      const user = await getMe();

      setUserDataCookie(user.data);

      if (user.data.userRole === "TOURIST") {
        const touristById = await getTouristById();
        Forage.setForageCategories(touristById.data.favoriteCategories);
      }

      setAuthorized(true);
    } catch (error) {
      message.error("Ops... não foi possivel realizar a autenticação!");
    }
  };

  const { mutate: mutateLogin, isLoading } = useMutation(login, {
    onSuccess: async (response) => {
      handleAuthenticate(response);
    },
    onError: () => {
      message.error("Ops... email ou senha inválida, tente novamente!");
    },
  });

  const toggleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  // Definindo o esquema usando zod
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, "E-mail inválido")
      .email({ message: "E-mail inválido" }),
    password: z.string().min(8, { message: "Senha inválida" }),
  });

  // ? Infer the Schema to get the TS Type
  type LoginType = TypeOf<typeof loginSchema>;

  // ? Default Values
  const defaultValues: LoginType = {
    email: "",
    password: "",
  };

  // ? The object returned from useForm Hook
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const isValidSubmit = Object.keys(errors).length === 0 || isValid;

  // const handleForgotPassword = () => {
  //   console.log("Mutate Forgot Password");
  // };

  // ? Submit Handler
  const onSubmitHandler: SubmitHandler<LoginType> = async (
    values: LoginType
  ) => {
    mutateLogin(values);
  };
  return (
    <div className="h-screen w-full bg-primary-light flex">
      <div className="flex-1 flex items-center justify-center">
        <div className="min-w-[30rem] w-[55%] xs:flex xs:flex-col xs:min-w-full xs:px-6 sm:flex sm:flex-col sm:min-w-full sm:px-8">
          <h3 className="text-3xl font-bold leading-[2.8rem] py-4 text-auxiliary-beige xs:text-2xl">
            Bem-vindo de volta a Travelling: Seu Portal para o{" "}
            <span className="text-secondary-light">Ecoturismo</span>!
          </h3>
          <form
            className="flex flex-col gap-4 mt-8"
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <InputField
              id="email"
              type="text"
              label="Email"
              placeholder="Digite seu e-mail"
              hasError={!!errors["email"]}
              helperText={errors["email"] ? errors["email"].message : ""}
              {...register("email")}
            />
            <InputField
              id="password"
              type={showPassword ? "text" : "password"}
              label="Senha"
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

            <div className="w-full flex items-center justify-end my-2">
              {/* <p
                className="w-fit font-medium text-right text-auxiliary-beige hover:cursor-pointer hover:underline select-none"
                onClick={handleForgotPassword}
              >
                Esqueceu a senha?
              </p> */}
            </div>

            <Button
              label={isLoading ? "Carregando..." : "Entrar"}
              type="submit"
              state={isValidSubmit ? "enabled" : "disabled"}
            />
          </form>

          <h3 className="py-4 text-auxiliary-beige text-center tracking-wide">
            Não tem uma conta? Registre-se{" "}
            <Link to="/register" style={{ textDecoration: "none" }}>
              <span className="text-secondary-light">aqui</span>!
            </Link>
          </h3>

          <Button
            className="bg-primary-dark text-auxiliary-beige tracking-wide mt-8"
            label="Procurar por locais"
            type="button"
            startIcon={
              <i className="fa-solid fa-plane text-auxiliary-beige text-2xl mr-4"></i>
            }
            onConfirm={() => navigate("/tourist")}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center xs:hidden sm:hidden md:hidden">
        <img
          src="/img/logo-bigger.svg"
          alt="TRAVELLING"
          className="lg:h-96 lg:w-auto"
        />
        <h1 className="font-bold text-8xl text-secondary-light text-center mt-8 lg:text-6xl">
          TRAVELLING
        </h1>
        <h3 className="font-medium text-4xl text-auxiliary-beige tracking-widest text-center mt-5 lg:text-3xl">
          ECOTURISMO
        </h3>
      </div>
    </div>
  );
}
