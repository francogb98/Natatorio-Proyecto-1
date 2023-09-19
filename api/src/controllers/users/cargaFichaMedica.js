import User from "../../models/models/User.js";

export const cargaFicha = async (req, res) => {
  try {
    const { fichaMedica, id } = req.body;
    console.log(fichaMedica, id);
    if (!fichaMedica)
      return res.status(400).json({
        status: "error",
        message: "Ficha médica no puede estar vacía",
      });
    const user = await User.findByIdAndUpdate(
      id,
      { fichaMedica },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: "Ficha cargada correctamente",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};
