import { Router } from "express";
import { autorizar } from "../controllers/pileta/autorizar.js";
import {
  getInfoPiletasPrueba,
  agregarUsuarioAPiletaPrueba,
  cambiarTurno,
} from "../controllers/pileta/controller.pileta.js";

const routerPileta = Router();

// routerPileta.get("/getAll", getInfoPiletas);
// routerPileta.get("/getPiletas", getPiletasOrCreate);

// routerPileta.post("/add", validarJWT, agregarUsuarioAPileta);
// routerPileta.post("/addNextTurn", validarJWT, addUserNextTurn);
// routerPileta.post("/autorizar", validarJWT, autorizar);

// routerPileta.post("/cambioDeTurno", validarJWT, cambioDeTurno);

routerPileta.get("/", getInfoPiletasPrueba);
routerPileta.patch("/", agregarUsuarioAPiletaPrueba);
routerPileta.put("/", cambiarTurno);

routerPileta.patch("/autorizar", autorizar);

export default routerPileta;
