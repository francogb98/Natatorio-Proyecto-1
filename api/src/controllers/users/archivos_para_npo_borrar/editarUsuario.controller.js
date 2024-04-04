import User from "../../../models/models/User.js";

export const editarUsuarioPrueba = async (req, res) => {
  const { filtro } = req.params;
  const { id } = req.user;

  try {
    if (filtro == "datos") {
      const newData = req.body;

      console.log(newData);

      const updatedUser = await User.findByIdAndUpdate(id, newData, {
        new: true,
      });
      return res
        .status(200)
        .json({ status: "success", msg: "actualizare datos", updatedUser });
    }
    if (filtro == "archivo") {
      console.log(req.files);
      if (
        !req.files ||
        Object.keys(req.files).length === 0 ||
        !req.files.archivo
      ) {
        res.status(400).json({ message: "No hay archivos para subir." });
        return;
      }
      const { tempFilePath, name } = req.files.archivo;

      console.log(tempFilePath, name);

      return res
        .status(200)
        .json({ status: "success", msg: "actualizare archivos" });
    }
    if (filtro == "actividad") {
      return res
        .status(200)
        .json({ status: "success", msg: "actualizare actividad" });
    }

    return res
      .status(200)
      .json({ status: "success", msg: "Usuario actualizado con exito" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(400)
      .json({ status: "error", msg: "Error en el servidor" });
  }
};
