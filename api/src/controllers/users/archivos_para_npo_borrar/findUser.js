import User from "../../../models/models/User.js";

export const findUser = async (req, res) => {
  try {
    const { filtro } = req.body;

    console.log(filtro);
    console.log(req.body);

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
        .select(["apellido", "nombre", "status", "inasistencias", "customId"]);
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
      .select(["apellido", "nombre", "status", "inasistencias", "customId"]);
    if (!users.length) {
      return res.status(200).json({
        status: "error",
        message: "no se encontraron usuarios con el apellido: " + filtro,
      });
    }

    return res.status(200).json({ status: "success", users });
  } catch (error) {
    console.log(error.message);
    return res
      .satatus(400)
      .json({ status: "error", message: "error en el servidor" });
  }
};
