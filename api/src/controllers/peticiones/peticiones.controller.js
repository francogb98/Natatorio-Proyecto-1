import { Peticion, User, Activity } from "../../models/index.js";
import PeticionesService from "./peticiones.service.js";

export class peticionesController {
  static createPeticion = async (req, res) => {
    try {
      const { userId, actividadId } = req.params;
      const { motivo, asunto, activityBaja } = req.body;

      if (!actividadId) {
        return res.status(400).json({
          status: "error",
          msg: "Por favor completar todos los campos",
        });
      }
      if (!userId || !actividadId || !asunto) {
        return res.status(400).json({
          status: "error",
          msg: "Por favor completar todos los campos",
        });
      }

      if (asunto === "cambiar" && !activityBaja) {
        return res.status(400).json({
          status: "error",
          msg: "Por favor completar todos los campos",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(400)
          .json({ status: "error", msg: "Usuario no encontrado" });
      }

      const activity = await Activity.findById(actividadId);
      if (!activity) {
        return res
          .status(400)
          .json({ status: "error", msg: "Actividad no encontrada" });
      }

      const existingPeticion = await Peticion.findOne({
        user: userId,
        activity: actividadId,
      });
      if (existingPeticion) {
        return res.status(400).json({
          status: "error",
          msg: "El usuario ya tiene una petición para esta actividad.",
        });
      }

      const peticion = new Peticion({
        user: user._id,
        activity: activity._id,
        estado: "pendiente",
        motivo: motivo ?? "",
        asunto: asunto ?? "",
      });
      if (activityBaja) {
        peticion.activityBaja = activityBaja;
      }

      await peticion.save();

      return res
        .status(201)
        .json({ status: "success", msg: "Solicitud creada", peticion });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ status: "error", msg: "Error en el servidor" });
    }
  };

  static getPeticiones = async (req, res) => {
    try {
      const { estado } = req.params;
      const peticiones = await Peticion.find({ estado })
        .populate("activity")
        .populate("user");
      return res.status(200).json({ peticiones });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Error en el servidor" });
    }
  };

  static aceptarPeticiones = async (req, res) => {
    try {
      const { id } = req.params;
      const peticion = await Peticion.findById(id);

      //peticion para inscribir en actividad
      if (peticion.asunto === "inscribir") {
        const user = await User.findById(peticion.user);
        if (!user) {
          return res.status(400).json({ msg: "Usuario no encontrado" });
        }

        const result = await PeticionesService.agregarUsuarioActividad({
          user,
          idActividad: peticion.activity,
        });

        if (result) {
          peticion.estado = "acepatada";
          await peticion.save();
          return res.status(200).json({
            status: "success",
            msg: "Usuario agregado a la actividad con exito",
          });
        } else {
          return res.status(500).json({ msg: "Ups algo salio mal" });
        }
      }

      //peticion para dar de baja en actividad
      if (peticion.asunto === "baja") {
        const user = await User.findById(peticion.user);
        if (!user) {
          return res.status(400).json({ msg: "Usuario no encontrado" });
        }

        const result = await PeticionesService.darDeBaja({
          user,
          activityId: peticion.activity,
        });
        if (result) {
          peticion.estado = "acepatada";
          await peticion.save();
          return res.status(200).json({
            status: "success",
            msg: "Usuario dado de baja de la actividad con éxito",
          });
        } else {
          return res.status(500).json({ msg: "Ups algo salio mal" });
        }
      }

      //peticion para cambiar de actividad
      if (peticion.asunto === "cambiar") {
        const user = await User.findById(peticion.user);
        if (!user) {
          return res.status(400).json({ msg: "Usuario no encontrado" });
        }

        //le pasamos la actividad que vamos a dar de baja
        await PeticionesService.darDeBaja({
          user,
          activityId: peticion.activityBaja,
        });

        // Inscribir al usuario en la nueva actividad
        const result = await PeticionesService.agregarUsuarioActividad({
          user,
          idActividad: peticion.activity,
        });

        if (result) {
          peticion.estado = "acepatada"; // Cambiar el estado de la petición
          await peticion.save();
          return res.status(200).json({
            status: "success",
            msg: "Usuario cambiado a la nueva actividad con éxito",
          });
        } else {
          return res.status(500).json({
            msg: "Ups, algo salió mal al inscribir al usuario en la nueva actividad",
          });
        }
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Error en el servidor" });
    }
  };

  static denegarPeticion = async (req, res) => {
    try {
      const { id } = req.params;
      const { motivo } = req.body;

      const peticion = await Peticion.findOneAndUpdate(
        { _id: id }, // Filtro para encontrar la petición
        {
          estado: "denegada", // Actualiza el estado
          motivo: motivo, // Actualiza el motivo
        },
        { new: true } // Devuelve el documento actualizado
      );

      if (!peticion) {
        return res.status(404).json({ msg: "Petición no encontrada" });
      }

      return res
        .status(200)
        .json({ msg: "Peticion denegada con exito", peticion });
    } catch (error) {
      console.log(error.message);
      return res.staus(500).json({ msg: "Error en el servidor" });
    }
  };
}
