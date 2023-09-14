import User from "../../models/models/User.js";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  try {
    const { token } = req.params;

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById({ _id: id }).populate({
      path: "activity",
      populate: {
        path: "name",
      },
    });

    res.status(200).json({ status: "success", user });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
};
export const getUserById = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    const user = await User.findOne({ customId: id }).populate({
      path: "activity",
      populate: {
        path: "name",
      },
    });

    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "Usuario no Encontrado" });

    res.status(200).json({ status: "success", user });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
};

export const getAllUserForHability = async (req, res) => {
  try {
    //quiero devolver solo los usuarios que tengn sus status en false
    const users = await User.find({ status: false }).populate({
      path: "activity",
      populate: {
        path: "name",
      },
    });

    res.status(200).json({ status: "success", users });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
};
