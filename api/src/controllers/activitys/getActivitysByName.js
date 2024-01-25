import Activity from "../../models/models/Actividades.js";
import User from "../../models/models/User.js";

export const getActividadesByNames = async (req, res) => {
  // const { activity } = req.body;
  const { id } = req.user;

  try {
    const user = await User.findById(id);

    const activitys = await Activity.find({
      // name: activity,
      desde: { $lte: user.edad },
      hasta: { $gte: user.edad },
      //que el campo cupos sea mayor a 1
      cupos: { $gte: 1 },
    }).sort({
      hourStart: 1,
    });

    //quiero ordenar las actividades de mayor a menor segun su horario de ingreso

    res.status(200).json({ status: "success", actividades: activitys });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
