import Autorizado from "../../models/models/Autorizados.js";
import User from "../../models/models/User.js";

export const agregarNuevoAutorizado = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.user });

    const existingUser = await Autorizado.findOne({ user });

    if (existingUser) {
      return res
        .status(200)
        .json({ message: "El usuario ya se encuentra en la lista" });
    }

    const newUser = new Autorizado({ user });
    await newUser.save(); // Guarda el nuevo usuario en la base de datos

    res.status(201).json({ message: "Usuario agregado a la lista con éxito" });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ message: "Error en el servidor" });
  }
};

export const listaUsuariosAutorizado = async (req, res) => {
  try {
    const users = await Autorizado.find().populate({
      path: "user",
    });
    res.status(201).json({ message: "Usuarios Encontrados", users });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: "Error en el servidor" });
  }
};

export const eliminarUsuarioDeLaLista = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.user });

    const existingUser = await Autorizado.findOneAndRemove({ user });

    return res.status(200).json({ message: "Usuario eliminado con exito" });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: "Error en el servidor" });
  }
};
