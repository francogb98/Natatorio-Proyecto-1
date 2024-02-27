import { obtenerFechaYHoraArgentina } from "../../../Helpers/traerInfoDelDia.js";
import Pileta from "../../../models/models/Pileta.js";

export const agregarUsuario = async ({
  customId,
  nombre,
  actividad,
  pileta,
  horarioSalida,
  piletaTurnoSiguiente,
}) => {
  const { hora, fecha } = obtenerFechaYHoraArgentina();

  const resultado = await Pileta.find({
    dia: fecha,
    hora: hora,
  });

  const piletaExist = await Pileta.findOneAndUpdate(
    {
      pileta: pileta,
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
          actividad: actividad,
          horarioSalida: horarioSalida,
          piletaTurnoSiguiente: piletaTurnoSiguiente,
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
};
