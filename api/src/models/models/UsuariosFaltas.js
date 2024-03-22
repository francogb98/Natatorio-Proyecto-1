import mongoose from "mongoose";

const usuariosFaltasSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  motivo: { type: String },
});

const UsuariosFalta = mongoose.model("UsuariosFalta", usuariosFaltasSchema);

export default UsuariosFalta;
