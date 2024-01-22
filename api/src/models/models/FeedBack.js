import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  mensage: String,
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
