import User from "../../../models/models/User.js";
import Feedback from "../../../models/models/FeedBack.js";

export default async (req, res) => {
  const { id, asunto, cuerpo, idFeed } = req.body;

  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "usuario no encontrado" });
    }

    if (idFeed) {
      // If idFeed is provided, update the corresponding feed's status
      const feed = await Feedback.findOneAndUpdate(
        { _id: idFeed },
        { $set: { contestado: true } },
        { new: true }
      );

      if (!feed) {
        return res
          .status(404)
          .json({ status: "error", message: "feed no encontrado" });
      }
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
