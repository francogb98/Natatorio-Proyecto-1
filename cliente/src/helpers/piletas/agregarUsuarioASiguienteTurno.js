import { baseUrl } from "../url";

export const agregarUsuarioApiletaTurnoSiguiente = async (idUsuario) => {
  try {
    const url = `${baseUrl}pileta/addNextTurn`;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id: idUsuario }),
    });
    const data = await resp.json();
    return data;
  } catch (error) {
    return error;
  }
};
