import { Router } from "express";

import { validarJWT } from "../middlewares/validar-jwt.js";
import { ActividadController } from "../controllers/actividadesconclases/ActividadesController.js";

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

/**------------   En revision  --------- */
// routerActivity.get("/getUsersFromActivity", validarJWT, getUsersFromActivity);

// routerActivity.get("/getActividadesPorHora", getActivitiesByDate);
// routerActivity.post("/getActivityByName", validarJWT, getActividadesByNames);
// routerActivity.post("/getActivitiesByDate", validarJWT, getActivitiesByDate);

// routerActivity.get(
//   "/getActividadesPorHoraNextTurn",
//   getActivitiesByDateNextTurn
// );

export { routerActivity };
