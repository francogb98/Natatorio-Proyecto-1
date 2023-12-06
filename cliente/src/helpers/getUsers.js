import { baseUrl } from "./url";

export const getUsuarios = async () => {
  try {
    const res = await fetch(baseUrl + "user/getAllUsers/paraHabilitar");
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};
export const getAllUsuarios = async () => {
  try {
    const res = await fetch(baseUrl + "user/getAllUsers");
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getUser = async ({ id }) => {
  try {
    const res = await fetch(baseUrl + "user/infoUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
};
