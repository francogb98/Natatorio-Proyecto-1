import User from "../../../models/models/User.js";

export const deleteNotificacion = async (req, res) => {
  const { idNotificacion, idUsuario } = req.body;

  try {
    const user = await User.findOne({
      _id: idUsuario,
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

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
