import { obtenerFechaYHoraArgentina } from "../../../Helpers/traerInfoDelDia.js";

import Pileta from "../../../models/models/Pileta.js";
import Activity from "../../../models/models/Actividades.js";
import User from "../../../models/models/User.js";

function calcular_fecha(fecha_carga) {
  // Convertir la cadena de fecha en un objeto de fecha
  var partesFecha = fecha_carga.split("/");

  // Crear el objeto de fecha
  var fecha = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
  // Obtener la fecha actual
  var fechaActual = new Date();

  fecha.setMonth(fecha.getMonth() + 1);
  // Calcular la diferencia en milisegundos
  var diferenciaMilisegundos = fechaActual - fecha;
  // Convertir la diferencia de milisegundos a días
  var diasPasados = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

  return diasPasados;
}

const actividadesEspeciales = [
  "equipo de natacion mdc",
  "equipo de natacion artistica",
  "equipo e.n.m.b",
  "equipo de natacion masters",
];

const borrarUsuarioDeActividad = async (activityId, userId) => {
  try {
    const activity = await Activity.findById(activityId);
    if (!activity) {
      throw new Error("La actividad no fue encontrada.");
    }

    // Verificar si el usuario está presente en la actividad
    const index = activity.users.indexOf(userId);
    if (index === -1) {
      throw new Error("El usuario no está registrado en esta actividad.");
    }

    // Eliminar al usuario de la lista de usuarios de la actividad
    activity.users.splice(index, 1);
    activity.userRegister = activity.userRegister - 1;

    // Guardar la actividad actualizada
    await activity.save();

    return activity;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

const funcion_actualizar_usuario = async (user, customIds) => {
  try {
    const { fecha } = obtenerFechaYHoraArgentina();
    const userSearch = await User.findOne({ customId: user });
    if (userSearch.status) {
      // Controlar fecha de carga certificado de hongos
      if (!userSearch.fechaCargaCertificadoHongos) {
        // Mandar notificacion al usuario de que cargue el certificado.
        userSearch.notificaciones.push({
          asunto: "Cargar Certificado Pediculosis y Micosis",
          cuerpo:
            "Por favor cargar certificado de Pediculosis y Micosis o sera dado de baja en los proximos 14 Dias. Atte:Natatorio Olimpico",
          fecha: fecha,
        });
        // Ponerle la fecha del dia de hoy menos un mes, para que asi tenga 14 dias para cargar o sera dado de baja.
        userSearch.fechaCargaCertificadoHongos = fecha;
      } else {
        const expiro = calcular_fecha(userSearch.fechaCargaCertificadoHongos);

        // si expiro es mayor a 10 y menor a 14 se le envia una notificacion de que esta pronto a vencer su certificado
        if (expiro > 10 && expiro < 14) {
          userSearch.notificaciones.push({
            asunto: "Actualizar Certificado Pediculosis y Micosis",
            cuerpo: `Por favor Actualizar certificado de Pediculosis y Micosis o sera dado de baja en los proximos ${
              14 - expiro
            } Dias. Atte:Natatorio Olimpico`,
            fecha: fecha,
          });
        } else if (expiro > 14) {
          // Si expiro es mayot o igual a 14 se da de baja al usuario de la actividad.
          userSearch.activity = [];
          userSearch.status = false;
          userSearch.inasistencias = [];
          // Enviamos una notificacion al Usuario de la dada de baja.
          userSearch.notificaciones.push({
            asunto: "Actividad dada de baja",
            cuerpo: `Debido a no actualizar el certificado de Pediculosis y Micosis en los terminos, se le a dado de baja de su actividad, para volver a inscribirse en una actividad por favor actualizar el certificado. Atte:Natatorio Olimpico`,
            fecha: fecha,
          });
          // Reiniciamos las inasistencias
          // borramos al usuario de la actividad
          const result = await borrarUsuarioDeActividad(
            userSearch.activity[0],
            userSearch._id
          );

          if (!result) {
            return res
              .status(400)
              .json({ status: "error", msg: "error en el servidor" });
          }
        }
      }
      // Busco si el usuario accedio al dia de hoy a la pileta
      if (!customIds.includes(userSearch.customId)) {
        //verifico que no sea de alguna actividad especial
        if (!actividadesEspeciales.includes(userSearch.activity[0].name)) {
          //verifico que no se le haya puesto la inasistencia en esta fecha

          if (!userSearch.inasistencias.includes(fecha)) {
            if (userSearch.inasistencias.length > 5) {
              //si el usuario tiene 5 o mas inasistencias lo doy de baja de la actividad.
              const result = await borrarUsuarioDeActividad(
                userSearch.activity[0],
                userSearch._id
              );
              if (!result) {
                return res
                  .status(400)
                  .json({ status: "error", msg: "error en el servidor" });
              }
              // Hago una notificacion con el aviso de la dada de baja debido a las inasistencias.
              userSearch.notificaciones.push({
                asunto: "Actividad dada de baja",
                cuerpo: `Debido a las inasistencias el usuario fue dado de baja. Atte:Natatorio Olimpico`,
                fecha: fecha,
              });
              // reinicio las Inasistencias, y el campo actividad del usuario.
              userSearch.activity = [];
              userSearch.status = false;
              userSearch.inasistencias = [];
            } else {
              userSearch.inasistencias.push(fecha);
            }
          }
        }
      }
    }

    await userSearch.save();
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

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
        const result = await funcion_actualizar_usuario(user, customIds);

        if (!result) {
          return res.status(400).json({ msg: "error en el servidor" });
        }
      })
    );
    return { status: "ok" };
  } catch (error) {
    console.log(error.message);
    return { status: "error" };
  }
};
