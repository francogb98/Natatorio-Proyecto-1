import Pileta from "../../models/models/Pileta.js";

export const reiniciarPiletaManual = async (req, res) => {
  try {
    const { pileta } = req.body;

    const piletaReset = await Pileta.findOneAndUpdate(
      {
        pileta: pileta,
      },
      { users: [] },
      { new: true }
    );
    return res.status(200).json({ ok: true, piletaReset });
  } catch (error) {
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};
