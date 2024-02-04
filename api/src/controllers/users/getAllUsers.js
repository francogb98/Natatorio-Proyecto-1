import User from "../../models/models/User.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json({ status: "success", users });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
};

export default getAllUsers;
