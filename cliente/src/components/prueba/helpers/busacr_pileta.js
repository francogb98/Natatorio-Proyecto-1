import { baseUrl } from "../../../helpers/url";

export const buscar_piletas = async (content) => {
  const res = await fetch(`${baseUrl}pileta/obtenerPileta`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(content),
  });
  const data = await res.json();

  return data;
};
