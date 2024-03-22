import User from "../../../models/models/User.js";

export const enviarNotificacion = async (req, res) => {
  const { id, asunto, cuerpo } = req.body;

  try {
    const user = await User.findOne({ _id: id });

    const dateNow = new Date();
    const day = dateNow.getDate();
    const month = dateNow.getMonth() + 1;
    const year = dateNow.getFullYear();

    const dateNowSave = `${day}/${month}/${year}`;

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "usuario no encontrado" });
    }

    if (user.notificaciones) {
      user.notificaciones.push({ asunto, cuerpo, fecha: dateNowSave });
    }

    await user.save();

    return res.json({
      status: "success",
      message: "notificacion enviada al usuario",
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", error: "error en el servidor" });
  }
};
