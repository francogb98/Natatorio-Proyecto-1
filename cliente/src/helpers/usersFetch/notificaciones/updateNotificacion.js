import { baseUrl } from "../../url";

export const updateNotificacion = async (idNotificacion) => {
  const url = `${baseUrl}user/notificaciones/update`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(idNotificacion),
  });

  const data = await resp.json();

  return data;
};
