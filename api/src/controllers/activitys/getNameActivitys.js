import Activity from "../../models/models/Actividades.js";

export const getNameActivitys = async (req, res) => {
  try {
    const activitys = await Activity.find();
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
