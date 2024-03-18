import { obtenerFechaYHoraArgentina } from "../../../Helpers/traerInfoDelDia.js";

import Activity from "../../../models/models/Actividades.js";
import User from "../../../models/models/User.js";
import Stadistics from "../../../models/models/Stadistics.js";

import moment from "moment";

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

const cantidad_inasistecias = async (actividad, asistencia) => {
  try {
    const estadistica = await Stadistics.find({
      activity: actividad,
    });

    const allDays = estadistica.reduce((acc, obj) => {
      acc.push(...obj.dias);
      return acc;
    }, []);

    const fechaAsistencia = moment(asistencia[0], "DD/MM/YYYY");
    let fechaCercana = null;
    let diferenciaMinima = Number.MAX_VALUE;

    for (const fecha of allDays) {
      const fechaComparar = moment(fecha, "DD/MM/YYYY");
      if (
        fechaComparar.isAfter(fechaAsistencia) &&
        fechaComparar.diff(fechaAsistencia, "days") < diferenciaMinima
      ) {
        fechaCercana = fecha;
        diferenciaMinima = fechaComparar.diff(fechaAsistencia, "days");
      }
    }

    if (!fechaCercana) {
      return 0;
    }

    const indice = allDays.indexOf(fechaCercana);
    const arr = allDays.slice(indice);

    return arr.length - (asistencia.length - 1);
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

const actividadesEspeciales = [
  "equipo de natacion mdc",
  "equipo de natacion artistica",
  "equipo e.n.m.b",
  "equipo de natacion masters",
];

//
export const verificacionEstadoUsuarios = async () => {
  try {
    const { horaAnterior, fecha } = obtenerFechaYHoraArgentina();

    let date = new Date().toLocaleDateString("es-ES", {
      weekday: "long",
    });
    date = date.charAt(0).toUpperCase() + date.slice(1);

    if (date === "Miércoles") {
      date = "Miercoles";
    }
    //buscar las actividades de la hora actual
    const activity = await Activity.find({
      date: { $in: [date] },
      hourStart: "14:00", // Actividades que han comenzado antes o en este momento
    }).populate({
      path: "users",
      select: "customId",
    });

    const allUsers = activity.reduce((acc, obj) => {
      acc.push(...obj.users);
      return acc;
    }, []);

    //recorrer todos los usuarios y verificar que el certificado de hongos este actualizado
    for (const user of allUsers) {
      const userSearch = await User.findOne({
        customId: user.customId,
      }).populate({
        path: "activity",
        populate: {
          path: "name",
        },
      });
      //si el certificado expiro y la diferencia es mayor a 10 pero menor a 14 mando una notificacion

      if (userSearch.status) {
        const expiro = calcular_fecha(userSearch.fechaCargaCertificadoHongos);

        if (expiro > 9 && expiro < 14) {
          userSearch.notificaciones.push({
            asunto: "Actualizar Certificado Pediculosis y Micosis",
            cuerpo: `Por favor Actualizar certificado de Pediculosis y Micosis o sera dado de baja en los proximos ${
              14 - expiro
            } Dias. Atte:Natatorio Olimpico`,
            fecha: fecha,
          });
          userSearch.save();
        }

        if (expiro > 14) {
          //borrar al usuario de la actividad
          const updatedActivity = await Activity.findOneAndUpdate(
            { _id: userSearch.activity[0]._id },
            { $pull: { users: userSearch._id } },
            { new: true }
          );

          if (updatedActivity) {
            userSearch.notificaciones.push({
              asunto: "Actividad dada de baja",
              cuerpo: `Debido a la no actualizacion del certificado de pediculosis y micosis
                   se le dio de baja de dicha activida, por favor cargar el
                   certificado actualizado y volver a inscribirse en la actividad.
                   Dias. Atte:Natatorio Olimpico`,
              fecha: fecha,
            });
            userSearch.activity = [];
            userSearch.status = false;
            userSearch.save();
          } else {
            console.log("No se pudo eliminar al usuario de la actividad.");
          }
        }

        if (!actividadesEspeciales.includes(userSearch.activity[0].name)) {
          const result = await cantidad_inasistecias(
            userSearch.activity[0]._id,
            userSearch.asistencia
          );

          if (result > 6) {
            const updatedActivity = await Activity.findOneAndUpdate(
              { _id: userSearch.activity[0]._id },
              { $pull: { users: userSearch._id } },
              { new: true }
            );

            if (updatedActivity) {
              userSearch.notificaciones.push({
                asunto: "Actividad dada de baja",
                cuerpo: `Debido a la cantidad de inasistencias
                   se le dio de baja de dicha activida, por favor en caso de desear continuar asistiendo al natatorio volver a inscribirse en una actividad. Atte:Natatorio Olimpico`,
                fecha: fecha,
              });
              userSearch.activity = [];
              userSearch.status = false;
              userSearch.save();
            } else {
              console.log("No se pudo eliminar al usuario de la actividad.");
            }
          }
        }
      }
    }

    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
