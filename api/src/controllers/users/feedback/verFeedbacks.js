import Feedback from "../../../models/models/FeedBack.js";

export default async function verFeedbacks(req, res) {
  try {
    const feedbacks = await Feedback.find().populate("user");

    return res.status(201).json({ status: "success", feedbacks });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}
