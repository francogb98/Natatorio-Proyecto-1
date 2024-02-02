import { baseUrl } from "../url";

export const cambioDeTurno = async () => {
  try {
    const resp = await fetch(`${baseUrl}pileta/cambioDeTurno`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });

    const data = await resp.json();

    return data;
  } catch (error) {
    return error.message;
  }
};
