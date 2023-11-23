import { baseUrl } from "../url";

export const getActividadesNombre = async () => {
  try {
    const url = `${baseUrl}activity/getActividadesNombre`;
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      },
    });
    const { actividades } = await resp.json();
    return actividades;
  } catch (error) {
    error;
  }
};
