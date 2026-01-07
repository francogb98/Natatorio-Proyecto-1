import { baseUrl } from "../url";

export class peticiones {
  static getPeticiones = async (estado) => {
    const res = await fetch(`${baseUrl}peticion/${estado}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();

    return data;
  };
  static createPeticion = async ({ userId, actividadId, content }) => {
    try {
      const res = await fetch(`${baseUrl}peticion/${userId}/${actividadId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(content), // Mover aquí
      });
      const data = await res.json();

      return data;
    } catch (error) {
      return false;
    }
  };

  static aceptarPeticion = async ({ id }) => {
    const res = await fetch(`${baseUrl}peticion/aceptar/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();

    return data;
  };
  static denegarPeticion = async ({ id }) => {
    const res = await fetch(`${baseUrl}peticion/denegar/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();

    return data;
  };
}
