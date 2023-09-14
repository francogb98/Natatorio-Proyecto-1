import User from "../../models/models/User.js";

export const cambiarRole = async (req, res) => {
  try {
    const { id, role } = req.body;

    if (!id || !role) {
      return res.status(400).json({
        status: "error",
        message: "missing data",
      });
    }

    //buscamos al ususario por su id y actualizamos su role

    const user = await User.findByIdAndUpdate(
      { _id: id },
      { role: role },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "role cambiado",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "no se pudo cambiar el role",
    });
  }
};
