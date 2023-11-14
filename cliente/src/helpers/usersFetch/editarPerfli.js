import { baseUrl } from "../url";

export const editarPerfilFetch = async (data) => {
  const response = await fetch(baseUrl + "user/editarUsuario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const res = await response.json();

  return res;
};
