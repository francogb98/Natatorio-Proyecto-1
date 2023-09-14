import Activity from "../../models/models/Actividades.js";
import User from "../../models/models/User.js";

export const addUserFromActivity = async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findOne({
      _id: req.user.id,
    });
    //verificamos si el usuario ya esta registrado en la actividad
    if (user.activity.length) {
      return res.status(400).json({
        status: "error",
        message: "El usuario ya se encuentra inscripto en una actividad",
      });
    }

    const isActivityExist = await Activity.findById({
      _id: id,
    });

    if (!isActivityExist) {
      return res.status(400).json({
        status: "error",
        message: "La actividad seleccionada no existe",
      });
    }

    //verificamos si hay cupo
    if (isActivityExist.userRegister >= isActivityExist.cupos) {
      return res.status(400).json({
        status: "error",
        message: "Cupos agotados",
      });
    }

    //agregamos el usuario, e incrementamos el cupo
    const activityUpdate = await Activity.findOneAndUpdate(
      { _id: isActivityExist._id },
      { $push: { users: user }, $inc: { userRegister: 1 } },
      { new: true }
    );

    //   //le añadimos al usuario la actividad, con sus respectivos horarios
    const userUpdate = await User.findOneAndUpdate(
      { _id: user._id },

      //el status es un boolean no un array de objetos
      { $push: { activity: activityUpdate._id }, $set: { status: false } },

      { new: true }
    );

    return res.status(200).json({
      status: "success",
      message: "Usuario agregado a la actividad",
      data: {
        activityUpdate,
        userUpdate,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const DeshabilitarUser = async (req, res) => {
  //buscamos el usuario para deshabilitar por el id y lo actualizamos su stats a false y borramos la actividad de su campo y borramos el usuario del campo activity
  const { id, idActivity } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: { status: false }, $pull: { activity: idActivity } },
      { new: true }
    );
    const activity = await Activity.findOneAndUpdate(
      { _id: idActivity },
      { $pull: { users: id } },
      { new: true }
    );
    return res.status(200).json({
      status: "success",
      message: "Usuario deshabilitado",
      data: {
        user,
        activity,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
export const HabilitarUser = async (req, res) => {
  //buscamos el usuario a habilitar por el id y lo actualizamos su stats a true
  const { id } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: { status: true } },
      { new: true }
    ).populate({
      path: "activity",
      populate: {
        path: "name",
      },
    });
    return res.status(200).json({
      status: "success",
      message: "Usuario habilitado",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
