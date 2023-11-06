import Activity from "../../models/models/Actividades.js";

export const getActividadesByNames = async (req, res) => {
  const { activity } = req.body;
  try {
    const activitys = await Activity.find({ name: activity }).sort({
      hourStart: 1,
    });

    //quiero ordenar las actividades de mayor a menor segun su horario de ingreso

    res.status(200).json({ status: "success", actividades: activitys });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
