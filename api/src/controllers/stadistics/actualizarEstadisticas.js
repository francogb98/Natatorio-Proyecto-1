import Stadistics from "../../models/models/Stadistics.js";

export const actualizarEstadisticas = async (args) => {
  try {
    const { mes, year, activity } = args;

    const stadistics = await Stadistics.findOne({ mes, year, activity });

    if (stadistics) {
      stadistics.usersQuantity = stadistics.usersQuantity + 1;
      await stadistics.save();
      return { ok: true, stadistics };
    } else {
      const newStadistics = new Stadistics({
        usersQuantity: 1,
        mes,
        year,
        activity,
      });
      await newStadistics.save();
      return { ok: true, stadistics: newStadistics };
    }
  } catch (error) {
    return { ok: false, message: error.message };
  }
};
