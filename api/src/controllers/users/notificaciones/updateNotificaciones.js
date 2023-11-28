import User from "../../../models/models/User.js";

export default async (req, res) => {
  //el id viene por cabecera
  const { id } = req.user;

  const { idNotificacion } = req.body;

  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "usuario no encontrado" });
    }

    const notificacion = user.notificaciones.find((notificacion) => {
      console.log(notificacion._id, idNotificacion);
      console.log(notificacion._id == idNotificacion);
      return notificacion._id == idNotificacion;
    });

    if (!notificacion) {
      return res
        .status(404)
        .json({ status: "error", message: "notificacion no encontrada" });
    }

    notificacion.leido = true;

    await user.save();

    return res.json({
      status: "success",
      message: "notificacion actualizada",
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", error: "error en el servidor" });
  }
};
