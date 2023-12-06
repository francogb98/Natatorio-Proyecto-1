import User from "../../../models/models/User.js";

import bcrypt from "bcrypt";

export default async (req, res) => {
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
