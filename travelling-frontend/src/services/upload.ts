import api from "./api";

export const uploadFile = async (data: FormData) => {
  const options = {
    url: "/media",
    method: "POST",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};

export const removeFile = async (fileId: string) => {
  const options = {
    url: `/media/${fileId}`,
    method: "DELETE",
    withCredentials: false,
  };
  const response = await api.request(options);
  return response;
};
