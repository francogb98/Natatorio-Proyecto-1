import mongoose from "mongoose";

const piletaSchema = new mongoose.Schema({
  pileta: String,
  users: [
    {
      customid: Number,
      nombre: String,
      actividad: String,
      horarioSalida: String,
      pileta: String,
      piletaTurnoSiguiente: Boolean,
    },
  ],
  dia: String,
  hora: String,
});

const Pileta = mongoose.model("Pileta", piletaSchema);

export default Pileta;
