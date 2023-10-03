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

export const addUser = async ({ user }) => {
  try {
    //verificar que no haya niguna pileta creada, si la hay, vverifico que el hoario sea igual al que me pasan por args
    const piletaExist = await Pileta.findOne();

    if (piletaExist) {
      if (
        piletaExist.hourStart !== user.activity[0].hourStart ||
        piletaExist.hourFinish !== user.activity[0].hourFinish
      ) {
        return {
          ok: false,
          msg: "El usuario no esta registrado en este horario",
        };
      }
    }
    //verifico si la pileta ya existe en mi bdd si no la creo
    const { pileta: piletaActivity } = user.activity[0];
    const pileta = await Pileta.findOne({
      pileta: piletaActivity,
    }).populate({
      path: "users",
      populate: {
        path: "customId",
      },
    });

    const dateNow = new Date();
    const day = dateNow.getDate();
    const month = dateNow.getMonth() + 1;
    const year = dateNow.getFullYear();

    const dateNowSave = `${day}/${month}/${year}`;
    if (!pileta) {
      const newPileta = new Pileta({
        pileta: piletaActivity,
        hourStart: user.activity[0].hourStart,
        hourFinish: user.activity[0].hourFinish,
      });
      await newPileta.save();
      newPileta.users.push(user);
      await newPileta.save();
      const result = await Pileta.findOne({ pileta: piletaActivity }).populate({
        path: "users",
        populate: {
          path: "activity",
        },
      });
      //buscamos el ususario en la BDD y actualizamos la asistencia

      User.findByIdAndUpdate(user._id, { asistencia: dateNowSave });

      // await updateStadistics({ user, dateNowSave });

      return { ok: true, result };
    }

    // si todo es correcto verifico que el usuario no este en la lista de usuarios de la pileta
    // const userInPileta = pileta.users.find((u) => u.customId == user.customId);

    // if (userInPileta) {
    //   return {
    //     ok: false,
    //     msg: "El usuario " + user.nombre + " ya esta en la lista",
    //     user,
    //   };
    // }
    // si no esta lo agrego a la lista de usuarios de la pileta
    pileta.users.push(user);
    await pileta.save();

    const result = await Pileta.findOne({ pileta: piletaActivity }).populate({
      path: "users",
      populate: {
        path: "activity",
      },
    });

    //accedemos a la fecha actual y actualizamos el campo de asistencia del usuario con dicho valor
    User.findByIdAndUpdate(user._id, { asistencia: dateNowSave });

    // await updateStadistics({ user, dateNowSave });

    return { ok: true, result };

    // si es asi lo agregamos a la lista de usuarios de la pileta
  } catch (error) {
    console.log(error.message);
    return { ok: false, msg: "Error en el servidor" };
  }
};
