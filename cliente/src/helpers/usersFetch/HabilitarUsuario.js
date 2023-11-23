import { baseUrl } from "../url";

export const HabilitarUsuario = async ({ id }) => {
  try {
    const response = await fetch(`${baseUrl}user/habilitar/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    error;
  }
};
