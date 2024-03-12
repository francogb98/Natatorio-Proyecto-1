import { Router } from "express";
import createUser from "../controllers/users/createUser.js";
import { loginUser } from "../controllers/users/loginUser.js";

import {
  DeshabilitarUser,
  HabilitarUser,
  addUserFromActivity,
} from "../controllers/users/addUserFromActivity.js";

import { validarJWT } from "../middlewares/validar-jwt.js";
import { suspenderUsuario } from "../controllers/users/suspenderUsuario.js";
import { cambiarRole } from "../controllers/users/cambiarRole.js";

import editarUsuario from "../controllers/users/editarUsuario.js";
import { darDeBajaActividad } from "../controllers/users/darDeBajaActividad.js";

import createNotificacion from "../controllers/users/notificaciones/createNotificacion.js";
import updateNotificaciones from "../controllers/users/notificaciones/updateNotificaciones.js";
import { deleteNotificacion } from "../controllers/users/notificaciones/deleteNotificacion.js";
import cambiarFoto from "../controllers/users/imagen/cambiarFoto.js";
import recuperar from "../controllers/users/recuperarContraseña/recuperar.js";
import modificarContraseña from "../controllers/users/recuperarContraseña/modificarContraseña.js";
import { subirArchivos } from "../controllers/subirArchivos.js";

import { getUser, getUserById } from "../controllers/users/getUser.js";
import { getUsers } from "../controllers/users/archivos_para_npo_borrar/getUsers.js";
import { findUser } from "../controllers/users/archivos_para_npo_borrar/findUser.js";
import User from "../models/models/User.js";

const router = Router();

router.get("/infoUser/:token", getUser);
router.get("/getinfoUser/:id", getUserById);
router.get("/:filter/:page", getUsers);

router.post("/findUser", validarJWT, findUser);
router.post("/getinfoUser", getUserById);

//busqueda por nombre por

router.post("/create", createUser);
router.post("/login", loginUser);

//creo las dos rutas para habilitar y desabilitar ususarios
router.post("/deshabilitar", validarJWT, DeshabilitarUser);
router.post("/habilitar/:id", validarJWT, HabilitarUser);

router.post("/suspenderUsuario", validarJWT, suspenderUsuario);
router.post("/cambiarRole", validarJWT, cambiarRole);

router.post("/resgisterActivity", validarJWT, addUserFromActivity);

router.post("/editarUsuario", editarUsuario);

router.post("/darDeBajaActividad", validarJWT, darDeBajaActividad);

//notificaciones

router.post("/notificaciones/create", createNotificacion);
router.post("/notificaciones/update", validarJWT, updateNotificaciones);
router.post("/notificaciones/delete", validarJWT, deleteNotificacion);

router.post("/cambiarFoto", validarJWT, cambiarFoto);
router.post("/comprobar-datos", recuperar);
router.post("/modificar-password", modificarContraseña);

//subir imagenes
router.put("/upload", validarJWT, subirArchivos);

export default router;
