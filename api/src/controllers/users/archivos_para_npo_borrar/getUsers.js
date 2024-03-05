import User from "../../../models/models/User.js";

const usuariosParaHabilitar = async ({ page, adaptada = false }) => {
  const limit = 20;
  const skip = (page - 1) * limit;

  let users = await User.find({
    status: false,
    natacionAdaptada: adaptada,
    activity: { $ne: [], $exists: true },
  })
    .populate({
      path: "activity",
      populate: {
        path: "name",
      },
    })
    .skip(skip)
    .limit(limit);

  users.sort((a, b) => {
    const nameA = a.activity[0].name.toLowerCase();
    const nameB = b.activity[0].name.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const totalUsers = await User.find({
    status: false,
    natacionAdaptada: adaptada,
    activity: { $ne: [], $exists: true },
  }).select("_id"); // Para obtener una estimación del número de documentos (puede ser menos preciso pero más rápido)

  return { users, total: totalUsers.length };
};

const todosLosUsuarios = async (page) => {
  const limit = 50;
  const skip = (page - 1) * limit;

  let users = await User.find()
    .populate({
      path: "activity",
      populate: {
        path: "name",
      },
    })
    .skip(skip)
    .limit(limit);

  const totalUsers = await User.countDocuments(); // Para obtener una estimación del número de documentos (puede ser menos preciso pero más rápido)

  return { users, total: totalUsers };
};

export const getUsers = async (req, res) => {
  try {
    const { filter, page } = req.params;

    let result = [];
    let totalUsers = 0;
    if (filter === "habilitar") {
      const { users, total } = await usuariosParaHabilitar({ page });
      result = users;
      totalUsers = total;
    }
    if (filter === "habilitarAdaptada") {
      const { users, total } = await usuariosParaHabilitar({
        page,
        adaptada: true,
      });
      result = users;
      totalUsers = total;
    }
    if (filter === "todos") {
      const { users, total } = await todosLosUsuarios(page);
      result = users;
      totalUsers = total;
    }

    if (!result.length) {
      return res.status(200).json({
        message: "No se encontraron usuarios",
      });
    }

    return res.status(200).json({
      pagina: page,
      total: totalUsers,
      totalUsuarios: result.length,
      users: result,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: "error en el servidor" });
  }
};
