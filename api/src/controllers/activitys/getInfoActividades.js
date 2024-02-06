import Activity from "../../models/models/Actividades.js";

export default async function getInfoActividades(req, res) {
  const id = req.params.id;
  try {
    const actividad = await Activity.findById(id).populate("users");

    // console.log("total usuarios", actividad.users.length);
    return res.status(200).json(actividad);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
