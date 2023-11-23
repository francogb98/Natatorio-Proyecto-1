import Pileta from "../../models/models/Pileta.js";

import User from "../../models/models/User.js";

export const autorizar = async ({ id }) => {
  try {
    const user = await User.findOne({ customId: id }).populate({
      path: "activity",
    });

    if (!user) {
      return {
        ok: false,
        message: "Usuario no encontrado",
      };
    }

    //busco si en pileta turno siguiente se encuentra el usuario, si se encuentra lo borro

    const piletaExist2 = await Pileta.findOneAndUpdate(
      {
        pileta: "turnoSiguiente",
        users: { $eq: user._id }, // Asegura que el usuario no esté en la lista ya
      },
      {
        $pull: {
          users: user._id,
        },
      },
      {
        new: true,
      }
    ).populate({
      path: "users",
      populate: {
        path: "activity",
      },
    });

    const piletaExist = await Pileta.findOneAndUpdate(
      {
        pileta: user.activity[0].pileta,
        users: { $ne: user._id }, // Asegura que el usuario no esté en la lista ya
      },
      {
        $addToSet: {
          users: user._id,
        },
      },
      {
        new: true,
      }
    ).populate({
      path: "users",
      populate: {
        path: "activity",
      },
    });
    const dateNow = new Date();
    const day = dateNow.getDate();
    const month = dateNow.getMonth() + 1;
    const year = dateNow.getFullYear();

    const dateNowSave = `${day}/${month}/${year}`;

    //actualiso el campo de asistncia del usuario que es un array
    user.asistencia.push(dateNowSave);
    await user.save();

    return {
      ok: true,
      message: "Usuario autorizado",
      user: user,
    };
  } catch (error) {
    return {
      ok: false,
      message: error.message,
    };
  }
};
