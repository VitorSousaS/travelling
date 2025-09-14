import axios from "axios";
import Cookies from "js-cookie"; // Certifique-se de que 'js-cookie' esteja instalado
import { global } from "../../shared";
import { handleFulfilled, handleRejected } from "./interceptors";

const instance = axios.create({
  baseURL: global.base_url,
  headers: {
    Accept: "application/json",
  },
});

instance.interceptors.request.use((config) => {
  // Verifique se o token está no cookie 'userToken'
  const userToken = Cookies.get("userToken");

  if (userToken) {
    // Se o token estiver no cookie, adicione-o ao cabeçalho 'Authorization'
    config.headers.Authorization = `Bearer ${userToken}`;
  }

  return config;
});

instance.interceptors.response.use(handleFulfilled, handleRejected);

export default instance;
