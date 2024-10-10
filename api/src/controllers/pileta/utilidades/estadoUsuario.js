import { Activity, User, UsuariosFalta } from "../../../models/index.js";

import { obtenerFechaYHoraArgentina } from "../../../Helpers/traerInfoDelDia.js";

function calcular_fecha(fecha_carga) {
  // Convertir la cadena de fecha en un objeto de fecha
  var partesFecha = fecha_carga.split("/");
  var fecha = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
  var fechaFin = new Date().getTime();
  var diff = fechaFin - fecha;
  var diasPasadoss = Math.floor(diff / (1000 * 60 * 60 * 24));

  return diasPasadoss;
}

const obtenerFecha = () => {
  const dateNow = new Date();
  const day = dateNow.getDate();
  const month = dateNow.getMonth() + 1;
  const year = dateNow.getFullYear();

  const dateNowSave = `${day}/${month}/${year}`;
  return dateNowSave;
};

async function dar_de_baja({ userID, actividad, diferenciaDias }) {
  try {
    const user = await User.findById(userID);
    const activity = await Activity.findOneAndUpdate(
      { _id: actividad },
      { $pull: { users: user._id } },
      //disminuyo el campo de userregister
      { new: true }
    );

    let asunto = "Baja de actividad";
    let cuerpo = `Usted ha sido dado de baja de la actividad: ${
      activity.name
    } , en el horario de: en el horario de: ${activity.hourStart} - ${
      activity.hourFinish
    }, en los dias: ${activity.date.join(
      " - "
    )}. Debido a que pasaron mas de ${diferenciaDias} Dias de su ultima asistencia.Ultima asistencia registrada: ${
      user.asistencia[user.asistencia.length - 1]
    } .Por cualquier duda comunicarse con administracion.`;

    //borro el campo activity del usuario
    user.activity = user.activity.filter(
      (activity) => activity._id.toString() !== actividad.toString()
    );

    //creo una notificacion para el usuario

    if (!user.notificaciones) {
      user.notificaciones = [];
    }

    user.notificaciones.push({
      asunto: asunto,
      cuerpo: cuerpo,
      fecha: obtenerFecha(),
    });

    await user.save();
    console.log({ usuario: user.customId });
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

export const verificacionEstadoUsuarios = async (req, res, next) => {
  try {
    const { horaAnterior, fecha } = obtenerFechaYHoraArgentina();

    let date = new Date().toLocaleDateString("es-ES", {
      weekday: "long",
    });
    date = date.charAt(0).toUpperCase() + date.slice(1);
    if (date === "Miércoles") date = "Miercoles";

    // Buscar actividades de la hora actual
    const activities = await Activity.find({
      date: { $in: [date] },
      hourStart: horaAnterior,
    }).populate({
      path: "users",
      select: "customId fechaCargaCertificadoHongos asistencia activity", // Selecciona solo lo necesario
    });

    const allUsers = activities.flatMap((activity) => activity.users);
    await Promise.all(
      allUsers.map(async (user) => {
        let ultimaAsistencia = user.asistencia[user.asistencia.length - 1];
        if (typeof ultimaAsistencia !== "string") {
          ultimaAsistencia = fecha;
        }
        const diferenciaDias = calcular_fecha(ultimaAsistencia);

        //SI PASARON MAS DE 30 DIAS DOY DE BAJA AL USUARIO
        if (diferenciaDias > 30) {
          // Usar Promise.all para manejar múltiples promesas
          const resp = await Promise.all(
            user.activity.map(async (actividad) => {
              return await dar_de_baja({
                userID: user._id,
                actividad,
                diferenciaDias,
              });
            })
          );

          // Verificar si alguna de las respuestas fue un error
          if (resp.some((result) => !result)) {
            const error = new Error("Error al dar de baja al usuario");
            console.log(error.message);
          }
        } else {
          if (!user.fechaCargaCertificadoHongos) {
            user.fechaCargaCertificadoHongos = fecha;
          }

          const expiro = calcular_fecha(user.fechaCargaCertificadoHongos);

          if (!user.notificaciones) {
            user.notificaciones = [];
          }

          if (expiro > 35 && expiro < 45) {
            user.notificaciones.push({
              asunto: "Actualizar Certificado Pediculosis y Micosis",
              cuerpo: `Por favor Actualizar certificado de Pediculosis y Micosis o sera dado de baja en los proximos ${
                45 - expiro
              } Dias. Atte: Natatorio Olimpico`,
              fecha: fecha,
            });
            await user.save();
          }
          if (expiro >= 45) {
            let falta = await UsuariosFalta.findOne({
              motivo: "certificado_expirado",
            });

            if (!falta) {
              const nuevo = new UsuariosFalta({
                motivo: "certificado_expirado",
                users: [user],
              });
              await nuevo.save();
            } else {
              await UsuariosFalta.findOneAndUpdate(
                { motivo: "certificado_expirado" },
                { $addToSet: { users: user._id } },
                { new: true }
              );
            }
          }
        }
      })
    );

    next();
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ msg: "error en el servidor" });
  }
};
