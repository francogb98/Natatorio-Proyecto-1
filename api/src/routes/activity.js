import { Router } from "express";

import { validarJWT } from "../middlewares/validar-jwt.js";
import { ActividadController } from "../controllers/actividadesconclases/ActividadesController.js";
import { Activity } from "../models/Actividades.js";

const routerActivity = Router();

routerActivity.get("/getAll", ActividadController.getActivities);
routerActivity.get(
  "/getAllUsuarios",
  ActividadController.getActividadesSinCodigoDeAcceso
);
routerActivity.get(
  "/getActividadesNombre",
  validarJWT,
  ActividadController.getActividadesParaUsuario
);

routerActivity.get(
  "/getActividad/:id",
  validarJWT,
  ActividadController.getInfoActividades
);

routerActivity.get(
  "/getActividadPorTurno",
  ActividadController.getActividadesPorTurno
);

routerActivity.post(
  "/createActivity",
  validarJWT,
  ActividadController.createActivity
);
//ruta para eliminar actividad
routerActivity.delete(
  "/deleteActivity/:id",
  validarJWT,
  ActividadController.deleteActivity
);
routerActivity.post(
  "/editarActividad",
  validarJWT,
  ActividadController.editActivity
);

routerActivity.post("/filterAll", async (req, res) => {
  try {
    // Obtener todas las actividades
    const activities = await Activity.find({}).populate("users");

    if (!activities || activities.length === 0) {
      return res.status(404).json({ message: "No se encontraron actividades" });
    }

    let totalActivitiesProcessed = 0;
    let totalDuplicatesRemoved = 0;
    const results = [];

    // Procesar cada actividad
    for (const activity of activities) {
      const uniqueUsers = [];
      const userIds = new Set();
      let duplicatesInActivity = 0;

      // Filtrar usuarios duplicados
      for (const user of activity.users) {
        if (!userIds.has(user._id.toString())) {
          userIds.add(user._id.toString());
          uniqueUsers.push(user._id);
        } else {
          duplicatesInActivity++;
        }
      }

      // Si hay duplicados, actualizar la actividad
      if (duplicatesInActivity > 0) {
        activity.users = uniqueUsers;
        activity.userRegister = uniqueUsers.length;
        await activity.save();

        totalDuplicatesRemoved += duplicatesInActivity;
      }

      results.push({
        activityId: activity._id,
        activityName: activity.name,
        duplicatesRemoved: duplicatesInActivity,
        totalUsersNow: uniqueUsers.length,
      });

      totalActivitiesProcessed++;
    }

    return res.json({
      success: true,
      message: `Procesadas ${totalActivitiesProcessed} actividades. Se eliminaron ${totalDuplicatesRemoved} usuarios duplicados en total.`,
      totalActivitiesProcessed,
      totalDuplicatesRemoved,
      details: results,
    });
  } catch (error) {
    console.error("Error en /filterAll:", error);
    return res.status(500).json({
      success: false,
      message: "Error al procesar la solicitud",
      error: error.message,
    });
  }
});

export { routerActivity };
