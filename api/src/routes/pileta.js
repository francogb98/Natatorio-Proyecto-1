import { Router } from "express";
import {
  getInfoPiletas,
  getPiletasOrCreate,
} from "../controllers/pileta/getPiletas.js";
import { reiniciarPiletaManual } from "../controllers/pileta/borradaPiletaManual.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { agregarUsuarioAPileta } from "../controllers/pileta/agregarUsuarioAPileta.js";
import { addUserNextTurn } from "../controllers/pileta/agregarUsuarioATurnoSiguiente.js";

const routerPileta = Router();

routerPileta.get("/getAll", getInfoPiletas);
routerPileta.get("/getPiletas", getPiletasOrCreate);

routerPileta.post("/add", validarJWT, agregarUsuarioAPileta);
routerPileta.post("/addNextTurn", validarJWT, addUserNextTurn);

routerPileta.post("/restart", validarJWT, reiniciarPiletaManual);

export default routerPileta;
