import api from "./api";
import { Login } from "../interfaces";

export const login = async ({ email, password }: Login) => {
  const options = {
    url: "/login",
    method: "POST",
    data: {
      email,
      password,
    },
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const getMe = async () => {
  const options = {
    url: "/me",
    method: "GET",
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const getUserById = async (id: string) => {
  const options = {
    url: `/user/userById/${id}`,
    method: "GET",
    withCredentials: false,
  };
  const response = await api.request(options);
  return response.data;
};
