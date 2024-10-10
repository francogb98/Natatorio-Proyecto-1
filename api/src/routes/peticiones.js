import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { peticionesController } from "../controllers/peticiones/peticiones.controller.js";

const routerPeticiones = Router();

// Traer peticiones (GET)
routerPeticiones.get(
  "/:estado",
  validarJWT,
  peticionesController.getPeticiones
);

// Crear petición (POST)
routerPeticiones.post(
  "/:userId/:actividadId",
  validarJWT,
  peticionesController.createPeticion
);

// Aceptar peticiones (PATCH)
routerPeticiones.patch(
  "/aceptar/:id",
  validarJWT,
  peticionesController.aceptarPeticiones
);

// Denegar peticiones (PATCH)
routerPeticiones.patch(
  "/denegar/:id",
  validarJWT,
  peticionesController.denegarPeticion
);

export { routerPeticiones };
