import { obtenerFechaYHoraArgentina } from "../../../Helpers/traerInfoDelDia.js";

import Pileta from "../../../models/models/Pileta.js";
import Activity from "../../../models/models/Actividades.js";
import User from "../../../models/models/User.js";

export const colocarInasistencia = async (req, res) => {
  try {
    const { hora, fecha, horaAnterior } = obtenerFechaYHoraArgentina();
    let date = new Date().toLocaleDateString("es-ES", {
      weekday: "long",
    });
    date = date.charAt(0).toUpperCase() + date.slice(1);

    if (date === "Miércoles") {
      date = "Miercoles";
    }

    const piletasAnterior = await Pileta.find({
      dia: fecha,
      hora: horaAnterior,
      pileta: { $ne: "turnoSiguiente" },
    }).select("users.customid");
    const customIds = piletasAnterior
      .map((pileta) => pileta.users.map((user) => user.customid))
      .flat();
    //busco
    const activity = await Activity.find({
      date: { $in: [date] },
      $and: [
        { hourStart: { $lte: horaAnterior } }, // Actividades que han comenzado antes o en este momento
        { hourFinish: { $gt: horaAnterior } }, // Actividades que aún no han finalizado
      ],
    }).populate({
      path: "users",
      select: "customId",
    });
    const allUsers = activity
      .map((activity) => activity.users.map((user) => user.customId))
      .flat();

    await Promise.all(
      allUsers.map(async (user) => {
        if (!customIds.includes(user)) {
          const userSearch = await User.findOne({ customId: user });
          //verifico que este habilitado
          if (userSearch.status) {
            //verifico que no sea de alguna actividad especial
            if (!userSearch.activity[0].actividadEspecial) {
              //verifico que no se le haya puesto la inasistencia en esta fecha
              if (!userSearch.inasistencias.includes(fecha)) {
                userSearch.inasistencias.push(fecha);
                await userSearch.save();
              }
            }
          }
        }
      })
    );
    return { status: "ok" };
  } catch (error) {
    console.log(error.message);
    return { status: "error" };
  }
};
