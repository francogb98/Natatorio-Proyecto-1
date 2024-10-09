import mongoose from "mongoose";

const schema = new mongoose.Schema({
  usersQuantity: {
    type: Number,
    required: true,
  },
  dias: [String],
  mes: {
    type: String,
    required: true,
  },
  activity: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
});

const Stadistic = mongoose.model("Stadistics", schema);

export { Stadistic };
