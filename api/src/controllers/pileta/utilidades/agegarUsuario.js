import { obtenerFechaYHoraArgentina } from "../../../Helpers/traerInfoDelDia.js";
import { Pileta, User } from "../../../models/index.js"; // Assuming your model import is correct

export const agregarUsuario = async ({
  customId,
  pileta,
  horaIngresoUsuario,
}) => {
  try {
    const user = await User.findOne({ customId });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    console.log(horaIngresoUsuario);

    const { hora, fecha } = obtenerFechaYHoraArgentina();

    // Si la hora de ingreso del usuario es mayor a la hora actual, cambiamos el valor de "pileta"
    if (horaIngresoUsuario > hora) {
      pileta = "turnoSiguiente";
    }

    const resultado = await Pileta.findOneAndUpdate(
      {
        dia: fecha,
        hora: hora,
        pileta: pileta,
      },
      {
        $addToSet: {
          users: user._id, // Add user ObjectId instead of user data directly
        },
      },
      { new: true }
    );

    if (!resultado) {
      throw new Error("No se pudo actualizar la pileta");
    }
    console.log(resultado);

    return { status: "success", pileta: resultado };
  } catch (error) {
    console.error(error.message);
    return { status: "error", message: error.message };
  }
};
