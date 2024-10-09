import mongoose from "mongoose";

const schema = new mongoose.Schema({
  hourStart: {
    type: String,
    required: true,
  },
  hourFinish: {
    type: String,
    required: true,
  },
});

const Horarios = mongoose.model("Horario", schema);

export { Horarios };
