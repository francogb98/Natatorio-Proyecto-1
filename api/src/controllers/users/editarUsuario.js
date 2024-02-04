import User from "../../models/models/User.js";

export default async (req, res) => {
  const {
    _id,
    nombre,
    apellido,
    dni,
    barrio,
    ciudad,
    natacionAdaptada,
    telefono,
    telefonoContacto,
    edad,
  } = req.body;

  req.body;
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
    user.edad = edad;
    user.nombre = nombre;
    user.apellido = apellido;
    user.ciudad = ciudad;
    user.barrio = barrio;
    user.natacionAdaptada = natacionAdaptada;
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
