import { Router } from "express";
import { autorizar } from "../controllers/pileta/autorizar.js";
import {
  getInfoPiletasPrueba,
  agregarUsuarioAPileta,
  iniciarTurno,
  eliminarUsuarioDePileta,
  obtener_pileta,
} from "../controllers/pileta/controller.pileta.js";

const routerPileta = Router();

routerPileta.get("/", getInfoPiletasPrueba);
routerPileta.patch("/", agregarUsuarioAPileta);
routerPileta.put("/", iniciarTurno);
routerPileta.put("/eliminar", eliminarUsuarioDePileta);
routerPileta.patch("/autorizar", autorizar);

routerPileta.post("/obtenerPileta", obtener_pileta);

export default routerPileta;
