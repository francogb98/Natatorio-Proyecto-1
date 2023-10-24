import { Router } from "express";
import Horarios from "../models/models/Horarios.js";

// import { createActivity } from "../controllers/activities/createActivity.js";

import { validarJWT } from "../middlewares/validar-jwt.js";

import { getHours } from "../controllers/hours/getHours.js";

const routerHours = Router();

// routerActivity.post("/activity/create", validarJWT, createActivity);

routerHours.get("/getAll", getHours);

//crear horario
routerHours.post("/create", (req, res) => {
  const { hourStart, hourFinish } = req.body;
  const newHour = new Horarios({ hourStart, hourFinish });
  newHour.save();
  res.send("horario creado");
});
export default routerHours;
