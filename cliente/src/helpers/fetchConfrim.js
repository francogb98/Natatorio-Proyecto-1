import { baseUrl } from "./url";

export const fetchConfirmUser = async ({ token }) => {
  const urlApi = `${baseUrl}user/confirm/` + token;

  const response = await fetch(urlApi, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  return data;
};
