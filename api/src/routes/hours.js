import { Router } from "express";

import { HoursController } from "../controllers/hours/HoursController.js";

const routerHours = Router();

routerHours.get("/getAll", HoursController.getHours);
routerHours.post("/create", HoursController.createHour);

export { routerHours };
