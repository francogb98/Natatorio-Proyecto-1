import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { v2 as cloudinary } from "cloudinary";

import User from "../models/models/User.js";

// Obtener la ruta del directorio del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const subirArchivos = async (req, res) => {
  //accedo al usuario por req.user.id
  //busco el usuario por id

  const user = await User.findById(req.user.id);

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({ message: "No hay archivos para subir." });
    return;
  }
  const { tempFilePath, name } = req.files.archivo;

  let cloud_name = "";
  let api_key = "";
  let api_secret = "";

  if (user.customId % 2 === 0) {
    cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
    api_key = process.env.CLOUDINARY_API_KEY;
    api_secret = process.env.CLOUDINARY_API_SECRET;
  } else {
    cloud_name = process.env.CLOUDINARY_CLOUD_NAME_2;
    api_key = process.env.CLOUDINARY_API_KEY_2;
    api_secret = process.env.CLOUDINARY_API_SECRET_2;
  }

  cloudinary.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
    secure: true,
  });

  console.log(cloud_name);
  console.log(api_key);
  console.log(api_secret);

  if (name === "fichaMedica" && user.fichaMedica) {
    const nombreArr = user.fichaMedica.split("/");

    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");

    cloudinary.uploader.destroy(
      `Natatorio/${public_id}`,
      function (error, result) {
        console.log(result, error);
      }
    );
  }
  if (name === "cud" && user.cud) {
    const nombreArr = user.cud.split("/");

    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");

    cloudinary.uploader.destroy(
      `Natatorio/${public_id}`,
      function (error, result) {
        console.log(result, error);
      }
    );
  }

  if (name === "foto" && user.foto) {
    const nombreArr = user.foto.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(
      `Natatorio/${public_id}`,
      function (error, result) {
        console.log(result, error);
      }
    );
  }

  if (name === "fotoDocumento" && user.fotoDocumento) {
    const nombreArr = user.fotoDocumento.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(
      `Natatorio/${public_id}`,
      function (error, result) {
        console.log(result, error);
      }
    );
  }

  if (name === "certificadoHongos" && user.certificadoHongos) {
    const nombreArr = user.certificadoHongos.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    //quiero que me devuelva un console log si se borro la imagen
    cloudinary.uploader.destroy(
      `Natatorio/${public_id}`,
      function (error, result) {
        console.log(result, error);
      }
    );
  }

  // Utilizamos try-catch para manejar errores de forma asíncrona
  try {
    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: "Natatorio",
      resource_type: "auto",
    });

    // Enviamos la respuesta al cliente una vez que hemos subido el archivo correctamente

    //result.secure_url esta la url que tenemos que guardar en la base de datos
    if (name === "fichaMedica") {
      user.fichaMedica = result.secure_url;
    }
    if (name === "cud") {
      user.cud = result.secure_url;
    }
    if (name === "foto") {
      user.foto = result.secure_url;
    }
    if (name === "fotoDocumento") {
      user.fotoDocumento = result.secure_url;
    }
    if (name === "certificadoHongos") {
      user.certificadoHongos = result.secure_url;
    }
    await user.save();

    res.json({ user });
  } catch (error) {
    // Manejamos los errores y enviamos una respuesta de error al cliente en caso de fallo
    console.error("Error al subir el archivo:", error);
    res.status(500).json({ message: "Error al subir el archivo." });
  }
};
