import mongoose from "mongoose";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

import { User, Activity } from "../models/index.js";
import { obtenerFechaYHoraArgentina } from "../Helpers/traerInfoDelDia.js";

dotenv.config();

/** CONEXIÓN MONGO */
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DATA}/?retryWrites=true&w=majority`;

async function renovacionFichaMedicaGlobal() {
  try {
    console.log("Conectando a MongoDB...");
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB conectado");

    const { fecha } = obtenerFechaYHoraArgentina();

    console.log("\n==== INICIO SCRIPT RENOVACIÓN FICHA MÉDICA GLOBAL ====");

    /** 1. Buscar usuarios NO procesados */
    const usuarios = await User.find({
      activity: { $exists: true, $not: { $size: 0 } },
      status: true,
      renovacionFichaMedica: { $ne: true },
    });

    console.log(`Usuarios encontrados: ${usuarios.length}`);

    for (const user of usuarios) {
      try {
        console.log(`\n[LOG] Usuario customId ${user.customId}`);

        /** 2. Eliminar ficha médica */
        if (user.fichaMedica) {
          await eliminarFichaMedicaCloudinary(user);
          user.fichaMedica = "";
        }

        /** 3. Flag de renovación */
        user.renovacionFichaMedica = true;

        /** 4. Notificación */
        user.notificaciones.push({
          asunto: "Renovación obligatoria de ficha médica",
          cuerpo:
            "La ficha médica registrada ha sido eliminada debido al inicio de un nuevo período anual. " +
            "Para conservar su cupo en las actividades, deberá cargar una ficha médica actualizada correspondiente al año vigente. " +
            "En caso de no regularizar la situación, podrá perder su lugar en la actividad.",
          fecha,
        });

        await user.save();

        console.log(`[OK] Usuario ${user.customId} actualizado`);
      } catch (userError) {
        console.error(`[ERROR USUARIO ${user.customId}] ${userError.message}`);
        continue; // explícito, aunque no obligatorio
      }
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

/** CLOUDINARY */
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
renovacionFichaMedicaGlobal();
