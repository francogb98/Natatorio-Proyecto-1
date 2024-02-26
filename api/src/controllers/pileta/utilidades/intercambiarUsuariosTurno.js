import { obtenerFechaYHoraArgentina } from "../../../Helpers/traerInfoDelDia.js";
import Pileta from "../../../models/models/Pileta.js";
import { agregarUsuario } from "./agegarUsuario.js";

export const intercambioDeUsuarios = async () => {
  const { hora, fecha, horaAnterior } = obtenerFechaYHoraArgentina();

  const piletasAnterior = await Pileta.find({ dia: fecha, hora: horaAnterior });

  //verifico todos los usuarios de las piletas anteriores, en caso de que su horario de salida sea mayor que la hora actual los agrego a las pieltas del turno actual
  const resultado = await Promise.all(
    piletasAnterior.map(async (pileta) => {
      return await Promise.all(
        pileta.users.map(async (user) => {
          if (user.horarioSalida > hora) {
            const resultado = await agregarUsuario({
              customId: user.customid,
              nombre: user.nombre,
              actividad: user.actividad,
              pileta:
                pileta.pileta === "turnoSiguiente"
                  ? user.piletaTurnoSiguiente
                  : pileta.pileta,
              horarioSalida: user.horarioSalida,
            });
            if (resultado.status === "error") {
              return resultado.message;
            }
          }
        })
      );
    })
  );
};
