import Activity from "../../models/models/Actividades.js";

import User from "../../models/models/User.js";

export const getNameActivitys = async (req, res) => {
  //obtengo el id por token
  const { id } = req.user;

  try {
    const user = await User.findById(id);

    const projection = {
      _id: 0, // Excluir el campo _id
      codigoDeAcceso: 0, // Excluir otros campos (reemplaza 'campoAExcluir' con el nombre real del campo)
      cupos: 0,
      stadistics: 0,
    };

    //si el usuario es de matacion adaptada devuelvo todas las actividades de natacion adaptada
    if (user.natacionAdaptada) {
      const activitys = await Activity.find(
        {
          natacionAdaptada: true,
        },
        projection
      ).sort({
        hourStart: 1,
      });
      return res
        .status(200)
        .json({ status: "success", actividades: activitys });
    }

    const activitys = await Activity.find(
      {
        // name: activity,
        desde: { $lte: user.edad },
        hasta: { $gte: user.edad },
        //quito las actividades de natacion adaptada
        natacionAdaptada: false,
      },
      projection
    ).sort({
      hourStart: 1,
    });

    //quiero ordenar las actividades de mayor a menor segun su horario de ingreso

    res.status(200).json({ status: "success", actividades: activitys });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
