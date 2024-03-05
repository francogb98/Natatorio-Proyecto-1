import Activity from "../../models/models/Actividades.js";
import Stadistics from "../../models/models/Stadistics.js";

export default async function getInfoActividades(req, res) {
  const { id } = req.params;
  try {
    if (isNaN(id)) {
      const actividad = await Activity.findById(id).populate("users");
      const estadistica = await Stadistics.find({ activity: actividad });
      return res.status(200).json({ actividad, estadistica });
    }

    const actividad = await Activity.findOne({
      codigoDeAcceso: id,
    });
    if (!actividad) {
      return res
        .status(404)
        .json({ status: "error", message: "actividad no encontrada" });
    }

    return res.status(200).json(actividad);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "error en el servidor" });
  }
}
