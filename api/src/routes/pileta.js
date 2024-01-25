import { Router } from "express";
import {
  getInfoPiletas,
  getPiletasOrCreate,
} from "../controllers/pileta/getPiletas.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { agregarUsuarioAPileta } from "../controllers/pileta/agregarUsuarioAPileta.js";
import { addUserNextTurn } from "../controllers/pileta/agregarUsuarioATurnoSiguiente.js";
import { autorizar } from "../controllers/pileta/autorizar.js";
import { cambioDeTurno } from "../controllers/pileta/cambioDeTurno.js";

const routerPileta = Router();

routerPileta.get("/getAll", getInfoPiletas);
routerPileta.get("/getPiletas", getPiletasOrCreate);

routerPileta.post("/add", validarJWT, agregarUsuarioAPileta);
routerPileta.post("/addNextTurn", validarJWT, addUserNextTurn);
routerPileta.post("/autorizar", validarJWT, autorizar);

routerPileta.post("/cambioDeTurno", validarJWT, cambioDeTurno);

export default routerPileta;
