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

    if (!user.activity) {
      user.activity = [];
    }

    res.status(200).json({ status: "success", user });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    let id;
    if (req.params.id) {
      id = req.params.id;
    } else if (req.body.id) {
      console.log(req.body);
      id = req.body.id;
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Falta el ID del usuario" });
    }

    let user;
    if (!isNaN(id)) {
      user = await User.findOne({ customId: id }).populate({
        path: "activity",
        populate: {
          path: "name",
        },
      });
    } else {
      user = await User.findOne({ _id: id }).populate({
        path: "activity",
        populate: {
          path: "name",
        },
      });
    }

    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado" });

    res.status(200).json({ status: "success", user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};
