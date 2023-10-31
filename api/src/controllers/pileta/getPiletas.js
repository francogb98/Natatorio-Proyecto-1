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
    const piletas = await Pileta.find({}).populate({
      path: "users",
      populate: {
        path: "activity",
      },
    });

    //accedo a mi dia(primera letra en mayuscula) y hora actual(solo la hora) en español
    const date = new Date();
    const day = date.toLocaleDateString("es-AR", { weekday: "long" });
    const hour = date.getHours();

    //hago que l apirmera letra del dia sea en mayuscula
    const dayCapitalized = day.charAt(0).toUpperCase() + day.slice(1);

    //si no encuentro la pileta 25 la creo
    if (
      !piletas.find(
        (pileta) =>
          pileta.pileta === "pileta 25" ||
          pileta.dia !== dayCapitalized ||
          pileta.hora !== hour
      )
    ) {
      const newpileta25 = new Pileta({
        pileta: "pileta 25",
        users: [],
        dia: dayCapitalized,
        hora: hour,
      });
      await newpileta25.save();
      piletas.push(newpileta25);
    }
    //si no encuentro la pileta 50 la creo
    if (
      !piletas.find(
        (pileta) =>
          pileta.pileta === "pileta 50" &&
          (pileta.dia !== dayCapitalized || pileta.hora !== hour)
      )
    ) {
      const newpileta50 = new Pileta({
        pileta: "pileta 50",
        users: [],
        dia: dayCapitalized,
        hora: hour,
      });
      await newpileta50.save();
      piletas.push(newpileta50);
    }
    //si no encuentro la pileta 100 la creo
    if (
      !piletas.find(
        (pileta) =>
          pileta.pileta === "turnoSiguiente" &&
          (pileta.dia !== dayCapitalized || pileta.hora !== hour)
      )
    ) {
      const newPileta100 = new Pileta({
        pileta: "turnoSiguiente",
        users: [],
        dia: dayCapitalized,
        hora: hour,
      });
      await newPileta100.save();
      piletas.push(newPileta100);
    }

    res.json({ status: "success", piletas });
  } catch (error) {
    res.json({
      ok: false,
      msg: "Error al obtener la informacion de las piletas",
    });
  }
};
