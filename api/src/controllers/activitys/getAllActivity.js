import Activity from "../../models/models/Actividades.js";
import Pileta from "../../models/models/Pileta.js";

export const getActivities = async (req, res) => {
  try {
    const activity = await Activity.find().populate({
      path: "date",
      populate: { path: "date" },
    });

    return res.status(200).json({
      status: "success",
      message: "Actividades encontradas",
      data: {
        activity,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getActivitiesByDateNextTurn = async (req, res) => {
  //accedo al dia y hora

  let dated = new Date();
  let argentinaTime = dated.toLocaleString("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
  });
  let hourStart = new Date(argentinaTime).getHours();

  //accedi al da en español

  let date = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
  });

  date = date.charAt(0).toUpperCase() + date.slice(1);

  if (hourStart.toString().length === 1) {
    hourStart = `0${hourStart + 1}:00`;
  } else {
    hourStart = `${hourStart + 1}:00`;
  }

  try {
    const activity = await Activity.find({
      date: { $in: [date] },
      $and: [
        { hourStart: { $lte: hourStart } }, // Actividades que han comenzado antes o en este momento
        { hourFinish: { $gt: hourStart } }, // Actividades que aún no han finalizado
      ],
    }).populate({
      path: "users",
    });

    const usersArray = [];

    const userPileta = [];

    activity.map((item) => item.users.map((user) => usersArray.push(user)));

    const piletas = await Pileta.find({}).populate({
      path: "users",
      populate: {
        path: "activity",
      },
    });

    //de la propiedad users de piletas, filtro los usuarios que coincidan con los de usersArray
    piletas.map((item) => item.users.map((user) => userPileta.push(user)));

    const sonIguales = (usuario1, usuario2) =>
      usuario1._id.toString() === usuario2._id.toString();

    // Filtrar usuarios únicos en arr1
    const uniqueArr1 = usersArray.filter(
      (user1) => !userPileta.some((user2) => sonIguales(user1, user2))
    );

    // console.log(uniqueArr1);

    return res.status(200).json({
      status: "success",
      message: "Actividades encontradas",
      users: uniqueArr1,
      totalUsuarios: uniqueArr1.length,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
export const getActivitiesByDate = async (req, res) => {
  //accedo al dia y hora

  let dated = new Date();
  let argentinaTime = dated.toLocaleString("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
  });
  let hourStart = new Date(argentinaTime).getHours();

  //accedi al da en español

  let dateInArgentina = new Date(argentinaTime).toLocaleDateString("es-ES", {
    weekday: "long",
  });

  console.log(dateInArgentina);

  dateInArgentina =
    dateInArgentina.charAt(0).toUpperCase() + dateInArgentina.slice(1);

  if (hourStart.toString().length === 1) {
    hourStart = `0${hourStart - 1}:00`;
  } else {
    hourStart = `${hourStart - 1}:00`;
  }

  console.log({ entre: hourStart });
  try {
    const activity = await Activity.find({
      date: { $in: [dateInArgentina] },
      $and: [
        { hourStart: { $lte: hourStart } }, // Actividades que han comenzado antes o en este momento
        { hourFinish: { $gt: hourStart } }, // Actividades que aún no han finalizado
      ],
    }).populate({
      path: "users",
    });

    const usersArray = [];

    const userPileta = [];

    activity.map((item) => item.users.map((user) => usersArray.push(user)));

    const piletas = await Pileta.find({}).populate({
      path: "users",
      populate: {
        path: "activity",
      },
    });

    //de la propiedad users de piletas, filtro los usuarios que coincidan con los de usersArray
    piletas.map((item) =>
      item.users.map((user) => {
        userPileta.push(user);
      })
    );

    const sonIguales = (usuario1, usuario2) =>
      usuario1._id.toString() == usuario2._id.toString();

    // Filtrar usuarios únicos en arr1
    const uniqueArr1 = usersArray.filter(
      (user1) => !userPileta.some((user2) => sonIguales(user1, user2))
    );

    //tengo que verificar que el status de los usuarios sea true

    // console.log(uniqueArr1);

    return res.status(200).json({
      status: "success",
      message: "Actividades encontradas",
      users: uniqueArr1,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
