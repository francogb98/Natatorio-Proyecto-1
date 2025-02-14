import { baseUrl } from "../url";

export class QrFetch {
  static generarFecha = async () => {
    try {
      const url = `${baseUrl}user/generar-qr`;

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      });

      const data = await resp.json();

      return { data };
    } catch (error) {
      return error;
    }
  };

  static asistenciaPorQr = async (args) => {
    try {
      console.log(args);

      const url = `${baseUrl}user/asistencia-qr`;

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(args),
      });

      const data = await resp.json();

      return data;
    } catch (error) {
      console.log(error.message);

      return error;
    }
  };
}
