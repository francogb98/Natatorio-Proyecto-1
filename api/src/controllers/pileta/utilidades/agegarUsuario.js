import { obtenerFechaYHoraArgentina } from "../../../Helpers/traerInfoDelDia.js";
import Pileta from "../../../models/models/Pileta.js";
import User from "../../../models/models/User.js";

export const agregarUsuario = async ({
  customId,
  nombre,
  actividad,
  pileta,
  horarioIngreso,
  horarioSalida,
}) => {
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
      pileta: horaIngresoActual !== horaActual ? "turnoSiguiente" : pileta,
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

  const user = await User.findOneAndUpdate(
    { customId: customId },
    {
      $addToSet: {
        asistencia: fecha,
      },
    },
    { new: true }
  );

  return {
    pileta: piletaExist,
    status: "success",
  };
};
