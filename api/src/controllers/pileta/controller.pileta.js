import { Pileta, User, Stadistic, Activity } from "../../models/index.js";

import { obtenerFechaYHoraArgentina } from "../../Helpers/traerInfoDelDia.js";

import { agregarUsuario } from "./utilidades/agegarUsuario.js";
import { intercambioDeUsuarios } from "./utilidades/intercambiarUsuariosTurno.js";
import { crearPileta } from "./utilidades/crearPileta.js";

export class PiletaController {
  static getInfoPiletas = async (req, res) => {
    try {
      const { hora, fecha, mesNombre } = obtenerFechaYHoraArgentina();

      const piletas = await Pileta.find({
        dia: fecha,
        hora: hora,
      }).populate({
        path: "users",
        populate: {
          path: "activity",
        },
      });

      return res.status(200).json({ resultado: piletas });
    } catch (error) {
      console.log(error.message, "es aqio");

      return res.status(500).json({
        message: "Hable con el administrador",
      });
    }
  };

  static agregarUsuarioAPileta = async (req, res) => {
    const { customId, pileta, horarioIngreso, horarioSalida } = req.body;

    try {
      const { hora, fecha, diaNombre } = obtenerFechaYHoraArgentina();

      let [horaActual] = hora.split(":");
      let [horaIngresoUsuario] = horarioIngreso.split(":");

      // Validation: Check if the user is in the allowed time range
      if (
        horaIngresoUsuario > horaActual &&
        horaIngresoUsuario - horaActual >= 2
      ) {
        return res.status(400).json({
          status: "error",
          message:
            "El usuario todavia no esta en horario de ser registrado. Acceso denegado",
        });
      }

      if (
        horaIngresoUsuario < horaActual &&
        horaActual - horaIngresoUsuario >= 2
      ) {
        return res.status(400).json({
          status: "error",
          message:
            "El usuario todavia no esta en horario de ser registrado. Acceso denegado",
        });
      }

      // Check if the pool for the given date and time exists
      const resultadoPileta = await Pileta.find({
        dia: fecha,
        hora: hora,
      });

      if (!resultadoPileta.length) {
        return res.status(400).json({
          status: "error",
          message: "Iniciar nuevo turno",
        });
      }

      // Fetch the user details and validate their activities
      const user = await User.findOne({ customId: customId }).populate({
        path: "activity",
        populate: {
          path: "name",
        },
      });

      // Check if the user activity corresponds to the current day
      if (user.activity[0].codigoDeAcceso == null) {
        if (!user.activity[0].date.includes(diaNombre)) {
          return res.status(400).json({
            status: "error",
            message:
              "La actividad del usuario no corresponde al dia actual. Acceso denegado",
          });
        }
      }

      // Check for second activity
      if (user.activity[1] && user.activity[1]?.codigoDeAcceso == null) {
        if (!user.activity[1]?.date.includes(diaNombre)) {
          return res.status(400).json({
            status: "error",
            message:
              "La actividad del usuario no corresponde al dia actual. Acceso denegado",
          });
        }
      }

      // Add the user to the pool (Pileta)
      const resultado = await agregarUsuario({
        customId,
        pileta,
        horaIngresoUsuario,
      });

      if (resultado.status === "error") {
        return res.status(400).json({
          status: "error",
          message: resultado.message,
        });
      }

      // Update the user's attendance
      const resultadoAsistencia = await asistenciaUsuario(customId, fecha);
      if (resultadoAsistencia.status === "error") {
        return res.status(400).json({
          status: "error",
          message: resultado.message,
        });
      }

      // Update user statistics
      await actualizarEstadistica(resultadoAsistencia.user);

      // Return success response
      return res.status(200).json({
        status: "success",
        resultado,
        user: customId,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        status: "error",
        message: "Hable con el administrador",
      });
    }
  };

  static verificarCambioDeTurno = async (req, res, next) => {
    try {
      const { hora, fecha } = obtenerFechaYHoraArgentina();
      const resultado = await Pileta.find({
        dia: fecha,
        hora: hora,
      });
      if (resultado.length) {
        return res.status(400).json({
          status: "error",
          message: "Todavia no es hora de cambiar el turno",
        });
      }
      next();
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: "Error en el servidor",
      });
    }
  };

  static iniciarTurno = async (req, res) => {
    try {
      const crear = await crearPileta();
      if (crear.status == "error") {
        return res
          .status(400)
          .json({ status: "error", message: "error en el servidor" });
      }
      //ejecuto el cambio de turn
      const resultadoCambio = await intercambioDeUsuarios();
      if (resultadoCambio.status === "error") {
        return res.status(400).json({
          status: "error",
          message: resultadoCambio.message,
        });
      }

      return res.status(200).json({
        status: "ok",
        message: "Horario cambiado con exito!,",
      });
    } catch (error) {
      console.log(error.message);
      return res
        .status(400)
        .json({ status: "error", message: "error en el servidor" });
    }
  };

  static eliminarUsuarioDePileta = async (req, res) => {
    const { customid } = req.body;

    const { hora, fecha } = obtenerFechaYHoraArgentina();

    try {
      const [pileta] = await Pileta.find({
        dia: fecha,
        hora: hora,
        "users.customid": customid,
      });

      pileta.users = pileta.users.filter((user) => user.customid !== customid);

      await pileta.save();

      return res.status(200).json({
        status: "success",
        pileta,
        message: "Usuario eliminado de la pileta",
      });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        message: "Error en el servidor, hable con el administrador",
      });
    }
  };

  static obtener_pileta = async (req, res) => {
    try {
      const { dia, hora } = req.body;
      const pileta = await Pileta.find({
        dia,
        hora,
      }).populate({
        path: "users",
        populate: {
          path: "activity",
        },
      });

      if (!pileta.length) {
        return res
          .status(401)
          .json({ status: "error", msg: "pileta no encontrada" });
      }

      return res.status(200).json({ status: "success", pileta });
    } catch (error) {
      console.log(error.message);
    }
  };

  static sin_conexion = async (req, res) => {
    try {
      const { horaAnterior, fecha } = obtenerFechaYHoraArgentina();
      let date = new Date().toLocaleDateString("es-ES", { weekday: "long" });
      date = date.charAt(0).toUpperCase() + date.slice(1);
      if (date === "Miércoles") date = "Miercoles";

      const crear = await crearPileta();
      if (crear.status == "error") {
        return res
          .status(400)
          .json({ status: "error", message: "error en el servidor" });
      }

      // Buscar actividades de la hora actual
      const activities = await Activity.find({
        date: { $in: [date] },
        hourStart: horaAnterior,
      }).populate({
        path: "users",
        select: "customId asistencia activity",
      });
      const allUsers = activities.flatMap((activity) => activity.users);

      await Promise.all(
        allUsers.map(async (user) => {
          const resultadoAsistencia = await asistenciaUsuario(
            user.customId,
            fecha
          );
          if (resultadoAsistencia.status === "error") {
            return res
              .status(400)
              .json({ status: "error", message: resultado.message });
          }
        })
      );

      return res.status(200).json({
        message: "Turno anulado. Asistencia colocada a los usuarios",
        status: "success",
      });
    } catch (error) {
      console.log(error.message);

      return res.status(500).json({
        message: "Error en el servidor, hable con el administrador",
        status: "error",
      });
    }
  };
}

export const actualizarEstadistica = async (user) => {
  try {
    const { mesNombre, fecha } = obtenerFechaYHoraArgentina();
    // Buscar la estadística para la actividad y el mes correspondiente
    const estadisticaExistente = await Stadistic.findOne({
      activity: user.activity[0]._id,
      mes: mesNombre,
    });

    if (!estadisticaExistente) {
      // Si no existe una estadística para la actividad y el mes, crear una nueva
      const nuevaEstadistica = new Stadistic({
        usersQuantity: 1,
        dias: [fecha], // Asegúrate de guardar la fecha como un array si esperas múltiples fechas
        mes: mesNombre,
        activity: user.activity[0]._id,
      });
      await nuevaEstadistica.save();
    } else {
      // Si ya existe una estadística para la actividad y el mes, actualizarla
      estadisticaExistente.usersQuantity += 1;

      if (!estadisticaExistente.dias.includes(fecha)) {
        estadisticaExistente.dias.push(fecha); // Asegúrate de guardar la fecha como un array si esperas múltiples fechas
      }
      await estadisticaExistente.save();
    }

    return { status: "success" };
  } catch (error) {
    console.error("Error al actualizar la estadística:", error.message);
    return { status: "error", message: "Ocurrió un error" };
  }
};

export const asistenciaUsuario = async (customId, fecha) => {
  try {
    const user = await User.findOneAndUpdate(
      { customId: customId },
      {
        $addToSet: {
          asistencia: fecha,
        },
        $unset: {
          inasistencias: "", // Puedes poner cualquier valor en blanco aquí
        },
      },
      { new: true }
    );

    return {
      status: "success",
    };
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ status: "error" });
  }
};
