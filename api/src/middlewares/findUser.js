import { User } from "../models/index.js";

export const getUser = async (req, res, next) => {
  try {
    let { userId, type } = req.params;

    // Crear el objeto de consulta

    if (!type && isNaN(userId)) {
      type = "_id";
    } else if (!type) {
      type = "customId";
    }
    if (userId.length > 10) {
      type = "_id";
    }
    const query = { [type]: userId }; // Usar notación de corchetes para crear el objeto de consulta

    const user = await User.findOne(query).populate({
      path: "activity",
      populate: {
        path: "name",
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado" });
    }

    req.userData = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "error", message: "Error en el servidor" });
  }
};
