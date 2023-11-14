import { baseUrl } from "../url";

export const darDeBajaActividad = async (idActividad) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${baseUrl}user/darDeBajaActividad`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        idActividad,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
