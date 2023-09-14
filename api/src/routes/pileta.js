import { Router } from "express";
import { getInfoPiletas } from "../controllers/pileta/getPiletas.js";

const routerPileta = Router();

routerPileta.get("/getAll", getInfoPiletas);

export default routerPileta;
