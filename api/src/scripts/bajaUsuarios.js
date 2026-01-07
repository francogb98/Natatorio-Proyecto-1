import mongoose from "mongoose";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

import { User, Activity } from "../models/index.js";
import { obtenerFechaYHoraArgentina } from "../Helpers/traerInfoDelDia.js";

dotenv.config();

console.log("SCRIPT CARGADO");

/** CONEXIÓN MONGO */
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DATA}/?retryWrites=true&w=majority`;

async function bajaMasivaFichaMedica() {
  try {
    console.log("Conectando a MongoDB...");
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB conectado");

    /** CONFIGURACIÓN MANUAL */
    const customIds = [
      4489, 4388, 4171, 4065, 4862, 4621, 4549, 4510, 5328, 5596, 5724, 4020,
    ]; // ← CARGÁS ACÁ LOS USUARIOS
    const { fecha } = obtenerFechaYHoraArgentina();

    console.log("\n==== INICIO SCRIPT BAJA MASIVA FICHA MÉDICA ====");

    for (const customId of customIds) {
      console.log(`\n[LOG] Procesando usuario ${customId}`);

      const user = await User.findOne({ customId });
      if (!user) {
        throw new Error(`Usuario con customId ${customId} no encontrado`);
      }

      /** 1. Dar de baja de TODAS las actividades */
      for (const idActividad of user.activity) {
        const actividad = await Activity.findById(idActividad);

        if (!actividad) {
          throw new Error(
            `Actividad ${idActividad} no encontrada (usuario ${customId})`
          );
        }

        actividad.users = actividad.users.filter(
          (u) => u.toString() !== user._id.toString()
        );

        actividad.userRegister = Math.max(0, actividad.userRegister - 1);

        await actividad.save();
      }

      user.activity = [];

      /** 2. Eliminar ficha médica */
      if (user.fichaMedica) {
        await eliminarFichaMedicaCloudinary(user);
        user.fichaMedica = "";
      }

      /** 3. Cambiar estado */
      user.status = false;

      /** 4. Notificación */
      user.notificaciones.push({
        asunto: "Ficha médica desactualizada",
        cuerpo:
          "La ficha médica presentada no corresponde al año 2026. " +
          "Para poder inscribirse o continuar participando en actividades, " +
          "deberá renovar dicho archivo desde su perfil. " +
          "Una vez actualizado, podrá volver a inscribirse.",
        fecha,
      });

      await user.save();

      console.log(`[OK] Usuario ${customId} procesado correctamente`);
    }

    console.log("\n==== SCRIPT FINALIZADO CON ÉXITO ====");
  } catch (error) {
    console.error("\n[ERROR CRÍTICO - SCRIPT CANCELADO]");
    console.error(error.message);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB desconectado");
    process.exit();
  }
}

/** FUNCIÓN CLOUDINARY */
async function eliminarFichaMedicaCloudinary(user) {
  const cloudinaryConfig = {
    cloud_name:
      user.customId % 2 === 0
        ? process.env.CLOUDINARY_CLOUD_NAME
        : process.env.CLOUDINARY_CLOUD_NAME_2,
    api_key:
      user.customId % 2 === 0
        ? process.env.CLOUDINARY_API_KEY
        : process.env.CLOUDINARY_API_KEY_2,
    api_secret:
      user.customId % 2 === 0
        ? process.env.CLOUDINARY_API_SECRET
        : process.env.CLOUDINARY_API_SECRET_2,
    secure: true,
  };

  cloudinary.config(cloudinaryConfig);

  const partes = user.fichaMedica.split("/");
  const nombre = partes[partes.length - 1];
  const [public_id] = nombre.split(".");

  await cloudinary.uploader.destroy(`Natatorio/${public_id}`, {
    resource_type: "auto",
  });
}

/** EJECUCIÓN */
bajaMasivaFichaMedica();
