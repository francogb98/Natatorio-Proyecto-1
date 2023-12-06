import { baseUrl } from "../url";

export const cargarFicha = async (data) => {
  try {
    const url = `${baseUrl}user/cargaFicha`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    return error;
  }
};
