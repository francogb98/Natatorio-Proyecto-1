import { baseUrl } from "./url";

export const fetchConfirmUser = async ({ token }) => {
  try {
    const urlApi = `${baseUrl}user/confirm/` + token;

    const response = await fetch(urlApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
};
