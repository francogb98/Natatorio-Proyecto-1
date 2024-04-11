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
import Activity from "../models/models/Actividades.js";

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

routerActivity.post("/borrarDuplicados", async (req, res) => {
  try {
    const activity = await Activity.findOne({ _id: req.body.id }).populate({
      path: "users",
      populate: {
        path: "customId",
      },
    });

    // Utilizamos new Set para obtener un conjunto (set) de elementos duplicados
    const uniqueUsers = activity.users.reduce((acc, user) => {
      if (
        !acc.some(
          (accUser) => accUser.customId.toString() == user.customId.toString()
        )
      ) {
        acc.push(user);
      }
      return acc;
    }, []);

    console.log(activity.users.length);
    console.log(uniqueUsers.length);

    activity.users = uniqueUsers;
    await activity.save();

    console.log(uniqueUsers.length);
    return res.status(200).json({ msg: "todo ok" });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
});

export default routerActivity;
