import { Activity } from "../../models/index.js";

const obtenerFecha = () => {
  const dateNow = new Date();
  const day = dateNow.getDate();
  const month = dateNow.getMonth() + 1;
  const year = dateNow.getFullYear();

  return `${day}/${month}/${year}`;
};

class PeticionesService {
  static async agregarUsuarioActividad({ user, idActividad }) {
    try {
      const activityUpdate = await Activity.findOneAndUpdate(
        { _id: idActividad },
        { $push: { users: user._id }, $inc: { userRegister: 1 } },
        { new: true }
      );

      if (!activityUpdate) {
        return false;
      }

      user.notificaciones.push({
        asunto: "Usuario registrado correctamente",
        cuerpo: "Usted ha sido registrado correctamente en la actividad.",
        fecha: obtenerFecha(),
      });

      user.activity = user.activity || [];
      user.activity.push(activityUpdate._id);
      user.status = true;
      user.inasistencias = [];
      user.asistencia = [];
      user.asistencia.push(obtenerFecha());
      await user.save();

      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  static async darDeBaja({ user, activityId }) {
    try {
      const activity = await Activity.findOneAndUpdate(
        { _id: activityId },
        { $pull: { users: user._id }, $inc: { userRegister: -1 } },
        { new: true }
      );

      if (!activity) {
        console.log({ error: "No se encontró la actividad" });
        return false;
      }

      user.activity = user.activity.filter(
        (activity) => activity._id.toString() !== activityId.toString()
      );

      user.notificaciones = user.notificaciones || [];
      user.notificaciones.push({
        asunto: "Baja de actividad",
        cuerpo: `Usted ha sido dado de baja de la actividad: ${activity.name}.`,
        fecha: obtenerFecha(),
      });

      await user.save();
      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  // Otras funciones que manejen la lógica de peticiones (create, get, aceptar, etc.)
  // Puedes mover la lógica de createPeticion, getPeticiones y aceptarPeticiones aquí.
}

export default PeticionesService;
