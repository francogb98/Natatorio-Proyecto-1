import { baseUrl } from "../url";

//ruta para eliminar actividad

export const deleteActivity = async ({ id }) => {
  const url = `${baseUrl}activity/deleteActivity/${id}`;
  const resp = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  });
  const data = await resp.json();
  return data;
};
