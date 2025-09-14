import api from "./api";

export const getCategories = async () => {
  const options = {
    url: "/category",
    method: "GET",
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};
