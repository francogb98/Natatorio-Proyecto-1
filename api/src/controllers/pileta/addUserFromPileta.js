import User from "../../models/models/User.js";
import Pileta from "../../models/models/Pileta.js";

export const addUser = async ({ args }) => {
  const { hourStart, hourFinish, date, idUser } = args;

  // buscamos al usuario en la base de datos

  try {
    const user = await User.findOne({ customId: idUser }).populate({
      path: "activity",
      populate: {
        path: "pileta",
      },
    });

    if (!user) {
      return { ok: false, msg: "El usuario no existe" };
    }

    // si existe verifcamos que el horario y el dia sean iguales a los de los arg
    if (user.activity.length === 0) {
      return {
        ok: false,
        msg: "El usuario no esta registrado en ninguna actividad",
        user,
      };
    }

    if (
      user.activity[0].hourStart !== hourStart ||
      user.activity[0].hourFinish !== hourFinish
    ) {
      return {
        ok: false,
        msg: "El usuario no esta registrado en este horario",
        user,
      };
    }

    // como date es un array busco si esta incluido el dia que me pasan por arg
    const dateActivity = user.activity[0].date.includes(date);
    if (!dateActivity) {
      return {
        ok: false,
        msg: "El usuario no esta registrado en esta actividad",
      };
    }
    //verifico si la pileta ya existe en mi bdd si no la creo
    const { pileta: piletaActivity } = user.activity[0];
    const pileta = await Pileta.findOne({ pileta: piletaActivity }).populate({
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
      const newPileta = new Pileta({ pileta: piletaActivity });
      await newPileta.save();
      newPileta.users.push(user);
      await newPileta.save();
      const result = await Pileta.findOne({ pileta: piletaActivity }).populate({
        path: "users",
        populate: {
          path: "activity",
        },
      });

      //accedemos a la fecha actual y actualizamos el campo de asistencia del usuario con dicho valor

      user.asistencia = dateNowSave;
      await user.save();

      return { ok: true, result };
    }

    // si todo es correcto verifico que el usuario no este en la lista de usuarios de la pileta
    const userInPileta = pileta.users.find((u) => u.customId == idUser);

    if (userInPileta) {
      return { ok: false, msg: "El usuario ya esta en la lista", user };
    }
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
    user.asistencia = dateNowSave;
    await user.save();

    return { ok: true, result };

    // si es asi lo agregamos a la lista de usuarios de la pileta
  } catch (error) {
    console.log(error);
    return { ok: false, msg: "Error en el servidor" };
  }
};
