import Activity from "../../models/models/Actividades.js";
import User from "../../models/models/User.js";

export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findByIdAndDelete(id).populate("user");

    console.log(activity);

    //tengo que borrar la actividad de todos los ususarios que la tengan
    // const users = await User.find({ activities: id });

    res.status(200).json({ status: "success", activity });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "error", message: "Error al eliminar la actividad" });
  }
};
