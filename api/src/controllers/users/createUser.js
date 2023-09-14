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

  const { email, password, dni, nombreTutor, dniTutor, edad } = req.body;

  if (edad < 0 || edad > 100) {
    return res.status(400).json({
      status: "error",
      message: "Edad no valida",
    });
  }

  if (args.edad < 18 && !nombreTutor && !dniTutor) {
    return res.status(400).json({
      status: "error",
      message: "Por favor añadir informacion del tutor",
    });
  }

  if (!email || !password || !dni || !args.edad) {
    return res.status(400).json({
      status: "error",
      message: "Por favor añadir todos los campos",
    });
  }

  if (isNaN(edad) || isNaN(dni)) {
    return res.status(400).json({
      status: "error",
      message: "Edad y Dni deben ser numeros",
    });
  }

  if (dni === dniTutor) {
    return res.status(400).json({
      status: "error",
      message: "El dni del tutor no puede ser igual al del usuario",
    });
  }

  const isEamilExist = await User.findOne({ email });
  //verificamos si exite el email
  if (isEamilExist) {
    return res
      .status(400)
      .json({ status: "error", message: "Email ya existe" });
  }

  const isDniExist = await User.findOne({ dni });
  //verificamos si exite el email
  if (isDniExist) {
    return res
      .status(400)
      .json({ status: "error", message: "Dni ya registado" });
  }

  if (args.edad < 18 && !nombreTutor && !dniTutor) {
    return res.status(400).json({
      status: "error",
      message: "Por favor añadir informacion del tutor",
    });
  }

  try {
    //encriptamos la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    //generamos un token de verificacion

    const verificationToken = generateVerificationToken();

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
      emailVerified: false,
      asistencia: false,
      role: null,
      qr: null,
      emailVerificationToken: verificationToken,
    });
    await user.save();

    res.status(201).json({
      status: "success",
      message: "Usuario creado",
      token: user.emailVerificationToken,
      nombre: user.nombre,
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export default createUser;
