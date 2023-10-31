import mongoose from "mongoose";

const schema = new mongoose.Schema({
  usersQuantity: {
    type: Number,
    required: true,
  },
  mes: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  activity: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
});

export default mongoose.model("Stadistics", schema);
