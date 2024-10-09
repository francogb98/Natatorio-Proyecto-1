import { Stadistic } from "../models/index.js";
import moment from "moment";

import { obtenerFechaYHoraArgentina } from "./traerInfoDelDia.js";

export const cantidad_inasistecias = async (actividad, asistencia) => {
  const { fecha } = obtenerFechaYHoraArgentina();

  try {
    const estadistica = await Stadistic.find({
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

    return inasistenciasPosteriores.includes(fecha)
      ? inasistenciasPosteriores.length - 1
      : inasistenciasPosteriores.length;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
