import User from "../../models/models/User.js";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";

export const loginUser = async (req, res) => {
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

    console.log(user);

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
    res.status(400).json({ status: "error", message: error.message });
  }
};
