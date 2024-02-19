import Activity from "../../models/models/Actividades.js";

export default async function (req, res) {
  try {
    const actividad = await Activity.findOneAndUpdate(
      { _id: req.body.id },
      {
        name: req.body.args.name,
        pileta: req.body.args.pileta,
        hourStart: req.body.args.hourStart,
        hourFinish: req.body.args.hourFinish,
        date: req.body.args.date,
        users: req.body.args.users,
        userRegister: req.body.args.userRegister,
        stadistics: req.body.args.stadistics,
        cupos: req.body.args.cupos,
        actividadEspecial: req.body.args.actividadEspecial,
        desde: req.body.args.desde,
        hasta: req.body.args.hasta,

        codigoDeAcceso: req.body.args.codigoDeAcceso ?? "",
        actividadHabilitada: req.body.args.actividadHabilitada ?? true,
      },
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      message: "Actividad editada con exito",
      actividad,
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}
