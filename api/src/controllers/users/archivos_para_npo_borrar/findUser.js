import { cantidad_inasistecias } from "../../../Helpers/cantidad_inasistencias.js";
import User from "../../../models/models/User.js";

export const findUser = async (req, res) => {
  try {
    const { filtro } = req.body;

    const datos = [
      "apellido",
      "nombre",
      "status",
      "inasistencias",
      "asistencia",
      "customId",
      "foto",
      "fechaCargaCertificadoHongos",
    ];

    if (isNaN(filtro)) {
      const users = await User.find({
        apellido: {
          $regex: new RegExp(filtro, "i"), // 'i' indica insensibilidad a mayúsculas y minúsculas
        },
      })
        .populate({
          path: "activity",
          populate: {
            path: "name",
          },
        })
        .select(datos);
      if (!users.length) {
        return res.status(200).json({
          status: "error",
          message: "no se encontraron usuarios con el apellido: " + filtro,
        });
      }

      return res.status(200).json({ status: "success", users });
    }

    const users = await User.find({
      customId: filtro,
    })
      .populate({
        path: "activity",
        populate: {
          path: "name",
        },
      })
      .select(datos);
    if (!users.length) {
      return res.status(200).json({
        status: "error",
        message: "no se encontraron usuarios con el apellido: " + filtro,
      });
    }

    let inasistencias = 0;

    if (users[0].activity) {
      inasistencias = await cantidad_inasistecias(
        users[0].activity[0],
        users[0].asistencia
      );
    }

    console.log(users);

    return res.status(200).json({ status: "success", users, inasistencias });
  } catch (error) {
    console.log(error.message);
    return res
      .status(400)
      .json({ status: "error", message: "error en el servidor" });
  }
};
