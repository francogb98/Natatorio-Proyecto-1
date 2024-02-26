import mongoose from "mongoose";

const autorizadosSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Autorizado = mongoose.model("Autorizado", autorizadosSchema);

export default Autorizado;
