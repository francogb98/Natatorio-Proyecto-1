import { obtenerFechaYHoraArgentina } from "../../../Helpers/traerInfoDelDia.js";
import Pileta from "../../../models/models/Pileta.js";

export const crearPileta = async () => {
  try {
    const { hora, fecha } = obtenerFechaYHoraArgentina();
    const piletas = ["pileta 25", "pileta 50", "turnoSiguiente"];

    for (const nombrePileta of piletas) {
      const data = await Pileta.find({
        pileta: nombrePileta,
        dia: fecha,
        hora: hora,
      });

      if (data.length) {
        // Si hay datos, devuelve el objeto con la información de la pileta y el estado "ok"
        return { pileta: data, status: "ok" };
      } else {
        // Si no hay datos, crea una nueva entrada en la base de datos para la pileta actual
        const pileta = new Pileta({
          pileta: nombrePileta,
          dia: fecha,
          hora: hora,
        });
        await pileta.save();
        return { pileta, status: "ok" };
      }
    }
  } catch (error) {
    console.log(error.message);
    return { status: "error" };
  }
};
