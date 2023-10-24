import User from "../../models/models/User.js";
import Activity from "../../models/models/Actividades.js";

export const getActivities = async (req, res) => {
  try {
    const activity = await Activity.find().populate({
      path: "date",
      populate: { path: "date" },
    });

    return res.status(200).json({
      status: "success",
      message: "Actividades encontradas",
      data: {
        activity,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getActivitiesByDate = async (req, res) => {
  let { date, hourStart } = req.body;

  console.log(date, hourStart);
  //si hour start teiene este formato 8:00 lo convertimos en 08:00, osea que si antes de los dos puntos hay un solo numero le agregamos un 0

  if (hourStart.length === 4) {
    hourStart = `0${hourStart}`;
  }

  try {
    const activity = await Activity.find({
      date: { $in: [date] },
      $and: [
        { hourStart: { $lte: hourStart } }, // Actividades que han comenzado antes o en este momento
        { hourFinish: { $gt: hourStart } }, // Actividades que aún no han finalizado
      ],
    }).populate({
      path: "users",
      populate: { path: "activity" },
    });

    const usersData = activity.map((item) => item.users);

    return res.status(200).json({
      status: "success",
      message: "Actividades encontradas",

      users: usersData,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
