import Activity from "../../models/models/Actividades.js";

export const getUsersFromActivity = async (req, res) => {
  //accedo al dia y a la hora actual en español, y la hora en formato 24hs
  const date = new Date();
  const day = date.toLocaleDateString("es-AR", { weekday: "long" });
  const hour = date.getHours();

  const dayCapitalized = day.charAt(0).toUpperCase() + day.slice(1);

  const horaActual = `${hour.length === 1 ? "0" + hour : hour}:00`;

  try {
    //necesito traer todas las actividades que su hora de inicio sea igual o menor a la hora actual, y su hora de finalizado sea mayor a la hora actual

    //el campo dia de actividad es un array y tengo que buscar si el dia actual esta incluido en ese array

    const activities = await Activity.find({
      date: { $in: [dayCapitalized] },
      hourStart: { $lte: horaActual },
      hourFinish: { $gt: horaActual },
    }).populate({
      path: "users",
    });

    //necesito devolver en un nuevo aray solamente los usuarios quiero que me devuelva todo en un solo array

    const usersList = [];

    activities.forEach((activity) => {
      activity.users.forEach((user) => {
        usersList.push(user);
      });
    });

    //necesito que me devuelva un array con todos los usuarios que estan en actividades que cumplen con la condicion de hora y dia

    return res.status(200).json({ status: "success", usersList });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error en el Servidor" });
  }
};
