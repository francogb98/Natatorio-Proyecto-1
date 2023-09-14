import { Router } from "express";

// import { createActivity } from "../controllers/activities/createActivity.js";

import { validarJWT } from "../middlewares/validar-jwt.js";

import { getHours } from "../controllers/hours/getHours.js";

const routerHours = Router();

// routerActivity.post("/activity/create", validarJWT, createActivity);

routerHours.get("/getAll", getHours);

export default routerHours;
