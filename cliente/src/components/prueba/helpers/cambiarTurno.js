import { baseUrl } from "../../../helpers/url";

export const cambioTurno = async () => {
  // es la peticion de arriba pero es un patch y tengo que enviar un body
  const res = await fetch(`${baseUrl}pileta`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};
