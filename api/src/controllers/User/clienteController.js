import { Activity, User } from "../../models/index.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { fileURLToPath } from "url";
import { dirname } from "path";
import { v2 as cloudinary } from "cloudinary";
// Obtener la ruta del directorio del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { obtenerFechaYHoraArgentina } from "../../Helpers/traerInfoDelDia.js";
import { RevisionArchivosEstado } from "./models/index.js";
import { calcularDiasDesde } from "../../middlewares/calcularDiasDeCertificado.js";

export const generateVerificationToken = () => {
  const token = jwt.sign({ data: "verification" }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

export class ClienteController {
  static createUser = async (req, res) => {
    const args = req.body;

    const { password, dni, edad } = req.body;

    if (edad < 0 || edad > 100) {
      return res.status(400).json({
        status: "error",
        message: "Edad no valida",
      });
    }

    if (
      !args.nombre ||
      !args.apellido ||
      !args.edad ||
      !args.dni ||
      !args.sexo ||
      !args.telefono ||
      !args.telefonoContacto ||
      !args.ciudad ||
      !args.password
    ) {
      return res.status(400).json({
        status: "error",
        message: "Por favor añadir todos los campos",
      });
    }

    if (args.natacionAdaptada === undefined) {
      return res.status(400).json({
        status: "error",
        message: "Por favor completar el campo natacionAdaptada",
      });
    }

    if (args.natacionAdaptada && !args.diagnosticos) {
      return res.status(400).json({
        status: "error",
        message: "Por favor completar el campo diagnosticos",
      });
    }

    if (isNaN(edad) || isNaN(dni)) {
      return res.status(400).json({
        status: "error",
        message: "Edad y Dni deben ser numeros",
      });
    }

    const isDniExist = await User.findOne({ dni });
    //verificamos si exite el email
    if (isDniExist) {
      return res
        .status(400)
        .json({ status: "error", message: "Dni ya registado" });
    }

    try {
      //encriptamos la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      //verificamos si existe algun usuario, si no existe le agregamos el customID 100, si no buscsamos el ujltimo y le agregaqmos 1
      const lastUser = await User.findOne().sort({ customId: -1 });
      if (!lastUser) {
        args.customId = 100;
      } else {
        args.customId = lastUser.customId + 1;
      }

      const user = new User({
        ...args,
        password: hashedPassword,
        asistencia: false,
        role: "usuario",
        natacionAdaptada: args.natacionAdaptada,
        cud: null,
        activity: null,
        certificadoHongos: null,
        fechaCargaCertificadoHongos: null,
        barrio: args.barrio ? args.barrio : null,
      });
      await user.save();

      res.status(201).json({
        status: "success",
        message: "Usuario creado",
        user,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ status: "error", message: error.message });
    }
  };

  static loginUser = async (req, res) => {
    const { dni, password } = req.body;
    //verificamos si el usuario existe

    try {
      const user = await User.findOne({ dni }).populate({
        path: "activity",
        populate: {
          path: "name",
        },
      });

      if (!user) {
        return res.status(400).json({
          status: "error",
          message: "Credenciales incorrectas",
        });
      }
      if (!user.activity) {
        user.activity = [];
      }

      //comparamos las contraseñas
      const pass = await bcrypt.compare(password, user.password);

      //devolvemos un error en caso de que alguno no funcione
      if (!user || !pass) {
        return res.status(400).json({
          status: "error",
          message: "Contraseña incorrectas",
        });
      }

      //creamos el token de autenticacion
      const userForToken = {
        nombre: user.nombre,
        id: user._id,
      };

      return res.status(200).json({
        status: "success",
        token: jwt.sign(userForToken, process.env.JWT_SECRET, {
          expiresIn: "1d",
        }),
        usuario: user,
      });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({
        status: "error",
        message: "Upss... algo salio mal,por favor vuelva a intentarlo",
      });
    }
  };
  static recuperar = async (req, res) => {
    try {
      const user = await User.findOne({
        dni: req.body.dni,
      });

      if (!user) {
        return res
          .status(500)
          .json({ status: "error", message: "Usuario no encontradp" });
      }

      //comparar ultimos cuatro numeros de telefono de contacto+
      const telefono = user.telefonoContacto;
      const lastFour = telefono.substring(telefono.length - 4);
      if (lastFour !== req.body.telefono) {
        return res.status(500).json({
          status: "error",
          message: "Los ultimos cuatro numeros de telefono no coinciden",
        });
      }

      return res
        .status(200)
        .json({ status: "success", menssage: "Datos correctos", user });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  static modificarContraseña = async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = await User.findOneAndUpdate(
        {
          dni: req.body.dni,
        },
        {
          password: hashedPassword,
        }
      );

      if (!user) {
        return res
          .status(500)
          .json({ status: "error", message: "Usuario no encontrado" });
      }

      return res
        .status(200)
        .json({ status: "success", menssage: "Contraseña modificada", user });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  static editarUsuario = async (req, res) => {
    const {
      _id,
      nombre,
      apellido,
      dni,
      barrio,
      ciudad,
      natacionAdaptada,
      telefono,
      telefonoContacto,
      edad,
      sexo,
    } = req.body;
    try {
      //busco el usuario por su id

      console.log(req.body);

      let user = await User.findOne({ dni });
      if (dni !== user.dni) {
        const isUserExist = await User.findOne({ dni });
        if (isUserExist) {
          return res.status(400).json({
            status: "error",
            message: "Usuario con este dni ya existe",
          });
        }
      }

      user.dni = dni;
      user.sexo = sexo;
      user.edad = edad;
      user.nombre = nombre;
      user.apellido = apellido;
      user.ciudad = ciudad;
      user.barrio = barrio;
      user.natacionAdaptada = natacionAdaptada;
      user.telefono = telefono;
      user.telefonoContacto = telefonoContacto;
      await user.save();

      res.status(200).json({
        status: "success",
        message: "Usuario actualizado con exito",
        user,
      });
    } catch (error) {
      console.log(error.message);
      res
        .status(400)
        .json({ status: "error", message: "No se pudo editar el usuario" });
    }
  };

  static darDeBajaActividad = async (req, res) => {
    try {
      //viene por la confirmacion de jwt
      const { id } = req.user;
      const { idActividad } = req.body;
      const user = await User.findById(id);
      const actividad = user.activity.find(
        (actividad) => actividad == idActividad
      );
      if (actividad) {
        user.activity = user.activity.filter(
          (actividad) => actividad != idActividad
        );
        await user.save();

        //borro al usuario de la actividad
        let actividadABorrar = await Activity.findById(idActividad);
        actividadABorrar.users = actividadABorrar.users.filter(
          (usuario) => usuario != id
        );
        actividadABorrar.userRegister = actividadABorrar.userRegister - 1;
        await actividadABorrar.save();

        return res.status(200).json({
          status: "success",
          message: "Actividad dada de baja con exito",
        });
      } else {
        return res.status(400).json({
          status: "error",
          message: "El usuario no esta inscripto en la actividad",
        });
      }
    } catch (error) {
      return res.status(400).json({ status: "error", message: error.message });
    }
  };
  static darDeBajaPorCertificado = async (req, res) => {
    try {
      //viene por la confirmacion de jwt
      const { idActividad, id } = req.body;
      const { fecha } = obtenerFechaYHoraArgentina();
      const user = await User.findById(id);
      const actividad = user.activity.find(
        (actividad) => actividad == idActividad
      );
      if (actividad) {
        user.activity = user.activity.filter(
          (actividad) => actividad != idActividad
        );

        //borro al usuario de la actividad
        let actividadABorrar = await Activity.findById(idActividad);
        actividadABorrar.users = actividadABorrar.users.filter(
          (usuario) => usuario != id
        );
        actividadABorrar.userRegister = actividadABorrar.userRegister - 1;

        user.notificaciones.push({
          asunto: "Baja de actividad",
          cuerpo: `Usted a sido dado de baja de la actividad ${
            actividadABorrar.name
          } en el horario de ${actividadABorrar.hourStart} - ${
            actividadABorrar.hourFinish
          }, debido a que el sistema registro que pasaron ${calcularDiasDesde(
            user.fechaCargaCertificadoHongos
          )} Dias de la ultima vez que renovo su certificado De Pediculosis y Micosis`,
          fecha: fecha,
        });

        await user.save();
        await actividadABorrar.save();

        return res.status(200).json({
          status: "success",
          message: "Actividad dada de baja con exito",
        });
      } else {
        return res.status(400).json({
          status: "error",
          message: "El usuario no esta inscripto en la actividad",
        });
      }
    } catch (error) {
      return res.status(400).json({ status: "error", message: error.message });
    }
  };

  static notificacionLeida = async (req, res) => {
    const { idNotificacion } = req.body;
    try {
      const user = req.userData;
      const notificacion = user.notificaciones.find((notificacion) => {
        return notificacion._id == idNotificacion;
      });

      if (!notificacion) {
        return res
          .status(404)
          .json({ status: "error", message: "notificacion no encontrada" });
      }
      notificacion.leido = true;
      await user.save();
      return res.json({
        status: "success",
        message: "notificacion actualizada",
        user,
      });
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ status: "error", error: "error en el servidor" });
    }
  };

  static subirArchivos = async (req, res) => {
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

      console.log(
        user.customId % 2 === 0
          ? process.env.CLOUDINARY_CLOUD_NAME
          : process.env.CLOUDINARY_CLOUD_NAME_2
      );

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
        return res
          .status(400)
          .json({ message: "Nombre de archivo no válido." });
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

  static revisionArchivo = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      user.revisionArchivo = RevisionArchivosEstado.PENDIENTE;
      await user.save();

      return res
        .status(200)
        .json({ status: "success", message: "Archivo enviado a revisión" });
    } catch (error) {
      console.error("Error al actualizar el estado del archivo:", error);
      return res
        .status(500)
        .json({ status: "error", message: "Error en el servidor." });
    }
  };
}
