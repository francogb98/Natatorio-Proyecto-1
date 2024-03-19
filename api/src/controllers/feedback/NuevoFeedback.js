import { obtenerFechaYHoraArgentina } from "../../Helpers/traerInfoDelDia.js";
import Feedback from "../../models/models/FeedBack.js";

export default async function NuevoFeedback(req, res) {
  try {
    const { content } = req.body;
    const { fecha } = obtenerFechaYHoraArgentina();

    console.log(req.user);

    const feedback = new Feedback({
      user: req.user.id,
      fecha,
      mensage: content,
    });
    await feedback.save();

    console.log(feedback);

    return res
      .status(201)
      .json({ status: "success", message: "Feedback enviado con exito" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}
