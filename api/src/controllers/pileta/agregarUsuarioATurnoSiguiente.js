import User from "../../models/models/User.js";
import Pileta from "../../models/models/Pileta.js";

import { actualizarEstadisticas } from "../stadistics/actualizarEstadisticas.js";

export const addUserNextTurn = async (req, res) => {
  let { id } = req.body;

  try {
    //busco al usuario
    let user = await User.findOne({ customId: id }).populate({
      path: "activity",
    });
    //si el usuario no existe devolvemos un error
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", msg: "El usuario no existe" });
    }

    //busco la pileta corresponidente al usuario y le agrego el usuario
    const piletaExist = await Pileta.findOneAndUpdate(
      {
        pileta: "turnoSiguiente",
        users: { $ne: user._id }, // Asegura que el usuario no esté en la lista ya
      },
      {
        $addToSet: {
          // Utiliza $addToSet en lugar de $push
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

    if (!piletaExist) {
      return res
        .status(400)
        .json({ status: "error", msg: "El usuario ya esta en la lista", user });
    }

    const dateNow = new Date();
    const day = dateNow.getDate();
    const month = dateNow.getMonth() + 1;
    const year = dateNow.getFullYear();

    const dateNowSave = `${day}/${month}/${year}`;

    //actualiso el campo de asistncia del usuario que es un array
    user.asistencia.push(dateNowSave);
    await user.save();

    //-----------------ACTUALIZO LAS ESTADISTICAS-------------
    //necesito acceder al mes en espyearl
    const monthSpanish = dateNow.toLocaleString("es-ES", { month: "long" });
    //acceder al year con los 4 digitos
    const yearSpanish = dateNow.toLocaleString("es-ES", { year: "numeric" });

    const resp = await actualizarEstadisticas({
      activity: user.activity[0]._id,
      mes: monthSpanish,
      year: yearSpanish,
    });

    if (!resp.ok) {
      return res.status(400).json({ status: "error", msg: resp.msg });
    }

    //----------------------------------------------------------

    return res.status(200).json({ status: "success", msg: "Usuario Agregado" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "error", msg: "Error en el servidor" });
  }
};
