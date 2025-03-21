import {
  Activity,
  Day,
  Horarios,
  Stadistic,
  User,
} from "../../models/index.js";

export class ActividadController {
  static getActivities = async (req, res) => {
    try {
      const actividades = await Activity.find().populate({
        path: "date",
        populate: { path: "date" },
      });

      return res.status(200).json({
        status: "success",
        actividades,
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  };

  static getActividadesSinCodigoDeAcceso = async (req, res) => {
    try {
      const actividades = await Activity.find({
        $or: [
          { codigoDeAcceso: "" }, // Actividades donde el campo codigoDeAcceso es igual a una cadena vacía
          { codigoDeAcceso: { $exists: false } }, // Actividades donde el campo codigoDeAcceso no existe
        ],
      });

      return res.status(200).json({
        status: "success",
        actividades,
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  };

  static getActividadesParaUsuario = async (req, res) => {
    //obtengo el id por token
    const { id } = req.user;

    try {
      const user = await User.findById(id);

      const projection = {
        codigoDeAcceso: 0,
      };

      //si el usuario es de matacion adaptada devuelvo todas las actividades de natacion adaptada
      if (user.natacionAdaptada) {
        const actividades = await Activity.find(
          {
            natacionAdaptada: true,
            $or: [
              { codigoDeAcceso: "" }, // Actividades donde el campo codigoDeAcceso es igual a una cadena vacía
              { codigoDeAcceso: { $exists: false } }, // Actividades donde el campo codigoDeAcceso no existe
            ],
          },
          projection
        ).sort({
          hourStart: 1,
        });
        return res.status(200).json({ status: "success", actividades });
      }

      const actividades = await Activity.find(
        {
          // name: activity,
          desde: { $lte: user.edad },
          hasta: { $gte: user.edad },
          //quito las actividades de natacion adaptada
          natacionAdaptada: false,
          $or: [
            { codigoDeAcceso: "" }, // Actividades donde el campo codigoDeAcceso es igual a una cadena vacía
            { codigoDeAcceso: { $exists: false } }, // Actividades donde el campo codigoDeAcceso no existe
          ],
        },
        projection
      ).sort({
        hourStart: 1,
      });

      //quiero ordenar las actividades de mayor a menor segun su horario de ingreso

      res.status(200).json({ status: "success", actividades });
    } catch (error) {
      console.log(error.message);
      res.status(404).json({ message: "error en el servidor" });
    }
  };

  static getInfoActividades = async (req, res) => {
    const { id } = req.params;
    try {
      if (isNaN(id)) {
        const actividad = await Activity.findById(id).populate("users");
        const estadistica = await Stadistic.find({ activity: actividad });
        return res.status(200).json({ actividad, estadistica });
      }

      const actividad = await Activity.findOne({
        codigoDeAcceso: id,
      });
      if (!actividad) {
        return res
          .status(404)
          .json({ status: "error", message: "actividad no encontrada" });
      }

      return res.status(200).json(actividad);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "error en el servidor" });
    }
  };

  static createActivity = async (req, res) => {
    let {
      name,
      pileta,
      hourStart,
      hourFinish,
      date,
      cupos,
      actividadEspecial,
      natacionAdaptada,
      desde,
      hasta,
      actividadHabilitada,
      codigoDeAcceso,
    } = req.body;

    console.log(req.body);

    try {
      if (!name || !pileta || !hourStart || !hourFinish || !date) {
        return res.status(400).json({
          status: "error",
          message: "Faltan datos por Completar",
        });
      }

      name = name.toLowerCase();

      if (pileta !== "pileta 25" && pileta !== "pileta 50") {
        return res.status(400).json({
          status: "error",
          message: "nombre de pileta incorrecto",
        });
      }

      //buscamos SI LOS DIAS EXISTEN
      const dayExist = await Promise.all(
        date.map(async (name) => {
          const day = await Day.findOne({ nameDate: name });

          return day ? true : name; // Retorna true si el día existe, de lo contrario, retorna false
        })
      );
      const isFalse = dayExist.filter((e) => e !== true);
      if (isFalse.length) {
        return res.status(400).json({
          status: "error",
          message: `los dias ${isFalse} no existen`,
        });
      }

      let hour = await Horarios.findOne({ hourStart, hourFinish });
      if (actividadEspecial) {
        hour = true;
      }
      if (!hour) {
        //si  no existe devolvemos un error
        return res.status(400).json({
          status: "error",
          message: "el horario ingresado no es correcto",
        });
      }

      //si hour start o hour finish tienen este formato 8:00 lo convertimos en 08:00, osea que si antes de los dos puntos hay un solo numero le agregamos un 0
      if (hourStart.length === 4) {
        hourStart = `0${hourStart}`;
      }
      if (hourFinish.length === 4) {
        hourFinish = `0${hourFinish}`;
      }

      //verificamos que el cupo sea un numero
      if (isNaN(cupos)) {
        return res.status(400).json({
          status: "error",
          message: "el cupo debe ser un numero",
        });
      }

      if (cupos <= 0) {
        return res.status(400).json({
          status: "error",
          message: "los cupos no pueden ser negativos",
        });
      }

      //verificamos que la actividad no se encuentre creada en el horario y dia especificado
      const activityExist = await Activity.findOne({
        name,
        pileta,
        hourStart,
        hourFinish,
        date,
      });

      if (activityExist) {
        return res.status(400).json({
          status: "error",
          message: "la actividad ya se encuentra creada",
        });
      }

      const activity = new Activity({
        name,
        pileta,
        hourStart,
        hourFinish,
        date,
        cupos,
        desde,
        hasta,
        userRegister: 0,
        natacionAdaptada: natacionAdaptada ? true : false,
        actividadEspecial: actividadEspecial ? true : false,
        actividadHabilitada: actividadHabilitada ?? true,
        codigoDeAcceso: codigoDeAcceso ?? "",
      });

      activity.save();

      res.status(200).json({
        status: "success",
        message: "Actividad creada con exito",
        activity,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };

  static deleteActivity = async (req, res) => {
    try {
      const { id } = req.params;
      const activity = await Activity.findByIdAndDelete(id).populate("user");

      //tengo que borrar la actividad de todos los ususarios que la tengan
      // const users = await User.find({ activities: id });

      res.status(200).json({ status: "success", activity });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Error al eliminar la actividad" });
    }
  };

  static editActivity = async (req, res) => {
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
  };
}
