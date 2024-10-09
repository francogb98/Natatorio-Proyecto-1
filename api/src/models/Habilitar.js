import mongoose from "mongoose";

const habilitarSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Habilitar = mongoose.model("Habilitar", habilitarSchema);

export default Habilitar;
