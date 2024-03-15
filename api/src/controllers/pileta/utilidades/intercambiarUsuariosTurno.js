import { obtenerFechaYHoraArgentina } from "../../../Helpers/traerInfoDelDia.js";
import Pileta from "../../../models/models/Pileta.js";
import { agregarUsuario } from "./agegarUsuario.js";

export const intercambioDeUsuarios = async () => {
  const { hora, fecha, horaAnterior } = obtenerFechaYHoraArgentina();

  const piletasAnterior = await Pileta.find({ dia: fecha, hora: horaAnterior });

  //verifico todos los usuarios de las piletas anteriores, en caso de que su horario de salida sea mayor que la hora actual los agrego a las piletas del turno actual
  const resultado = await Promise.all(
    piletasAnterior.map(async (pileta) => {
      return await Promise.all(
        pileta.users.map(async (user) => {
          let [horaActual] = hora.split(":");
          let [horarioSalida] = user.horarioSalida.split(":");

          // verificamos que el horario de salida, sea mayor al horario actual
          if (horarioSalida > horaActual) {
            const resultado = await agregarUsuario({
              customId: user.customid,
              nombre: user.nombre,
              actividad: user.actividad,
              pileta: user.pileta,
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
