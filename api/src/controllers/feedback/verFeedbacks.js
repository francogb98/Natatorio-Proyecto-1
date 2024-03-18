import Feedback from "../../models/models/FeedBack.js";

export default async function verFeedbacks(req, res) {
  try {
    const { pagina } = req.params;

    const limit = 30;
    const skip = (pagina - 1) * limit;

    const feedbacks = await Feedback.find()
      .populate("user")
      // .skip(skip)
      // .limit(limit)
      .sort({ contestado: false });

    return res.status(201).json({ status: "success", feedbacks });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "error", message: "error en el servidor" });
  }
}
