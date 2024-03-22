import Activity from "../../../models/models/Actividades.js";
import User from "../../../models/models/User.js";
import UsuariosFalta from "../../../models/models/UsuariosFaltas.js";

import { obtenerFechaYHoraArgentina } from "../../../Helpers/traerInfoDelDia.js";
import { cantidad_inasistecias } from "../../../Helpers/cantidad_inasistencias.js";

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
      hourStart: horaAnterior, // Actividades que han comenzado antes o en este momento
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
          let falta = await UsuariosFalta.findOne({
            motivo: "certificado_expirado",
          });

          if (!falta) {
            const nuevo = new UsuariosFalta({
              motivo: "certificado_expirado",
              users: [userSearch], // Agregar users como un array con el primer elemento userSearch
            });
            await nuevo.save();
          } else {
            await UsuariosFalta.findOneAndUpdate(
              { motivo: "certificado_expirado" },
              { $addToSet: { users: userSearch } },
              { new: true }
            );
          }
        }

        if (!actividadesEspeciales.includes(userSearch.activity[0].name)) {
          const result = await cantidad_inasistecias(
            userSearch.activity[0]._id,
            userSearch.asistencia
          );

          if (result > 6) {
            let falta = await UsuariosFalta.findOne({
              motivo: "excedio_faltas",
            });

            if (!falta) {
              const nuevo = new UsuariosFalta({
                motivo: "excedio_faltas",
                users: [userSearch], // Agregar users como un array con el primer elemento userSearch
              });
              await nuevo.save();
            } else {
              await UsuariosFalta.findOneAndUpdate(
                { motivo: "excedio_faltas" },
                { $addToSet: { users: userSearch } },
                { new: true }
              );
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
