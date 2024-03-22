import Pileta from "../../models/models/Pileta.js";
import User from "../../models/models/User.js";
import Stadistics from "../../models/models/Stadistics.js";

import { obtenerFechaYHoraArgentina } from "../../Helpers/traerInfoDelDia.js";

import { agregarUsuario } from "./utilidades/agegarUsuario.js";
import { intercambioDeUsuarios } from "./utilidades/intercambiarUsuariosTurno.js";
import { crearPileta } from "./utilidades/crearPileta.js";
import { verificacionEstadoUsuarios } from "./utilidades/estadoUsuario.js";

const actualizarEstadistica = async (user) => {
  try {
    const { mesNombre, fecha } = obtenerFechaYHoraArgentina();
    // Buscar la estadística para la actividad y el mes correspondiente
    const estadisticaExistente = await Stadistics.findOne({
      activity: user.activity[0]._id,
      mes: mesNombre,
    });

    if (!estadisticaExistente) {
      // Si no existe una estadística para la actividad y el mes, crear una nueva
      const nuevaEstadistica = new Stadistics({
        usersQuantity: 1,
        dias: [fecha], // Asegúrate de guardar la fecha como un array si esperas múltiples fechas
        mes: mesNombre,
        activity: user.activity[0]._id,
      });
      await nuevaEstadistica.save();
    } else {
      // Si ya existe una estadística para la actividad y el mes, actualizarla
      estadisticaExistente.usersQuantity += 1;

      if (!estadisticaExistente.dias.includes(fecha)) {
        estadisticaExistente.dias.push(fecha); // Asegúrate de guardar la fecha como un array si esperas múltiples fechas
      }
      await estadisticaExistente.save();

      console.log(estadisticaExistente);
    }

    return { status: "success" };
  } catch (error) {
    console.error("Error al actualizar la estadística:", error.message);
    return { status: "error", message: "Ocurrió un error" };
  }
};

const asistenciaUsuario = async (customId, fecha) => {
  try {
    const user = await User.findOneAndUpdate(
      { customId: customId },
      {
        $addToSet: {
          asistencia: fecha,
        },
        $unset: {
          inasistencias: "", // Puedes poner cualquier valor en blanco aquí
        },
      },
      { new: true }
    );
    return {
      status: "success",
      user,
    };
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error" });
  }
};

export const iniciarTurno = async (req, res) => {
  try {
    //verifico que no exitan piletas en este horario, si existen devuelvo un mensaje de error de que todavia no es hora para ejecutar el cambio de turno
    const { hora, fecha } = obtenerFechaYHoraArgentina();

    const resultado = await Pileta.find({
      dia: fecha,
      hora: hora,
    });

    if (resultado.length) {
      return res.status(400).json({
        status: "error",
        message: "Todavia no es hora de cambiar el turno",
      });
    }

    const crear = await crearPileta();
    if (crear.status == "error") {
      return res
        .status(400)
        .json({ status: "error", message: "error en el servidor" });
    }

    //ejecuto el cambio de turn
    const resultadoCambio = await intercambioDeUsuarios();

    const result = await verificacionEstadoUsuarios();

    if (!result) {
      return res
        .status(400)
        .json({ status: "error", message: "error en el servidor" });
    }

    return res.status(200).json({
      status: "ok",
      message: "Horario cambiado con exito!,",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(400)
      .json({ status: "error", message: "error en el servidor" });
  }
};

export const agregarUsuarioAPileta = async (req, res) => {
  const { customId, nombre, actividad, pileta, horarioIngreso, horarioSalida } =
    req.body;
  try {
    const { hora, fecha } = obtenerFechaYHoraArgentina();
    let [horaActual] = hora.split(":");
    let [horaIngresoActual] = horarioIngreso.split(":");

    if (horaIngresoActual - horaActual >= 2) {
      return res.status(400).json({
        status: "error",
        message: "El usuario todavia no esta en horario de ser registrado",
      });
    }

    const resultadoPileta = await Pileta.find({
      dia: fecha,
      hora: hora,
    });

    if (!resultadoPileta.length) {
      return res.status(400).json({
        status: "error",
        message: "Iniciar nuevo turno",
      });
    }

    const resultado = await agregarUsuario({
      customId,
      nombre,
      actividad,
      pileta,
      horarioIngreso,
      horarioSalida,
    });

    if (resultado.status === "error") {
      return res
        .status(400)
        .json({ status: "error", message: resultado.message });
    }
    //actualizar el campo de asistenciia del usuario

    const resultadoAsistencia = await asistenciaUsuario(customId, fecha);
    if (resultadoAsistencia.status === "error") {
      return res
        .status(400)
        .json({ status: "error", message: resultado.message });
    }

    //actualizo la estadistica
    await actualizarEstadistica(resultadoAsistencia.user);

    return res.status(200).json({ status: "success", resultado });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Hable con el administrador",
    });
  }
};

export const getInfoPiletasPrueba = async (req, res) => {
  try {
    const { hora, fecha, horaActual } = obtenerFechaYHoraArgentina();
    const piletas = await Pileta.find({
      dia: fecha,
      hora: hora,
    });

    return res.status(200).json({ resultado: piletas });
  } catch (error) {
    console.log(error.message);

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
    return res.status(200).json({
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

export const obtener_pileta = async (req, res) => {
  try {
    const { dia, hora } = req.body;
    console.log(dia, hora);
    const pileta = await Pileta.find({
      dia,
      hora,
    });

    console.log(pileta);

    if (!pileta.length) {
      return res
        .status(401)
        .json({ status: "error", msg: "pileta no encontrada" });
    }

    return res.status(200).json({ status: "success", pileta });
  } catch (error) {
    console.log(error.message);
  }
};

export const cambio_forzado = async (req, res) => {
  try {
    const { dia, hora, horaActual } = req.body;

    const pileta = await Pileta.find({
      dia,
      hora,
    });
    const piletaAhora = await Pileta.find({
      dia,
      hora: horaActual,
    });

    const resultado = await Promise.all(
      pileta.map(async (pileta) => {
        return await Promise.all(
          pileta.users.map(async (user) => {
            let [horaActualX] = horaActual.split(":");
            let [horarioSalidaNumero] = user.horarioSalida.split(":");
            // verificamos que el horario de salida, sea mayor al horario actual
            if (horarioSalidaNumero > horaActualX) {
              const resultado = await agregarUsuario({
                customId: user.customid,
                nombre: user.nombre,
                actividad: user.actividad,
                pileta: user.pileta,
                horarioSalida: user.horarioSalida,
                horarioIngreso: user.horarioIngreso ?? horaActual,
              });
              if (resultado.status === "error") {
                return resultado.message;
              }
            }
          })
        );
      })
    );

    return res.status(200).json({ pileta });
  } catch (error) {
    return res.status(200).json({ msg: error.message });
  }
};
