import { baseUrl } from "../url";

export const inhabilitarUsuario = async (data) => {
  try {
    const url = `${baseUrl}user/deshabilitar`;

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    });

    const body = await resp.json();

    return body;
  } catch (error) {
    return error;
  }
};

//comentario
