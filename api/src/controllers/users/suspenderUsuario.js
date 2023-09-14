import User from "../../models/models/User.js";
import Activity from "../../models/models/Actividades.js";

export const suspenderUsuario = async (req, res) => {
  try {
    const { id, idActivity } = req.body;

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "missing data",
      });
    }

    //buscamos al ususario por su id

    const isUserExist = await User.findById(id);

    if (!isUserExist) {
      return res.status(400).json({
        status: "error",
        message: "el usuario no existe",
      });
    }

    //verificamos que el usuario no este suspendido
    if (isUserExist.role === "suspendido") {
      return res.status(400).json({
        status: "error",
        message: "el usuario ya esta suspendido",
      });
    }

    //suspender usuario

    isUserExist.role = "suspendido";

    //eliminamos su actividad

    isUserExist.activity = [];

    const userUpdate = await isUserExist.save();

    //eliminamos al usuario de las actividades

    const activity = await Activity.findOneAndUpdate(
      { _id: idActivity },
      { $pull: { users: id } },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "usuario suspendido",
      user: userUpdate,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "no se pudo suspender el usuario",
    });
  }
};
