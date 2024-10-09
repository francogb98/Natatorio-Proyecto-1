import { obtenerFechaYHoraArgentina } from "../../../Helpers/traerInfoDelDia.js";
import { Pileta } from "../../../models/index.js";

export const crearPileta = async () => {
  try {
    const { hora, fecha } = obtenerFechaYHoraArgentina();
    const piletas = ["pileta 25", "pileta 50", "turnoSiguiente"];
    const piletasCreadas = [];

    for (const nombrePileta of piletas) {
      const data = await Pileta.find({
        pileta: nombrePileta,
        dia: fecha,
        hora: hora,
      });

      if (data.length) {
        // Si hay datos, agrega el objeto con la información de la pileta a la lista de piletas creadas
        piletasCreadas.push({ pileta: data, status: "ok" });
      } else {
        // Si no hay datos, crea una nueva entrada en la base de datos para la pileta actual
        const pileta = new Pileta({
          pileta: nombrePileta,
          dia: fecha,
          hora: hora,
        });
        await pileta.save();
        // Agrega la nueva pileta a la lista de piletas creadas
        piletasCreadas.push({ pileta, status: "ok" });
      }
    }

    // Retorna la lista de piletas creadas
    return piletasCreadas;
  } catch (error) {
    console.log(error.message);
    return { status: "error" };
  }
};
