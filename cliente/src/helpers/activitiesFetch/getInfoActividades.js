import { baseUrl } from "../url";

export const getInfoActividades = async (id) => {
  console.log(id);
  try {
    const response = await fetch(`${baseUrl}activity/getActividad/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return error.message;
  }
};
