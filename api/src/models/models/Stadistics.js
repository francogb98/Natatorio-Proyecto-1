import mongoose from "mongoose";

const schema = new mongoose.Schema({
  usersQuantity: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Stadistics", schema);
