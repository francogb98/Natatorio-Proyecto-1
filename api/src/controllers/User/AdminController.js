import { Activity, User } from "../../models/index.js";

const obtenerFecha = () => {
  const dateNow = new Date();
  const day = dateNow.getDate();
  const month = dateNow.getMonth() + 1;
  const year = dateNow.getFullYear();

  const dateNowSave = `${day}/${month}/${year}`;
  return dateNowSave;
};

export class AdminController {
  static agregarUsuarioAUnaActividad = async (req, res) => {
    try {
      const { idActividad } = req.body;
      const user = req.userData;
      const activityUpdate = await Activity.findOneAndUpdate(
        { _id: idActividad },
        { $push: { users: user }, $inc: { userRegister: 1 } },
        { new: true }
      );

      if (!activityUpdate) {
        return res
          .status(400)
          .json({ status: "error", msg: "actividad no encontrada" });
      }

      user.notificaciones.push({
        asunto: "Usuario registrado correctamente",
        cuerpo:
          "Usted ha sido registrado correctamente en la actividad, podrás ver los horarios en la sección de actividades, Recuerda que debes asistir a la actividad para que no seas deshabilitado, ademas de actualizar tu certificado de mucosis y pediculosis cada 1 mes, para mas información comunicate con el administrador del natatorio",
        fecha: obtenerFecha(),
      });

      if (!user.activity) {
        user.activity = [];
      }
      user.activity.push(activityUpdate);
      user.status = true;
      user.inasistencias = [];
      user.asistencia = [];
      user.asistencia.push(obtenerFecha());
      await user.save();

      return res.status(200).json({
        status: "success",
        msg: "Usuario agregado a la actividad con exito",
        user,
      });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ status: "error", msg: "error en el servidor" });
    }
  };

  static enviarNotificacion = async (req, res) => {
    const { asunto, cuerpo } = req.body;

    try {
      const user = req.userData;

      if (user.notificaciones) {
        user.notificaciones.push({ asunto, cuerpo, fecha: obtenerFecha() });
      }

      await user.save();

      return res.json({
        status: "success",
        message: "notificacion enviada al usuario",
        user,
      });
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ status: "error", error: "error en el servidor" });
    }
  };

  static DeshabilitarUser = async (req, res) => {
    const { activityId } = req.body;
    try {
      let asunto;
      let cuerpo;

      const user = req.userData;
      //   console.log(user);

      //   return res.send("todo okaay");

      const activity = await Activity.findOneAndUpdate(
        { _id: activityId },
        { $pull: { users: user._id } },
        //disminuyo el campo de userregister
        { $set: { userRegister: user.activity[0].userRegister - 1 } },
        { new: true }
      );

      if (!req.body.asunto || !req.body.cuerpo) {
        asunto = "Baja de actividad";
        cuerpo = `Usted ha sido dado de baja de la actividad: ${
          activity.name
        } , en el horario de: ${activity.hourStart} - ${
          activity.hourFinish
        }, en los dias: ${activity.date.join(
          " - "
        )}. Para más información, comuníquese con el administrador del natatorio.`;
      } else {
        asunto = req.body.asunto;
        cuerpo = req.body.cuerpo;
      }

      //borro el campo activity del usuario
      user.activity = user.activity.filter(
        (activity) => activity._id.toString() !== activityId
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

      return res.status(200).json({
        status: "success",
        message: "Usuario deshabilitado",
        data: {
          user,
        },
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        status: "error",
        message: "error en el servidor",
      });
    }
  };

  static HabilitarUser = async (req, res) => {
    try {
      const user = req.userData;
      if (!user.notificaciones) {
        user.notificaciones = [];
      }
      user.notificaciones.push({
        asunto: "Usuario registrado correctamente",
        cuerpo:
          "Usted ha sido registrado correctamente en la actividad, podrás ver los horarios en la sección de actividades, Recuerda que debes asistir a la actividad para que no seas deshabilitado, ademas de actualizar tu certificado de mucosis y pediculosis cada 1 mes, para mas información comunicate con el administrador del natatorio",
        fecha: obtenerFecha(),
      });

      user.status = true;
      user.asistencia = [];
      user.asistencia.push(obtenerFecha());
      await user.save();

      return res.status(200).json({
        status: "success",
        message: "Usuario habilitado",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "error en el servidor",
      });
    }
  };

  static cambiarRole = async (req, res) => {
    try {
      const { role } = req.params;
      if (!role) {
        return res.status(400).json({
          status: "error",
          message: "Completar Todos los campos",
        });
      }
      //buscamos al ususario por su userId y actualizamos su role
      const user = req.userData;

      user.role = role;
      await user.save();
      res.status(200).json({
        status: "success",
        message: "Rol cambiado con exito",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "no se pudo cambiar el role",
      });
    }
  };

  static deleteNotificacion = async (req, res) => {
    const { idNotificacion } = req.body;
    console.log(idNotificacion);
    try {
      const user = req.userData;

      //borro la notificaicon por su id
      //notificacion es un array de objetos el cual cuenta co una propiedad id
      //busco el id y la elminio

      const notificacion = user.notificaciones.find((notificacion) => {
        return notificacion._id == idNotificacion;
      });

      if (!notificacion) {
        return res.status(404).json({
          status: "error",
          message: "Notificacion no encontrada",
        });
      }

      const index = user.notificaciones.indexOf(notificacion);

      user.notificaciones.splice(index, 1);

      const userUpdate = await user.save();

      return res.status(200).json({
        status: "success",
        message: "Notificacion eliminada",
        user: userUpdate,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };
}
