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
    //si no encuentro la pileta 25 la creo
    if (!piletas.find((pileta) => pileta.pileta === "pileta 25")) {
      const newpileta25 = new Pileta({
        pileta: "pileta 25",
        users: [],
      });
      await newpileta25.save();
      piletas.push(newpileta25);
    }
    //si no encuentro la pileta 50 la creo
    if (!piletas.find((pileta) => pileta.pileta === "pileta 50")) {
      const newpileta50 = new Pileta({
        pileta: "pileta 50",
        users: [],
      });
      await newpileta50.save();
      piletas.push(newpileta50);
    }
    //si no encuentro la pileta 100 la creo
    if (!piletas.find((pileta) => pileta.pileta === "turnoSiguiente")) {
      const newPileta100 = new Pileta({
        pileta: "turnoSiguiente",
        users: [],
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
