import mongoose from "mongoose";

const UsuarioBajaSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const UsuarioBaja = mongoose.model("UsuarioBaja", UsuarioBajaSchema);

export default UsuarioBaja;
