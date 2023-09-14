import Pileta from "../../models/models/Pileta.js";

export const finalizar = async () => {
  //borrar todos los usuarios de ambas piletas
  try {
    await Pileta.deleteMany({});
    return { ok: true, msg: "Se finalizo el turno" };
  } catch (error) {
    console.log(error);
    return { ok: false, msg: "Error al finalizar el turno" };
  }
};
