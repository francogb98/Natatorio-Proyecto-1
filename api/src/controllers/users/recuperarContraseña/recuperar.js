import User from "../../../models/models/User.js";

export default async (req, res) => {
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
