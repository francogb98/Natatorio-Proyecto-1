import User from "../../models/models/User.js";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import { cantidad_inasistecias } from "../../Helpers/cantidad_inasistencias.js";

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

    let inasistencias = 0;
    if (user.activity && user.activity.length > 0 && user.status) {
      inasistencias = await cantidad_inasistecias(
        user.activity[0],
        user.asistencia
      );
    }

    return res.status(200).json({
      status: "success",
      token: jwt.sign(userForToken, process.env.JWT_SECRET, {
        expiresIn: "1d",
      }),
      usuario: user,
      inasistencias,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Upss... algo salio mal,por favor vuelva a intentarlo",
    });
  }
};
