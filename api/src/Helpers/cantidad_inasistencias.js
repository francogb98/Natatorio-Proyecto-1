import Stadistics from "../models/models/Stadistics.js";
import moment from "moment";

export const cantidad_inasistecias = async (actividad, asistencia) => {
  try {
    const estadistica = await Stadistics.find({
      activity: actividad,
    });

    const allDays = estadistica.reduce((acc, obj) => {
      acc.push(...obj.dias);
      return acc;
    }, []);

    const fechaLimite = moment("21/03/2024", "DD/MM/YYYY");

    const inasistenciasPosteriores = allDays.filter((fecha) => {
      const fechaAsistencia = moment(fecha, "DD/MM/YYYY");
      return (
        !asistencia.includes(fecha) && fechaAsistencia.isAfter(fechaLimite)
      );
    });

    return inasistenciasPosteriores.length;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
