import { baseUrl } from "../../url";

export const crearNotificacion = async (data) => {
  try {
    const url = `${baseUrl}/notificaciones/create`;

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const { status, message } = await resp.json();

    if (status === "error") {
      return { status, message };
    }

    return { status, message };
  } catch (error) {
    return error;
  }
};
