import mongoose from "mongoose";

const piletaSchema = new mongoose.Schema({
  pileta: String,

  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Pileta = mongoose.model("Pileta", piletaSchema);

export default Pileta;
