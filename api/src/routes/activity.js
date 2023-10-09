import { Router } from "express";

import { validarJWT } from "../middlewares/validar-jwt.js";
import {
  getActivities,
  getActivitiesByDate,
} from "../controllers/activitys/getAllActivity.js";
import { createActivity } from "../controllers/activitys/createActivity.js";

import { deleteActivity } from "../controllers/activitys/deleteActivity.js";

const routerActivity = Router();

// routerActivity.post("/activity/create", validarJWT, createActivity);

routerActivity.get("/getAll", getActivities);
routerActivity.post("/createActivity", validarJWT, createActivity);
routerActivity.post("/getActivitiesByDate", validarJWT, getActivitiesByDate);

//ruta para eliminar actividad
routerActivity.delete("/deleteActivity/:id", validarJWT, deleteActivity);

export default routerActivity;
