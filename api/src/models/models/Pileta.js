import mongoose from "mongoose";

const piletaSchema = new mongoose.Schema({
  pileta: String,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dia: String,
  hora: String,
});

const Pileta = mongoose.model("Pileta", piletaSchema);

export default Pileta;
