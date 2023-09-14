import Activity from "../../models/models/Actividades.js";
import Day from "../../models/models/Days.js";
import Horarios from "../../models/models/Horarios.js";

export const createActivity = async (req, res) => {
  const { name, pileta, hourStart, hourFinish, date, cupos } = req.body;

  try {
    if (!name || !pileta || !hourStart || !hourFinish || !date) {
      return res.status(400).json({
        status: "error",
        message: "missing data",
      });
    }

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

    if (!hour) {
      //si  no existe devolvemos un error
      return res.status(400).json({
        status: "error",
        message: "el horario ingresado no es correcto",
      });
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
      userRegister: 0,
    });

    activity.save();

    res.status(200).json({
      status: "success",
      message: "activity created",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
