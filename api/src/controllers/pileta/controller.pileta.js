import Pileta from "../../models/models/Pileta.js";
import User from "../../models/models/User.js";

import { obtenerFechaYHoraArgentina } from "../../Helpers/traerInfoDelDia.js";

const crearPileta = async (fecha, hora, nombrePileta) => {
  const data = await Pileta.find({
    pileta: nombrePileta,
    dia: fecha,
    hora: hora,
  });
  if (data.length) {
    return { pileta: data, status: "ok" };
  }

  const pileta = new Pileta({
    pileta: nombrePileta,
    dia: fecha,
    hora: hora,
  });
  await pileta.save();

  return { pileta, status: "ok" };
};

const agregarUsuario = async ({
  customId,
  nombre,
  actividad,
  pileta,
  horarioSalida,
  piletaTurnoSiguiente,
}) => {
  const { hora, fecha } = obtenerFechaYHoraArgentina();
  const piletaExist = await Pileta.findOneAndUpdate(
    {
      pileta: pileta,
      dia: fecha,
      hora: hora,
      "users.customid": { $ne: customId }, // Asegura que el usuario no esté en la lista ya
    },
    {
      $addToSet: {
        // Utiliza $addToSet en lugar de $push
        users: {
          customid: customId,
          nombre: nombre,
          actividad: actividad,
          horarioSalida: horarioSalida,
          piletaTurnoSiguiente: piletaTurnoSiguiente,
        },
      },
    },
    {
      new: true,
    }
  );

  return {
    pileta: piletaExist,
    status: "success",
  };
};

const asistenciaUsuario = async (customId) => {
  const { fecha } = obtenerFechaYHoraArgentina();
  const user = await User.findOneAndUpdate(
    { customId: customId },
    { asistencia: fecha },
    { new: true }
  );

  return {
    status: "success",
  };
};

const intercambioDeUsuarios = async () => {
  const { hora, fecha, horaAnterior } = obtenerFechaYHoraArgentina();

  const piletasAnterior = await Pileta.find({ dia: fecha, hora: horaAnterior });

  //verifico todos los usuarios de las piletas anteriores, en caso de que su horario de salida sea mayor que la hora actual los agrego a las pieltas del turno actual
  const resultado = await Promise.all(
    piletasAnterior.map(async (pileta) => {
      return await Promise.all(
        pileta.users.map(async (user) => {
          if (user.horarioSalida > hora) {
            const resultado = await agregarUsuario({
              customId: user.customid,
              nombre: user.nombre,
              actividad: user.actividad,
              pileta:
                pileta.pileta === "turnoSiguiente"
                  ? user.piletaTurnoSiguiente
                  : pileta.pileta,
              horarioSalida: user.horarioSalida,
            });
            if (resultado.status === "error") {
              return resultado.message;
            }
          }
        })
      );
    })
  );
};

export const cambiarTurno = async (req, res) => {
  //verifico que no exitan piletas en este horario, si existen devuelvo un mensaje de error de que todavia no es hora para ejecutar el cambio de turno
  const { hora, fecha } = obtenerFechaYHoraArgentina();
  const piletas = ["pileta 25", "pileta 50", "turnoSiguiente"];

  const resultado = await Promise.all(
    piletas.map((pileta) => {
      return crearPileta(fecha, hora, pileta);
    })
  );

  // if (resultado[0].pileta.length) {
  //   return res.status(400).json("Todavia no es hora de cambiar el turno");
  // }
  //ejecuto el cambio de turno
  const resultadoCambio = await intercambioDeUsuarios();

  return res.status(200).json({
    status: "ok",
    message: "Horario cambiado con exito!",
  });
};

export const agregarUsuarioAPiletaPrueba = async (req, res) => {
  const {
    customId,
    nombre,
    actividad,
    pileta,
    horarioSalida,
    piletaTurnoSiguiente,
  } = req.body;
  try {
    const resultado = await agregarUsuario({
      customId,
      nombre,
      actividad,
      pileta,
      horarioSalida,
      piletaTurnoSiguiente,
    });

    if (resultado.status === "error") {
      return res.status(400).json(resultado.message);
    }
    //actualizar el campo de asistenciia del usuario
    const resultadoAsistencia = await asistenciaUsuario(customId);
    if (resultadoAsistencia.status === "error") {
      return res.status(400).json(resultadoAsistencia.message);
    }
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      message: "Hable con el administrador",
    });
  }
};

export const getInfoPiletasPrueba = async (req, res) => {
  try {
    const { hora, fecha, horaActual } = obtenerFechaYHoraArgentina();

    const piletas = ["pileta 25", "pileta 50", "turnoSiguiente"];

    if (fecha === "Sábado" || fecha === "Domingo") {
      return res
        .status(400)
        .json("No se puede realizar la operación los fines de semana");
    }

    if (horaActual < 7 || horaActual > 21) {
      return res
        .status(400)
        .json("No se puede realizar la operación en este horario");
    }

    const resultado = await Promise.all(
      piletas.map((pileta) => {
        return crearPileta(fecha, hora, pileta);
      })
    );

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      message: "Hable con el administrador",
    });
  }
};

export const eliminarUsuarioDePileta = async (req, res) => {
  const { customid } = req.body;

  const { hora, fecha, horaActual } = obtenerFechaYHoraArgentina();

  try {
    const [pileta] = await Pileta.find({
      dia: fecha,
      hora: hora,
      "users.customid": customid,
    });

    console.log(pileta);
    pileta.users = pileta.users.filter((user) => user.customid !== customid);

    await pileta.save();

    console.log(pileta);
    return res
      .status(200)
      .json({
        status: "success",
        pileta,
        message: "Usuario eliminado de la pileta",
      });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      message: "Error en el servidor, hable con el administrador",
    });
  }
};
