import { baseUrl } from "../../url";

export const deleteNotificacion = async (data) => {
  const url = `${baseUrl}user/notificaciones/delete`;
  const token = localStorage.getItem("token") || "";

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      authorization: token,
    },
    body: JSON.stringify(data),
  });

  const respuesta = await resp.json();

  return respuesta;
};
