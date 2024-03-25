import User from "../../../models/models/User.js";
import UsuariosFalta from "../../../models/models/UsuariosFaltas.js";

const usuariosParaHabilitar = async ({ adaptada = false, codigo = false }) => {
  let usersSearch = await User.find({
    status: false,
    natacionAdaptada: adaptada,
    activity: { $ne: [], $exists: true },
    "activity[0].codigoDeAcceso": { $in: [null, ""] },
  }).populate({
    path: "activity",

    populate: {
      path: "name",
    },
  });

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
    if (filter === "adaptada") {
      const { users, total } = await usuariosParaHabilitar({
        adaptada: true,
      });
      result = users;
      totalUsers = total;
    }

    if (filter === "certificado") {
      const users = await UsuariosFalta.find({
        motivo: "certificado_expirado",
      }).populate({
        path: "users",
        populate: {
          path: "activity",
        },
      });

      result = users[0].users;
      totalUsers = users[0].users.length;

      return res.status(200).json({
        total: totalUsers,
        totalUsuarios: result.length,
        users: result,
      });
    }
    if (filter === "faltas") {
      const users = await UsuariosFalta.find({
        motivo: "excedio_faltas",
      }).populate({
        path: "users",
        populate: {
          path: "nombre",
        },
      });

      result = users[0].users;
      totalUsers = users[0].users.length;

      return res.status(200).json({
        total: totalUsers,
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
