import Activity from "../../../models/models/Actividades.js";
import Stadistics from "../../../models/models/Stadistics.js";
import User from "../../../models/models/User.js";

import moment from "moment";

const cantidad_inasistecias = async (actividad, asistencia) => {
  try {
    const estadistica = await Stadistics.find({
      activity: actividad,
    });

    const allDays = estadistica.reduce((acc, obj) => {
      acc.push(...obj.dias);
      return acc;
    }, []);

    console.log(allDays);
    console.log({ asistencia });

    const fechaAsistencia = moment(asistencia[0], "DD/MM/YYYY");
    let fechaCercana = null;
    let diferenciaMinima = Number.MAX_VALUE;

    for (const fecha of allDays) {
      const fechaComparar = moment(fecha, "DD/MM/YYYY");
      if (
        fechaComparar.isAfter(fechaAsistencia) &&
        fechaComparar.diff(fechaAsistencia, "days") < diferenciaMinima
      ) {
        fechaCercana = fecha;
        diferenciaMinima = fechaComparar.diff(fechaAsistencia, "days");
      }
    }
    console.log("Fecha más cercana:", fechaCercana);

    if (!fechaCercana) {
      return 0;
    }

    const indice = allDays.indexOf(fechaCercana);
    const arr = allDays.slice(indice);

    return arr.length - (asistencia.length - 1);
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

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

      console.log(users);

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

    console.log(inasistencias);

    return res.status(200).json({ status: "success", users });
  } catch (error) {
    console.log(error.message);
    return res
      .status(400)
      .json({ status: "error", message: "error en el servidor" });
  }
};
