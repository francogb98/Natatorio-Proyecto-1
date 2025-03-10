import { obtenerFechaYHoraArgentina } from "../../../Helpers/traerInfoDelDia.js";
import { Pileta } from "../../../models/index.js";
import { agregarUsuario } from "./agegarUsuario.js";

export const intercambioDeUsuarios = async () => {
  try {
    const { fecha, horaAnterior, hora } = obtenerFechaYHoraArgentina();

    const piletasTurnoAnterior = await Pileta.find({
      dia: fecha,
      hora: horaAnterior,
    }).populate({
      path: "users",
      populate: {
        path: "activity",
      },
    });

    await Promise.all(
      piletasTurnoAnterior.map(async (pileta) => {
        if (pileta.pileta === "turnoSiguiente") {
          await Promise.all(
            pileta.users.map(async (user) => {
              const actividad = user.activity.filter((act) => {
                let [inicioActividad] = act.hourStart.split(":").map(Number);
                let [finActividad] = act.hourFinish.split(":").map(Number);
                let [horaActual] = hora.split(":").map(Number);

                return (
                  inicioActividad <= horaActual && finActividad > horaActual
                );
              });

              if (actividad.length > 0) {
                try {
                  const resultado = await agregarUsuario({
                    customId: user.customId,
                    pileta: actividad[0].pileta,
                  });
                  if (resultado.status === "success") {
                    console.log("usuario agregado a pileta", user.customId);
                  }
                } catch (error) {
                  return res
                    .status(400)
                    .json({ status: "error", msg: error.message });
                }
              }
            })
          );
        }
      })
    );

    return { status: "success", msg: "ok" };
  } catch (error) {
    return { status: "error", msg: error.message };
  }
};
