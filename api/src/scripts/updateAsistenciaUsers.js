import { User } from "../models/User.js"; // Asegúrate de poner la ruta correcta
import mongoose from "mongoose";
import dotenv from "dotenv";
import { obtenerFechaYHoraArgentina } from "../Helpers/traerInfoDelDia.js";
dotenv.config();

// Conexión a la base de datos
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DATA}/?retryWrites=true&w=majority`;

export const updateAsistenciaForActiveUsers = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(MONGO_URI);

    // Obtener la fecha actual en Argentina
    const fechaHoy = obtenerFechaYHoraArgentina().fecha;

    // Buscar y actualizar todos los usuarios con al menos una actividad
    const result = await User.updateMany(
      { activity: { $exists: true, $not: { $size: 0 } } }, // Usuarios con actividades
      {
        $addToSet: { asistencia: fechaHoy }, // Añadir fecha de hoy a asistencia
        $unset: { inasistencias: "" }, // Eliminar inasistencias si existe
      }
    );

    console.log(`Asistencia actualizada para ${result.modifiedCount} usuarios`);
    return {
      status: "success",
      usersUpdated: result.modifiedCount,
    };
  } catch (error) {
    console.error("Error al actualizar asistencia masiva:", error);
    return {
      status: "error",
      message: error.message,
    };
  } finally {
    // Desconectar de la base de datos
    await mongoose.disconnect();
  }
};

updateAsistenciaForActiveUsers();
