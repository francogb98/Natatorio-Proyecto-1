import { Router } from "express";

import { validarJWT } from "../middlewares/validar-jwt.js";
import {
  getActivities,
  getActivitiesByDate,
  getActivitiesByDateNextTurn,
  getActivitiesUsuarios,
} from "../controllers/activitys/getAllActivity.js";
import { createActivity } from "../controllers/activitys/createActivity.js";

import { deleteActivity } from "../controllers/activitys/deleteActivity.js";
import { getNameActivitys } from "../controllers/activitys/getNameActivitys.js";
import { getActividadesByNames } from "../controllers/activitys/getActivitysByName.js";
import { getUsersFromActivity } from "../controllers/activitys/usuariosSegunDiaYHora.js";
import editarActividad from "../controllers/activitys/editarActividad.js";
import getInfoActividades from "../controllers/activitys/getInfoActividades.js";

const routerActivity = Router();

// routerActivity.post("/activity/create", validarJWT, createActivity);

routerActivity.get("/getAll", getActivities);
routerActivity.get("/getAllUsuarios", getActivitiesUsuarios);
routerActivity.get("/getActividadesNombre", validarJWT, getNameActivitys);

routerActivity.get("/getActividad/:id", /*validarJWT,*/ getInfoActividades);

routerActivity.get("/getActividadesPorHora", getActivitiesByDate);

routerActivity.get(
  "/getActividadesPorHoraNextTurn",
  getActivitiesByDateNextTurn
);

routerActivity.post("/getActivityByName", validarJWT, getActividadesByNames);
routerActivity.post("/getActivitiesByDate", validarJWT, getActivitiesByDate);

routerActivity.post("/createActivity", validarJWT, createActivity);
//ruta para eliminar actividad
routerActivity.delete("/deleteActivity/:id", validarJWT, deleteActivity);

routerActivity.get("/getUsersFromActivity", validarJWT, getUsersFromActivity);

routerActivity.post("/editarActividad", validarJWT, editarActividad);

export default routerActivity;
