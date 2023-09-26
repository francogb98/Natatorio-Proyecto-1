import User from "../../models/models/User.js";

export const searchUserByname = async (req, res) => {
  const { name } = req.params;

  try {
    if (!name)
      return res.status(404).json({
        message: "Por favor insertar nombre para realizar la busqueda",
        status: "error",
      });
    const user = await User.find({
      nombre: { $regex: name, $options: "i" },
    }).populate({
      path: "activity",
      populate: {
        path: "name",
      },
    });

    //si no encuentra un resultado devolvemos un status 404

    if (!user.length)
      return res.status(404).json({
        message: "No se encontraron resultados",
        status: "error",
      });
    res.status(200).json({ status: "success", user });
  } catch (error) {
    res.status(404).json({ message: error.message, status: "error" });
  }
};
