import { baseUrl } from "./url";

export const getUsuarios = async () => {
  const res = await fetch(baseUrl + "user/getAllUsers/paraHabilitar");
  const data = await res.json();
  return data;
};
export const getAllUsuarios = async () => {
  const res = await fetch(baseUrl + "user/getAllUsers");
  const data = await res.json();
  return data;
};

export const getUser = async ({ id }) => {
  const res = await fetch(baseUrl + "user/infoUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();

  return data;
};
