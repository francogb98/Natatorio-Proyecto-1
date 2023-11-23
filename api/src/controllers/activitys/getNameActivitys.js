import Activity from "../../models/models/Actividades.js";

import User from "../../models/models/User.js";

export const getNameActivitys = async (req, res) => {
  //obtengo el id por token
  const { id } = req.user;

  try {
    const user = await User.findById(id);

    //quiero filtrar las actividades que el campo desde sea mayor a la edad del usuario y hasta sea menor a la edad del usuario
    const activitys = await Activity.find({
      desde: { $lte: user.edad },
      hasta: { $gte: user.edad },
    });

    console.log(activitys);

    const nameActivitys = activitys.map((activity) => {
      return activity.name;
    });

    const nameActivitysNoRepeat = nameActivitys.filter(
      (value, index) => nameActivitys.indexOf(value) === index
    );

    res
      .status(200)
      .json({ status: "success", actividades: nameActivitysNoRepeat });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
