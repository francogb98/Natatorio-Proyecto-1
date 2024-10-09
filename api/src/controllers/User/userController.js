import { Activity, User } from "../../models/index.js";
import jwt from "jsonwebtoken";

export class userController {
  static getUser = async (req, res) => {
    try {
      const { token } = req.params;

      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById({ _id: id }).populate({
        path: "activity",
        populate: {
          path: "name",
        },
      });

      if (!user.activity) {
        user.activity = [];
      }

      res.status(200).json({ status: "success", user });
    } catch (error) {
      res.status(404).json({ status: "error", message: error.message });
    }
  };

  static getUserById = async (req, res) => {
    try {
      const { id, type } = req.params;
      // Crear el objeto de consulta
      const query = { [type]: id }; // Usar notación de corchetes para crear el objeto de consulta
      console.log(query);
      const users = await User.find(query).populate({
        path: "activity",
        populate: {
          path: "name",
        },
      });

      if (!users) {
        return res
          .status(404)
          .json({ status: "error", message: "Usuario no encontrado" });
      }

      res.status(200).json({ status: "success", users });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: "error", message: "Error en el servidor" });
    }
  };

  static getUserByLastName = async (req, res) => {
    try {
      const { apellido } = req.params;
      const users = await User.find({
        apellido: {
          $regex: new RegExp(apellido, "i"), // 'i' indica insensibilidad a mayúsculas y minúsculas
        },
      }).populate({
        path: "activity",
        populate: {
          path: "name",
        },
      });
      if (!users.length) {
        return res.status(200).json({
          status: "error",
          message: "no se encontraron usuarios con el apellido: " + apellido,
        });
      }
      return res.status(200).json({ status: "success", users });
    } catch (error) {
      console.log(error.message);
      return res
        .status(400)
        .json({ status: "error", message: "error en el servidor" });
    }
  };

  static solicitudDeInscripcion = async (req, res) => {
    const { idActividad } = req.body;

    try {
      const user = await User.findOne({
        _id: req.user.id,
      }).populate({
        path: "activity",
        populate: {
          path: "name",
        },
      });
      const isActivityExist = await Activity.findById({
        _id: idActividad,
      });

      if (!isActivityExist) {
        return res.status(400).json({
          status: "error",
          message: "La actividad seleccionada no existe",
        });
      }
      //verificamos si hay cupo
      if (isActivityExist.users.length >= isActivityExist.cupos) {
        return res.status(400).json({
          status: "error",
          message: "Cupos agotados",
        });
      }

      if (!user.activity) {
        user.activity = [];
      }

      //si la actividad seleccionada no tiene codigo de acceso verifico que el usuario no este registrado en una actividad con codigo de acceso
      if (!isActivityExist.codigoDeAcceso) {
        for (let i = 0; i < user.activity.length; i++) {
          const actividad = user.activity[i];
          if (!actividad.codigoDeAcceso) {
            return res.status(400).json({
              status: "error",
              message:
                "Usuario ya inscripto en una actividad, por favor dar de baja la actividad actual para poder inscribirse en una nueva.",
            });
          }
        }
      }

      if (
        isActivityExist.users.includes(user._id) &&
        isActivityExist.codigoDeAcceso
      ) {
        console.log("entre aqui 312");
        return res.status(200).json({
          status: "success",
          message: "Usuario agregado a la actividad",
        });
      }

      //agregamos el usuario, e incrementamos el cupo
      const activityUpdate = await Activity.findOneAndUpdate(
        { _id: isActivityExist._id },
        { $push: { users: user }, $inc: { userRegister: 1 } },
        { new: true }
      );
      //   //le añadimos al usuario la actividad, con sus respectivos horarios
      user.activity.push(activityUpdate);

      if (user.activity.length == 1) {
        user.status = false;
      }

      const userUpdate = await user.save();

      return res.status(200).json({
        status: "success",
        message: "Usuario agregado a la actividad",
        data: {
          activityUpdate,
          userUpdate,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "error en el servidor",
      });
    }
  };
}
