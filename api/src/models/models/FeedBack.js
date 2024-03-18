import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  mensage: String,
  fecha: String,
  contestado: { type: Boolean, default: false },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
