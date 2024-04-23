import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { v2 as cloudinary } from "cloudinary";

import User from "../models/models/User.js";
import { obtenerFechaYHoraArgentina } from "../Helpers/traerInfoDelDia.js";

// Obtener la ruta del directorio del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const subirArchivos = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (
      !req.files ||
      Object.keys(req.files).length === 0 ||
      !req.files.archivo
    ) {
      return res.status(400).json({ message: "No hay archivos para subir." });
    }

    const { tempFilePath, name } = req.files.archivo;

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

    const uploadToCloudinary = async (fieldName, fieldValue) => {
      if (fieldName && fieldValue) {
        const nombreArr = fieldValue.split("/");
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split(".");
        await cloudinary.uploader.destroy(`Natatorio/${public_id}`);
      }
      const result = await cloudinary.uploader.upload(tempFilePath, {
        folder: "Natatorio",
        resource_type: "auto",
      });
      return result.secure_url;
    };

    const fieldMap = {
      fichaMedica: "fichaMedica",
      cud: "cud",
      foto: "foto",
      fotoDocumento: "fotoDocumento",
      certificadoHongos: "certificadoHongos",
    };

    const fieldName = fieldMap[name];
    if (!fieldName) {
      return res.status(400).json({ message: "Nombre de archivo no válido." });
    }

    let fieldValue = user[fieldName];
    fieldValue = await uploadToCloudinary(fieldName, fieldValue);

    if (fieldName === "certificadoHongos") {
      const { fecha } = obtenerFechaYHoraArgentina();
      user.fechaCargaCertificadoHongos = fecha;
    }

    user[fieldName] = fieldValue;
    await user.save();
    return res.status(200).json({ status: "success", user });
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Error en el servidor." });
  }
};
