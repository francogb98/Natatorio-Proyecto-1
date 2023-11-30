import User from "../../models/models/User.js";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";

export const generateVerificationToken = () => {
  const token = jwt.sign({ data: "verification" }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

const createUser = async (req, res) => {
  const args = req.body;

  const { password, dni, edad } = req.body;

  if (edad < 0 || edad > 100) {
    return res.status(400).json({
      status: "error",
      message: "Edad no valida",
    });
  }

  console.log(
    args.nombre,
    args.apellido,
    args.edad,
    args.dni,
    args.sexo,
    args.natacionAdaptada,
    args.telefono,
    args.telefonoContacto,
    args.ciudad,
    args.password
  );
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

export default createUser;
