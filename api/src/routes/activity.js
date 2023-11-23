import { Router } from "express";

import { validarJWT } from "../middlewares/validar-jwt.js";
import {
  getActivities,
  getActivitiesByDate,
} from "../controllers/activitys/getAllActivity.js";
import { createActivity } from "../controllers/activitys/createActivity.js";

import { deleteActivity } from "../controllers/activitys/deleteActivity.js";
import { getNameActivitys } from "../controllers/activitys/getNameActivitys.js";
import { getActividadesByNames } from "../controllers/activitys/getActivitysByName.js";
import { getUsersFromActivity } from "../controllers/activitys/usuariosSegunDiaYHora.js";

const routerActivity = Router();

// routerActivity.post("/activity/create", validarJWT, createActivity);

routerActivity.get("/getAll", getActivities);
routerActivity.get("/getActividadesNombre", getNameActivitys);

routerActivity.get("/getActividadesPorHora", getActivitiesByDate);
routerActivity.post("/getActivityByName", validarJWT, getActividadesByNames);
routerActivity.post("/createActivity", validarJWT, createActivity);
routerActivity.post("/getActivitiesByDate", validarJWT, getActivitiesByDate);

//ruta para eliminar actividad
routerActivity.delete("/deleteActivity/:id", validarJWT, deleteActivity);

routerActivity.get("/getUsersFromActivity", validarJWT, getUsersFromActivity);

export default routerActivity;
