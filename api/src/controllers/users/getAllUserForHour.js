import User from "../../models/models/User.js";

export const getAllUsersForHour = async (req, res) => {
  const { hour } = req.params;

  try {
    console.log(hour);
    const users = await User.find({ hourStart: hour });
    res.json(users);
  } catch (error) {
    console.log(error.message);
  }
};
