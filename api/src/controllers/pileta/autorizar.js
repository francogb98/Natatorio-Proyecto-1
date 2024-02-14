import Pileta from "../../models/models/Pileta.js";

import User from "../../models/models/User.js";

import { obtenerFechaYHoraArgentina } from "../../Helpers/traerInfoDelDia.js";

export const autorizar = async (req, res) => {
  const { id } = req.body;

  try {
    const usuario = await User.findOne({ customId: id }).populate({
      path: "activity",
      populate: {
        path: "name",
      },
    });

    const { hora, fecha } = obtenerFechaYHoraArgentina();

    const piletaExist = await Pileta.findOneAndUpdate(
      {
        pileta: usuario.activity ? usuario.activity[0].pileta : "pileta 50",
        dia: fecha,
        hora: hora,
        "users.customid": { $ne: usuario.customId }, // Asegura que el usuario no esté en la lista ya
      },
      {
        $addToSet: {
          // Utiliza $addToSet en lugar de $push
          users: {
            customid: usuario.customId,
            nombre: usuario.nombre + " " + usuario.apellido,
            horarioSalida: "22:00",

            actividad: "autorizado",
          },
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      status: "success",
      msg: "Usuario autorizado",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      msg: "Error en el servidor",
    });
  }
};
