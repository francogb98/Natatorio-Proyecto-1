import Pileta from "../../models/models/Pileta.js";

export const getInfoPiletas = async (req, res) => {
  try {
    const piletas = await Pileta.find({}).populate({
      path: "users",
      populate: {
        path: "activity",
      },
    });
    res.json({ ok: true, piletas });
  } catch (error) {
    res.json({
      ok: false,
      msg: "Error al obtener la informacion de las piletas",
    });
  }
};

export const getPiletasOrCreate = async (req, res) => {
  try {
    //accedo a mi dia(primera letra en mayuscula) y hora actual(solo la hora) en español
    const date = new Date();
    const day = date.toLocaleDateString("es-AR", { weekday: "long" });
    // const hour = date.getHours();

    let argentinaTime = date.toLocaleString("en-US", {
      timeZone: "America/Argentina/Buenos_Aires",
    });
    let horaActual = new Date(argentinaTime).getHours();

    horaActual = horaActual.toString();
    if (horaActual.length == 1) {
      horaActual = "0" + horaActual;
    }
    let hour = horaActual + ":00";

    //hago que l apirmera letra del dia sea en mayuscula
    const dayCapitalized = day.charAt(0).toUpperCase() + day.slice(1);

    const piletas = await Pileta.find({}).populate({
      path: "users",
      populate: {
        path: "activity",
      },
    });

    //si no encuentro la pileta 25 la creo
    if (!piletas.find((pileta) => pileta.pileta === "pileta 25")) {
      const newpileta25 = new Pileta({
        pileta: "pileta 25",
        users: [],
        dia: dayCapitalized,
        hora: hour,
      });
      await newpileta25.save();
      piletas.push(newpileta25);
    } else if (
      //si encuentro pileta de 25 pero su dia o hora son distintos lo actualizo
      piletas.find(
        (pileta) =>
          pileta.pileta === "pileta 25" &&
          (pileta.dia !== dayCapitalized || pileta.hora !== hour)
      )
    ) {
      const pileta25 = await Pileta.findOne({
        pileta: "pileta 25",
      });
      pileta25.users = [];
      pileta25.dia = dayCapitalized;
      pileta25.hora = hour;
      await pileta25.save();
    }

    if (!piletas.find((pileta) => pileta.pileta === "pileta 50")) {
      const newpileta50 = new Pileta({
        pileta: "pileta 50",
        users: [],
        dia: dayCapitalized,
        hora: hour,
      });
      await newpileta50.save();
      piletas.push(newpileta50);
    } else if (
      //si encuentro pileta de 25 pero su dia o hora son distintos lo actualizo
      piletas.find(
        (pileta) =>
          pileta.pileta === "pileta 50" &&
          (pileta.dia !== dayCapitalized || pileta.hora !== hour)
      )
    ) {
      const pileta50 = await Pileta.findOne({
        pileta: "pileta 50",
      });
      pileta50.users = [];
      pileta50.dia = dayCapitalized;
      pileta50.hora = hour;
      await pileta50.save();
    }
    if (!piletas.find((pileta) => pileta.pileta === "turnoSiguiente")) {
      const turnoSiguiente = new Pileta({
        pileta: "turnoSiguiente",
        users: [],
        dia: dayCapitalized,
        hora: hour,
      });
      await turnoSiguiente.save();
      piletas.push(turnoSiguiente);
    } else if (
      //si encuentro pileta de 25 pero su dia o hora son distintos lo actualizo
      piletas.find(
        (pileta) =>
          pileta.pileta === "turnoSiguiente" &&
          (pileta.dia !== dayCapitalized || pileta.hora !== hour)
      )
    ) {
      const turnoSiguiente = await Pileta.findOne({
        pileta: "turnoSiguiente",
      });
      turnoSiguiente.users = [];
      turnoSiguiente.dia = dayCapitalized;
      turnoSiguiente.hora = hour;
      await turnoSiguiente.save();
    }

    res.json({ status: "success", piletas });
  } catch (error) {
    res.json({
      ok: false,
      msg: "Error al obtener la informacion de las piletas",
    });
  }
};
