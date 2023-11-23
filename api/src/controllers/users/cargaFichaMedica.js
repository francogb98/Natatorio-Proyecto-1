import User from "../../models/models/User.js";

export const cargaFicha = async (req, res) => {
  try {
    const { archivo, id, tipo } = req.body;

    req.body;

    const user = await User.findOne({ _id: id });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado" });
    }
    if (tipo === "ficha") {
      user.fichaMedica = archivo;
    }
    if (tipo === "hongos") {
      const hoy = new Date();

      const mes = hoy.getMonth() + 1;

      const anio = hoy.getFullYear();

      const dia = hoy.getDate();

      const fecha = `${dia}/${mes}/${anio}`;
      user.certificadoHongos = archivo;
      user.fechaCargaCertificadoHongos = fecha;
    }
    if (tipo === "cud") {
      user.cud = archivo;
    }

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Ficha cargada correctamente",
      user,
    });
  } catch (error) {
    error;
    res.status(500).json({ status: "error", message: error.message });
  }
};
