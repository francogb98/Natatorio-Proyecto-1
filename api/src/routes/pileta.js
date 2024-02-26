import { Router } from "express";
import { autorizar } from "../controllers/pileta/autorizar.js";
import {
  getInfoPiletasPrueba,
  agregarUsuarioAPileta,
  iniciarTurno,
  eliminarUsuarioDePileta,
} from "../controllers/pileta/controller.pileta.js";

const routerPileta = Router();

routerPileta.get("/", getInfoPiletasPrueba);
routerPileta.patch("/", agregarUsuarioAPileta);
routerPileta.put("/", iniciarTurno);
routerPileta.put("/eliminar", eliminarUsuarioDePileta);
routerPileta.patch("/autorizar", autorizar);

export default routerPileta;
