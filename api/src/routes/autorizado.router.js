import { Router } from "express";
import {
  agregarNuevoAutorizado,
  eliminarUsuarioDeLaLista,
  listaUsuariosAutorizado,
} from "../controllers/autorizados/Autorizado.controller.js";

const rutaAutorizado = Router();

rutaAutorizado.get("/", listaUsuariosAutorizado);
rutaAutorizado.post("/", agregarNuevoAutorizado);
rutaAutorizado.delete("/", eliminarUsuarioDeLaLista);

export default rutaAutorizado;
