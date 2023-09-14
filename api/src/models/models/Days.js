import mongoose from "mongoose";

const daySchema = new mongoose.Schema({
  nameDate: String,
  // Otros campos de la actividad
});

const Day = mongoose.model("Day", daySchema);

export default Day;
