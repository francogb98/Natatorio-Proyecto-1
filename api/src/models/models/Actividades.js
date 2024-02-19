import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  name: String,
  pileta: String,
  //nombre de la actividad , dia y hora
  hourStart: String,
  hourFinish: String,
  //todos los usuarios que se encuentran en la actividad, dia y hora
  date: Array,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  userRegister: Number,

  cupos: Number,
  actividadEspecial: Boolean,
  natacionAdaptada: Boolean,
  // edad de usuarios
  desde: Number,
  hasta: Number,

  codigoDeAcceso: String,
  actividadHabilitada: Boolean,
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
