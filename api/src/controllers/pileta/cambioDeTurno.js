import Pileta from "../../models/models/Pileta.js";

export const cambioDeTurno = async (req, res) => {
  try {
    let dated = new Date();
    let argentinaTime = dated.toLocaleString("en-US", {
      timeZone: "America/Argentina/Buenos_Aires",
    });
    let horaActual = new Date(argentinaTime).getHours();

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

    const date = new Date();
    const day = date.toLocaleDateString("es-AR", { weekday: "long" });
    const hour = date.getHours();

    //hago que l apirmera letra del dia sea en mayuscula
    const dayCapitalized = day.charAt(0).toUpperCase() + day.slice(1);

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
          //ademas actualizo el cmapo de hora y dia
          $set: {
            dia: dayCapitalized,
            hora: hour,
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
          //ademas actualizo el cmapo de hora y dia
          $set: {
            dia: dayCapitalized,
            hora: hour,
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
          users: { $ne: user._id }, // Asegura que el usuario no esté en la lista ya
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
          dia: dayCapitalized,
          hora: hour,
        },
      },
      {
        new: true,
      }
    );

    "llegueaqui", updatedPileta;

    return res.status(200).json({
      ok: true,
      msg: "cambio de turno realizado",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "error",
    });
  }
};
