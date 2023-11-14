import { baseUrl } from "../url";

///suspender ususairo

export const suspenderUsuario = async ({ content }) => {
  const resp = await fetch(baseUrl + "user/suspenderUsuario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(content),
  });

  const data = await resp.json();
  return data;
};