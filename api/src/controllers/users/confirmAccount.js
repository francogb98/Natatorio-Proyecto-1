import User from "../../models/models/User.js";

export const confirmAccount = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "token no valido" });
    }
    if (user.emailVerified) {
      return res
        .status(400)
        .json({ status: "error", message: "usuario ya verificado" });
    }

    const userUpdate = await User.findOneAndUpdate(
      { dni: user.dni },
      {
        $set: {
          emailVerified: true,
          emailVerificationToken: null,
          role: "usuario",
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ status: "success", message: "usuario verificado", userUpdate });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error en el Servidor" });
  }
};
