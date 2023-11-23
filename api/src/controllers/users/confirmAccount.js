import User from "../../models/models/User.js";

import QRCode from "qrcode";

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

    QRCode.toDataURL(user.customId.toString(), user, async function (err, url) {
      if (err) throw err;

      const userUpdate = await User.findOneAndUpdate(
        { email: user.email },
        {
          $set: {
            emailVerified: true,
            emailVerificationToken: null,
            role: "usuario",
            qr: url,
          },
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ status: "success", message: "usuario verificado" });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Error en el Servidor" });
  }
};
