import { obtenerFechaYHoraArgentina } from "../../../Helpers/traerInfoDelDia.js";
import { Pileta } from "../../../models/index.js";

export const agregarUsuario = async ({
  customId,
  nombre,
  apellido,
  actividad,
  pileta,
  horarioIngreso,
  horarioSalida,
}) => {
  try {
    const { hora, fecha } = obtenerFechaYHoraArgentina();

    const resultado = await Pileta.find({
      dia: fecha,
      hora: hora,
    });
    let [horaActual] = hora.split(":");
    let [horaIngresoActual] = horarioIngreso.split(":");
    // turnoSiguiente
    const piletaExist = await Pileta.findOneAndUpdate(
      {
        pileta: horaIngresoActual > horaActual ? "turnoSiguiente" : pileta,
        dia: fecha,
        hora: hora,
        "users.customid": { $ne: customId }, // Asegura que el usuario no esté en la lista ya
      },
      {
        $addToSet: {
          // Utiliza $addToSet en lugar de $push
          users: {
            customid: customId,
            nombre: nombre,
            apellido,
            pileta: pileta,
            actividad: actividad,
            horarioSalida: horarioSalida,
            horarioIngreso: horarioIngreso,
            piletaTurnoSiguiente: horaIngresoActual !== horaActual ?? false,
          },
        },
      },
      {
        new: true,
      }
    );

    return {
      pileta: piletaExist,
      status: "success",
    };
  } catch (error) {
    console.log(error.message);
    return {
      status: "error",
    };
  }
};
