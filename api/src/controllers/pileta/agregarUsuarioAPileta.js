import User from "../../models/models/User.js";
import Pileta from "../../models/models/Pileta.js";
import Activity from "../../models/models/Actividades.js";

const fechaActual = () => {
  const fechaActual = new Date();
  let hora = fechaActual.getHours();
  let horaActual = hora.toString() + ":00";
  let HoraFinalTurno = parseInt(hora) + 1 + ":00";

  if (horaActual.length < 5) {
    horaActual = `0${horaActual}`;
  }
  if (HoraFinalTurno.length < 5) {
    HoraFinalTurno = `0${HoraFinalTurno}`;
  }
  //accedo al dia actual en español
  let dia = fechaActual.toLocaleDateString("es-AR", { weekday: "long" });
  dia = dia.charAt(0).toUpperCase() + dia.slice(1);

  return { horaActual, HoraFinalTurno, dia };
};

export const agregarUsuarioAPileta = async (req, res) => {
  let { id } = req.body;
  try {
    //acceder a la hora actual
    const { horaActual, HoraFinalTurno, dia } = fechaActual();
    //busco al usuario
    const user = await User.findOne({ customId: id }).populate({
      path: "activity",
    });
    //si el usuario no existe devolvemos un error
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", msg: "El usuario no existe" });
    }

    //verifico que la el horario de ingreso de la actividad corresponda con la hora actual en formato argentina
    let dated = new Date();
    let argentinaTime = dated.toLocaleString("en-US", {
      timeZone: "America/Argentina/Buenos_Aires",
    });
    let hourStart = new Date(argentinaTime).getHours();
    if (hourStart.toString().length === 1) {
      hourStart = `0${hourStart}:00`;
    } else {
      hourStart = `${hourStart}:00`;
    }

    if (user.activity[0].hourStart !== hourStart) {
      return res.status(400).json({
        status: "error",
        message: `Horario de actividad Incorrecto`,
      });
    }

    //busco la pileta corresponidente al usuario y le agrego el usuario
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

    return res.status(200).json({
      status: "success",
      msg: "Usuario agregado correctamente",
      user,
      piletaExist,
    });
  } catch (error) {
    error.message;
    return res
      .status(500)
      .json({ status: "error", msg: "Error en el servidor" });
  }
};
