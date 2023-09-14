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
    console.log(error);
    res.json({
      ok: false,
      msg: "Error al obtener la informacion de las piletas",
    });
  }
};
