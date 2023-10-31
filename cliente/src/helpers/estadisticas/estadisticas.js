import { baseUrl } from "../url";

export const getEstadisticas = async () => {
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${baseUrl}stadistics/getStadistics`, {
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
        authorization: token,
      },
    });
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log(error);
    return { status: "error", message: "Error al obtener las estadisticas" };
  }
};
