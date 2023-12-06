import { baseUrl } from "../url";

export const comprobarDatos = async (data) => {
  try {
    const url = `${baseUrl}user/comprobar-datos`;
    const body = {
      dni: data.dni,
      telefono: data.telefono,
    };
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const datos = await resp.json();
    return datos;
  } catch (error) {
    return error;
  }
};

export const modificarContraseña = async (data) => {
  try {
    const url = `${baseUrl}user/modificar-password`;
    const body = {
      dni: data.dni,
      password: data.password,
    };
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const datos = await resp.json();
    return datos;
  } catch (error) {
    return error;
  }
};
