import Pileta from "../../models/models/Pileta.js";
import User from "../../models/models/User.js";

export const crearPileta = async (fecha, hora, nombrePileta) => {
  const data = await Pileta.find({
    pileta: nombrePileta,
    dia: fecha,
    hora: hora,
  });
  if (data.length) {
    console.log("no se creo pileta");
    return { pileta: data, status: "ok" };
  }

  const pileta = new Pileta({
    pileta: nombrePileta,
    dia: fecha,
    hora: hora,
  });
  await pileta.save();

  console.log("Pileta creada con exito!");

  return { pileta, status: "ok" };
};

function obtenerFechaYHoraArgentina() {
  let dated = new Date();
  let argentinaTime = dated.toLocaleString("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
  });

  let horaActual = new Date(argentinaTime).getHours();
  let hora = horaActual;
  let horaAnterior = hora - 1;
  if (hora.toString().length === 1) {
    hora = `0${hora}:00`;
  } else {
    hora = `${hora}:00`;
  }

  if (horaAnterior.toString().length === 1) {
    horaAnterior = `0${horaAnterior}:00`;
  } else {
    horaAnterior = `${horaAnterior}:00`;
  }

  let today = new Date();
  today.setUTCHours(today.getUTCHours() - 3); // Ajuste para la zona horaria de Argentina (UTC-3)

  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); // Enero es 0!
  let yyyy = today.getFullYear();

  const fecha = `${dd}/${mm}/${yyyy}`;

  return { hora, fecha, horaAnterior, horaActual };
}

export const getInfoPiletasPrueba = async (req, res) => {
  try {
    const { hora, fecha, horaActual } = obtenerFechaYHoraArgentina();

    const piletas = ["pileta 25", "pileta 50", "turnoSiguiente"];

    // if (fecha === "Sábado" || fecha === "Domingo") {
    //   return res
    //     .status(400)
    //     .json("No se puede realizar la operación los fines de semana");
    // }

    // if (horaActual < 8 || horaActual > 21) {
    //   return res
    //     .status(400)
    //     .json("No se puede realizar la operación en este horario");
    // }

    const resultado = await Promise.all(
      piletas.map((pileta) => {
        return crearPileta(fecha, hora, pileta);
      })
    );

    return res.status(200).json(resultado);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Hable con el administrador",
    });
  }
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
    console.log(error);
    return res.status(500).json({
      message: "Hable con el administrador",
    });
  }
};

const intercambioDeUsuarios = async () => {
  const { hora, fecha, horaAnterior } = obtenerFechaYHoraArgentina();

  console.log(horaAnterior, fecha);

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
