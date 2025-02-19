import { obtenerFechaYHoraArgentina } from "../../Helpers/traerInfoDelDia.js";
import { Activity, User } from "../../models/index.js";
import jwt from "jsonwebtoken";
import { agregarUsuario } from "../pileta/utilidades/agegarUsuario.js";
import {
  actualizarEstadistica,
  asistenciaUsuario,
} from "../pileta/controller.pileta.js";

const estaEnRango = (startTime, endTime, currentTime) => {
  // Función para convertir "HH:MM" a minutos desde medianoche
  const toMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  const current = toMinutes(currentTime);

  return current >= start && current <= end;
};

export class userController {
  static getUser = async (req, res) => {
    try {
      const { token } = req.params;

      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById({ _id: id }).populate({
        path: "activity",
        populate: {
          path: "name",
        },
      });

      if (!user.activity) {
        user.activity = [];
      }

      res.status(200).json({ status: "success", user });
    } catch (error) {
      res.status(404).json({ status: "error", message: error.message });
    }
  };

  static getUserById = async (req, res) => {
    try {
      const { id, type } = req.params;
      // Crear el objeto de consulta
      const query = { [type]: id }; // Usar notación de corchetes para crear el objeto de consulta
      const users = await User.find(query).populate({
        path: "activity",
        populate: {
          path: "name",
        },
      });

      if (!users.length) {
        const usersByLastName = await User.find({ dni: id }).populate({
          path: "activity",
          populate: {
            path: "name",
          },
        });

        if (!usersByLastName.length) {
          return res
            .status(404)
            .json({ status: "error", message: "Usuario no encontrado" });
        }
        return res
          .status(200)
          .json({ status: "success", users: usersByLastName });
      }

      return res.status(200).json({ status: "success", users });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: "error", message: "Error en el servidor" });
    }
  };

  static getUserByLastName = async (req, res) => {
    try {
      const { apellido } = req.params;

      console.log(apellido.customId, "entre aqui");

      const usersByLastName = await User.find({
        apellido: {
          $regex: new RegExp(apellido, "i"), // 'i' indica insensibilidad a mayúsculas y minúsculas
        },
      }).populate({
        path: "activity",
        populate: {
          path: "name",
        },
      });
      if (!usersByLastName.length) {
        const user = await User.find({
          dni: apellido,
        });
        if (!user.length) {
          return res.status(200).json({
            status: "error",
            message: "no se encontraron usuarios con el apellido: " + apellido,
          });
        }

        return res.status(200).json({ status: "success", users: user });
      }
      return res
        .status(200)
        .json({ status: "success", users: usersByLastName });
    } catch (error) {
      console.log(error.message);
      return res
        .status(400)
        .json({ status: "error", message: "error en el servidor" });
    }
  };

  static solicitudDeInscripcion = async (req, res) => {
    const { idActividad } = req.body;

    try {
      const user = await User.findOne({
        _id: req.user.id,
      }).populate({
        path: "activity",
        populate: {
          path: "name",
        },
      });
      const isActivityExist = await Activity.findById({
        _id: idActividad,
      });

      if (!isActivityExist) {
        return res.status(400).json({
          status: "error",
          message: "La actividad seleccionada no existe",
        });
      }

      if (isActivityExist.natacionAdaptada !== user.natacionAdaptada) {
        return res.status(400).json({
          status: "error",
          message: "Usuario no cumple los requisitos para esta actividad",
        });
      }
      if (isActivityExist.users.length >= isActivityExist.cupos) {
        //verificamos si hay cupo
        return res.status(400).json({
          status: "error",
          message: "Cupos agotados",
        });
      }

      if (!user.activity) {
        user.activity = [];
      }

      //si la actividad seleccionada no tiene codigo de acceso verifico que el usuario no este registrado en una actividad con codigo de acceso
      if (!isActivityExist.codigoDeAcceso) {
        for (let i = 0; i < user.activity.length; i++) {
          const actividad = user.activity[i];
          if (!actividad.codigoDeAcceso) {
            return res.status(400).json({
              status: "error",
              message:
                "Usuario ya inscripto en una actividad, por favor dar de baja la actividad actual para poder inscribirse en una nueva.",
            });
          }
        }
      }

      if (
        isActivityExist.users.includes(user._id) &&
        isActivityExist.codigoDeAcceso
      ) {
        console.log("entre aqui 312");
        return res.status(200).json({
          status: "success",
          message: "Usuario agregado a la actividad",
        });
      }

      const activityUpdate = await Activity.findOneAndUpdate(
        { _id: isActivityExist._id },
        { $push: { users: user }, $inc: { userRegister: 1 } },
        { new: true }
      );
      //   //le añadimos al usuario la actividad, con sus respectivos horarios
      user.activity.push(activityUpdate);

      if (user.activity.length == 1) {
        user.status = false;
      }

      const { fecha } = obtenerFechaYHoraArgentina();
      user.asistencia = [];
      user.asistencia.push(fecha);

      const userUpdate = await user.save();

      return res.status(200).json({
        status: "success",
        message: "Usuario agregado a la actividad",
        data: {
          activityUpdate,
          userUpdate,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "error en el servidor",
      });
    }
  };

  static generarQrCode = async (req, res) => {
    try {
      const { fecha } = obtenerFechaYHoraArgentina();

      return res.status(200).json(fecha);
    } catch (error) {
      console.log(error.message);

      return res.status(400).json({ message: "error en el servidor" });
    }
  };

  static asistenciaPorQr = async (req, res) => {
    try {
      const { customId, qr } = req.body;
      //traemos al usuario

      const { diaNombre, hora, fecha } = obtenerFechaYHoraArgentina();

      if (qr !== fecha) {
        return res
          .status(400)
          .json({ status: "error", message: "La fecha es incorrecta." });
      }

      const user = await User.findOne({ customId }).populate({
        path: "activity",
        populate: {
          path: "name",
        },
      });

      //verificamos que exista
      if (!user) {
        return res
          .status(400)
          .json({ status: "error", message: "Usuario no encontrado" });
      }

      //verificamos que tenga alguna actividad
      if (!user.activity.length) {
        return res
          .status(400)
          .json({ status: "error", message: "Actividad no encontrada" });
      }

      //verificamos que alguna de las actividades pertenezca a la hora actual y dia
      const found = user.activity.find((actividad) => {
        return (
          actividad.date.includes(diaNombre) &&
          estaEnRango(actividad.hourStart, actividad.hourFinish, hora)
        );
      });

      if (!found) {
        return res.status(400).json({
          status: "error",
          message: "Horario o Dia Incorrecto de la actividad",
        });
      }
      //registramos al usuario en pileta

      const resultado = await agregarUsuario({
        customId: user.customId,
        nombre: user.nombre,
        actividad: found.name,
        pileta: found.pileta,
        apellido: user.apellido,
        horarioIngreso: found.hourStart,
        horarioSalida: found.hourFinish,
      });

      if (resultado.status === "error") {
        return res
          .status(400)
          .json({ status: "error", message: resultado.message });
      }

      //actualizar el campo de asistenciia del usuario
      const resultadoAsistencia = await asistenciaUsuario(customId, fecha);
      if (resultadoAsistencia.status === "error") {
        return res
          .status(400)
          .json({ status: "error", message: resultado.message });
      }

      //actualizo la estadistica
      await actualizarEstadistica(user);

      return res.status(200).json({
        status: "success",
        message: "Usuario aceptado",
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };
}
