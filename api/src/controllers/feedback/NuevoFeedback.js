import Feedback from "../../models/models/FeedBack.js";

export default async function NuevoFeedback(req, res) {
  try {
    const { content } = req.body;

    const feedback = new Feedback({ user: req.user.id, mensage: content });
    await feedback.save();

    return res
      .status(201)
      .json({ status: "success", message: "Feedback enviado con exito" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}
