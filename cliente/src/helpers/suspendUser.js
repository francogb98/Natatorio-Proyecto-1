import { baseUrl } from "./url";

export const suspenderUser = async ({ content }) => {
  try {
    const resp = await fetch(`${baseUrl}user/suspenderUsuario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(content),
    });
    const data = await resp.json();
    return data;
  } catch (error) {
    return error;
  }
};
