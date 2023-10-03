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
  const { date, hourStart, hourFinish } = req.body;

  try {
    const activity = await Activity.find({
      date: { $in: [date] },
      hourStart,
      hourFinish,
    }).populate({
      path: "users",
      populate: { path: "activity" },
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
