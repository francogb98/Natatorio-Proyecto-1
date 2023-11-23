import { baseUrl } from "../url";

export const registrarUsuarioEnActividad = async (idActividad) => {
  try {
    const response = await fetch(`${baseUrl}user/resgisterActivity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(idActividad),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    error;
  }
};
