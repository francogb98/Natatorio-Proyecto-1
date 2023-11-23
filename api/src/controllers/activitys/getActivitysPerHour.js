import Activity from "../../models/models/Actividades.js";

export const getActividadesPerHour = async (req, res) => {
  const { hourStart } = req.params;

  hourStart;

  try {
    const activitys = await Activity.find({ hourStart: hourStart }).populate({
      path: "users",
      select: "name",
    });

    //quiero devolver solamente los usuarios que estan en las actividades
    const usuarios = activitys.map((activity) => {
      //si no tienen ningun usuario no devuelvo nada
      if (activity.users.length === 0) {
        return;
      }

      return activity.users;
    });

    res.status(200).json({ status: "success", usuarios });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
