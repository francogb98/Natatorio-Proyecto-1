import User from "../../models/models/User.js";
import Activity from "../../models/models/Actividades.js";

export const darDeBajaActividad = async (req, res) => {
  try {
    //viene por la confirmacion de jwt
    const { id } = req.user;
    const { idActividad } = req.body;
    const user = await User.findById(id);
    const actividad = user.activity.find(
      (actividad) => actividad == idActividad
    );
    if (actividad) {
      user.activity = user.activity.filter(
        (actividad) => actividad != idActividad
      );
      await user.save();

      //borro al usuario de la actividad
      let actividadABorrar = await Activity.findById(idActividad);
      actividadABorrar.users = actividadABorrar.users.filter(
        (usuario) => usuario != id
      );
      actividadABorrar.cupos = actividadABorrar.cupos + 1;
      await actividadABorrar.save();

      return res.status(200).json({
        status: "success",
        message: "Actividad dada de baja con exito",
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "El usuario no esta inscripto en la actividad",
      });
    }
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};
