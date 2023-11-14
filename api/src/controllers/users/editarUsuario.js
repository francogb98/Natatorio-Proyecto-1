import User from "../../models/models/User.js";

export default async (req, res) => {
  const {
    _id,
    nombre,
    apellido,
    dni,
    barrio,
    natacionAdaptada,
    dniTutor,
    nombreTutor,
    apellidoTutor,
    telefono,
    telefonoContacto,
  } = req.body;

  console.log(req.body);
  try {
    //busco el usuario por su id

    let user = await User.findById(_id);

    if (dni !== user.dni) {
      const isUserExist = await User.findOne({ dni });
      if (isUserExist) {
        return res.status(400).json({
          status: "error",
          message: "Usuario con este dni ya existe",
        });
      }
    }

    user.dni = dni;
    user.nombre = nombre;
    user.apellido = apellido;
    user.barrio = barrio;
    user.natacionAdaptada = natacionAdaptada;
    user.dniTutor = dniTutor;
    user.nombreTutor = nombreTutor;
    user.apellidoTutor = apellidoTutor;
    user.telefono = telefono;
    user.telefonoContacto = telefonoContacto;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Usuario actualizado con exito",
      user,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: "error", message: "No se pudo editar el usuario" });
  }
};
