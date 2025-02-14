import { User } from "../models/User.js"; // Asegúrate de poner la ruta correcta
import mongoose from "mongoose";
import dotenv from "dotenv";
import { obtenerFechaYHoraArgentina } from "../Helpers/traerInfoDelDia.js";
dotenv.config();

// Conexión a la base de datos
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DATA}/?retryWrites=true&w=majority`; // Reemplaza con tu conexión real

async function resetCUD() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { fecha } = obtenerFechaYHoraArgentina();

    const result = await User.updateMany({}, { asistencia: [fecha] });

    console.log(`Asistencia actualizada en ${result.modifiedCount} usuarios.`);
  } catch (error) {
    console.error("Error al resetear CUD:", error);
  } finally {
    await mongoose.disconnect();
  }
}

resetCUD();
