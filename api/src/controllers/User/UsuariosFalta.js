import { User, UsuariosFalta } from "../../models/index.js";
import { RevisionArchivosEstado } from "./models/index.js";

const usuariosParaHabilitar = async ({ adaptada = false, codigo = false }) => {
  let usersSearch = await User.find({
    status: false,
    natacionAdaptada: adaptada,
    activity: { $ne: [], $exists: true },
    "activity[0].codigoDeAcceso": { $in: [null, ""] },
  })
    .populate({
      path: "activity",

      populate: {
        path: "name",
      },
    })
    .sort({ "activity[0].name": 1 });

  let users = [];

  for (let user of usersSearch) {
    if (
      user.activity.length > 0 &&
      (!user.activity[0].codigoDeAcceso ||
        user.activity[0].codigoDeAcceso === "" ||
        user.activity[0].codigoDeAcceso === null)
    ) {
      // The first element in the activity array does not have a codigoDeAcceso field
      // or it is null or an empty string.
      // Do something here.
      users.push(user);
    }
  }

  users.sort((a, b) => {
    const nameA = a.activity[0].name.toLowerCase();
    const nameB = b.activity[0].name.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return {
    users: !codigo ? usersSearch : users,
    total: !codigo ? usersSearch.length : users.length,
  };
};

function calcular_fecha(fecha_carga) {
  // Convertir la cadena de fecha en un objeto de fecha
  var partesFecha = fecha_carga.split("/");
  var fecha = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
  var fechaFin = new Date().getTime();
  var diff = fechaFin - fecha;
  var diasPasadoss = Math.floor(diff / (1000 * 60 * 60 * 24));

  return diasPasadoss;
}

export const getUsers = async (req, res) => {
  try {
    const { filter } = req.params;

    let result = [];
    let totalUsers = 0;
    if (filter === "todos") {
      const { users, total } = await usuariosParaHabilitar({
        adaptada: false,
        codigo: false,
      });
      result = users;
      totalUsers = total;
    }
    if (filter === "convencional") {
      const { users, total } = await usuariosParaHabilitar({
        adaptada: false,
        codigo: true,
      });
      result = users;
      totalUsers = total;
    }

    if (filter === "revision") {
      const users = await User.find({
        revisionArchivo: RevisionArchivosEstado.REVISAR,
      }).populate({
        path: "activity",
      });

      result = users;

      totalUsers = users.length;
    }

    if (filter === "adaptada") {
      const { users, total } = await usuariosParaHabilitar({
        adaptada: true,
      });
      result = users;
      totalUsers = total;
    }

    if (filter === "certificado") {
      const users = await UsuariosFalta.findOne({
        motivo: "certificado_expirado",
      }).populate({
        path: "users",
        select:
          "nombre apellido _id customId certificadoHongos fechaCargaCertificadoHongos foto fichaMedica dni", // Campos del usuario
        populate: {
          path: "activity",
        },
      });

      let result2 = users.users.filter((user) => {
        return calcular_fecha(user.fechaCargaCertificadoHongos) > 45;
      });

      result2 = result2.filter((user) => {
        return Array.isArray(user.activity) && user.activity.length > 0;
      });
      users.users = result2;
      await users.save();

      result = users.users;

      return res.status(200).json({
        total: 15,
        totalUsuarios: result.length,
        users: result,
      });
    }

    if (!result.length) {
      return res.status(200).json({
        message: "No se encontraron usuarios",
      });
    }
    return res.status(200).json({
      total: totalUsers,
      totalUsuarios: result.length,
      users: result,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: "error en el servidor" });
  }
};
