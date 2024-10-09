import mongoose from "mongoose";

const piletaSchema = new mongoose.Schema({
  pileta: String,
  users: [
    {
      customid: Number,
      nombre: String,
      apellido: String,
      actividad: String,
      horarioSalida: String,
      horarioIngreso: String,
      pileta: String,
      piletaTurnoSiguiente: Boolean,
    },
  ],
  dia: String,
  hora: String,
});

const Pileta = mongoose.model("Pileta", piletaSchema);

export { Pileta };
