import { baseUrl } from "../../url";

export const cambiarFoto = async (data) => {
  try {
    const url = `${baseUrl}user/cambiarFoto`;
    const resp = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
        authorization: localStorage.getItem("token") || "",
      },
    });
    const { status, user } = await resp.json();
    if (status === "success") {
      return user;
    } else {
      throw new Error("No se pudo cambiar la foto");
    }
  } catch (error) {
    return error;
  }
};
