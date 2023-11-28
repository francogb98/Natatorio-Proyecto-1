import User from "../../../models/models/User.js";

export default async (req, res) => {
  const { id, asunto, cuerpo } = req.body;

  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "usuario no encontrado" });
    }

    if (user.notificaciones) {
      user.notificaciones.push({ asunto, cuerpo });
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
