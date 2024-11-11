import { baseUrl } from "../url";

export class PiletaFetch {
  static agregarUsuarioAlTurno = async (content) => {
    // es la peticion de arriba pero es un patch y tengo que enviar un body
    const res = await fetch(`${baseUrl}pileta`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    });
    const data = await res.json();
    return data;
  };

  static anularTurno = async () => {
    // es la peticion de arriba pero es un patch y tengo que enviar un body
    const res = await fetch(`${baseUrl}pileta/sinConexion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  };
}
