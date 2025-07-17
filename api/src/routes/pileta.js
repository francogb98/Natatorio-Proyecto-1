import { Router } from "express";
import { PiletaController } from "../controllers/pileta/controller.pileta.js";
import { verificacionEstadoUsuarios } from "../controllers/pileta/utilidades/estadoUsuario.js";

const routerPileta = Router();

routerPileta.get("/", PiletaController.getInfoPiletas);
routerPileta.patch("/", PiletaController.agregarUsuarioAPileta);
routerPileta.put(
  "/",
  PiletaController.verificarCambioDeTurno,
  verificacionEstadoUsuarios,
  PiletaController.iniciarTurno
);
routerPileta.put("/eliminar", PiletaController.eliminarUsuarioDePileta);
routerPileta.post("/obtenerPileta", PiletaController.obtener_pileta);
routerPileta.post("/prueba", verificacionEstadoUsuarios);

routerPileta.post("/sinConexion", PiletaController.sin_conexion);

routerPileta.get(
  "/verificarUsuarios",
  PiletaController.verificar_estado_usuario
);

export { routerPileta };
