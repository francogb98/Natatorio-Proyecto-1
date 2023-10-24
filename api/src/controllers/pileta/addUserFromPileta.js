import User from "../../models/models/User.js";
import Pileta from "../../models/models/Pileta.js";
import Activity from "../../models/models/Actividades.js";

const updateStadistics = async ({ user, dateNowSave }) => {
  try {
    //busco si existe un campo con el id de stadistics en la bdd
    console.log(user.activity[0]._id);
    const activity = await Activity.find({
      _id: user.activity[0]._id,
    }).populate({
      path: "stadistics",
    });
    console.log(activity);

    //si no existe lo creo

    // if (stadistics == null) {
    //   try {
    //     const newStadistics = new Stadistics({
    //       activityId: user.activity[0]._id,
    //       usersQuantity: 1,
    //       date: dateNowSave,
    //     });
    //     await newStadistics.save();
    //     return { ok: true };
    //   } catch (error) {
    //     return { ok: false, msg: "Error en el servidor" };
    //   }
    // }

    // //si existe busco si existe un campo con la fecha actual

    // if (stadistics) {
    //   const dateStadistics = stadistics.date.includes(dateNowSave);
    //   //si no existe lo creo
    //   if (!dateStadistics) {
    //     stadistics.date.push(dateNowSave);
    //     await stadistics.save();
    //   }
    //   //si existe actualizo la cantidad de usuarios
    //   if (dateStadistics) {
    //     stadistics.usersQuantity = stadistics.usersQuantity + 1;
    //     await stadistics.save();
    //   }
    // }
    return { ok: true };
  } catch (error) {
    console.log(error.message);
    return { ok: false, msg: "Error en el servidor" };
  }
};

export const addUser = async (args) => {
  let { id, horaActual, dia, HoraFinalTurno } = args;

  try {
    if (horaActual.length < 5) {
      horaActual = `0${horaActual}`;
    }
    //busco al usuario
    const user = await User.findOne({ customId: id.id }).populate({
      path: "activity",
    });

    //si el usuario no existe devolvemos un error
    if (!user) {
      return { ok: false, msg: "El usuario no existe" };
    }

    if (
      !(user.activity[0].hourFinish >= HoraFinalTurno) ||
      !(user.activity[0].hourStart <= horaActual)
    ) {
      return { ok: false, msg: "El horario  no coincide", user };
    }

    if (!user.activity[0].date.includes(dia)) {
      return { ok: false, msg: "El Dia de su actividad no coincide", user };
    }

    //busco la pileta corresponidente al usuario y le agrego el usuario
    const piletaExist = await Pileta.findOneAndUpdate(
      {
        pileta: user.activity[0].pileta,
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
      return { ok: false, msg: "El usuario ya esta en la lista" };
    }

    const dateNow = new Date();
    const day = dateNow.getDate();
    const month = dateNow.getMonth() + 1;
    const year = dateNow.getFullYear();

    const dateNowSave = `${day}/${month}/${year}`;

    //actualiso el campo de asistncia del suario que es un array
    user.asistencia.push(dateNowSave);
    await user.save();

    return { ok: true, piletaExist, user };
  } catch (error) {
    console.log(error.message);
    return { ok: false, msg: "Error en el servidor" };
  }
};

export const addUserNextTurn = async (args) => {
  const { id, horaSiguienteTurno, dia } = args;
  try {
    if (horaSiguienteTurno.length < 5) {
      horaSiguienteTurno = `0${horaSiguienteTurno}`;
    }
    //busco al usuario

    const user = await User.findOne({ customId: id }).populate({
      path: "activity",
    });

    //si el usuario no existe devolvemos un error
    if (!user) {
      return { ok: false, msg: "El usuario no existe" };
    }

    if (
      user.activity[0].hourStart !== horaSiguienteTurno ||
      !user.activity[0].date.includes(dia)
    ) {
      return { ok: false, msg: "El horario o Dia no coincide", user };
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
      return { ok: false, msg: "El usuario ya esta en la lista" };
    }

    const dateNow = new Date();
    const day = dateNow.getDate();
    const month = dateNow.getMonth() + 1;
    const year = dateNow.getFullYear();

    const dateNowSave = `${day}/${month}/${year}`;

    //actualiso el campo de asistncia del usuario que es un array
    user.asistencia.push(dateNowSave);
    await user.save();

    return { ok: true, piletaExist };
  } catch (error) {
    console.log(error.message);
    return { ok: false, msg: "Error en el servidor" };
  }
};

export const cambioDeTurno = async (args) => {
  const { horaActual } = args;

  try {
    // -------------extraigo informacion de las piletas -----------
    const resp = await Pileta.findOne({
      pileta: "turnoSiguiente",
    }).populate({
      path: "users",
      populate: {
        path: "activity",
      },
    });
    const data25 = await Pileta.findOne({
      pileta: "pileta 25",
    }).populate({
      path: "users",
      populate: {
        path: "activity",
      },
    });
    const data50 = await Pileta.findOne({
      pileta: "pileta 50",
    }).populate({
      path: "users",
      populate: {
        path: "activity",
      },
    });

    //filtro todos los usuarios que su hora de finalizado sea igual que la hora actual
    const users25 = data25.users.filter((user) => {
      return user.activity[0].hourFinish == horaActual;
    });
    const users50 = data50.users.filter((user) => {
      return user.activity[0].hourFinish == horaActual;
    });
    //eliminar de su respectiva pileta los usuarios filtrados
    for (const user of users25) {
      const updatedPileta = await Pileta.findOneAndUpdate(
        {
          pileta: "pileta 25",
        },
        {
          $pull: {
            users: user._id,
          },
        },
        {
          new: true,
        }
      );
    }
    for (const user of users50) {
      const updatedPileta = await Pileta.findOneAndUpdate(
        {
          pileta: "pileta 50",
        },
        {
          $pull: {
            users: user._id,
          },
        },
        {
          new: true,
        }
      );
    }

    //elimino los usuarios de la píleta de turno siguiente y los deribo a sus respectivas piletas
    for (const user of resp.users) {
      // a cada usuario lo voy a derivar a su píleta correspondiente
      const updatedPileta = await Pileta.findOneAndUpdate(
        {
          pileta: user.activity[0].pileta,
          // users: { $ne: user._id }, // Asegura que el usuario no esté en la lista ya
        },
        {
          $push: {
            users: user._id,
          },
        },
        {
          new: true,
        }
      );
    }

    //vacio la tabla de siguiente turno
    const updatedPileta = await Pileta.findOneAndUpdate(
      {
        pileta: "turnoSiguiente",
      },
      {
        $set: {
          users: [],
        },
      },
      {
        new: true,
      }
    );

    return { ok: true, msg: "Cambio de turno realizado con exito!" };
  } catch (error) {
    return { ok: false, msg: "error en el servidor" };
  }
};
