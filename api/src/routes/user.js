import { Router } from "express";
import createUser from "../controllers/users/createUser.js";
import { loginUser } from "../controllers/users/loginUser.js";
import { confirmAccount } from "../controllers/users/confirmAccount.js";
import {
  DeshabilitarUser,
  HabilitarUser,
  addUserFromActivity,
} from "../controllers/users/addUserFromActivity.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import {
  getUser,
  getUserById,
  getAllUserForHability,
} from "../controllers/users/getUser.js";
import { cargaFicha } from "../controllers/users/cargaFichaMedica.js";
import getAllUsers from "../controllers/users/getAllUsers.js";
import { suspenderUsuario } from "../controllers/users/suspenderUsuario.js";
import { cambiarRole } from "../controllers/users/cambiarRole.js";

import { searchUserByname } from "../controllers/users/searchUserByName.js";
import { getAllUsersForHour } from "../controllers/users/getAllUserForHour.js";
import editarUsuario from "../controllers/users/editarUsuario.js";
import { darDeBajaActividad } from "../controllers/users/darDeBajaActividad.js";

import createNotificacion from "../controllers/users/notificaciones/createNotificacion.js";
import updateNotificaciones from "../controllers/users/notificaciones/updateNotificaciones.js";
import { deleteNotificacion } from "../controllers/users/notificaciones/deleteNotificacion.js";
import cambiarFoto from "../controllers/users/imagen/cambiarFoto.js";
import recuperar from "../controllers/users/recuperarContraseña/recuperar.js";
import modificarContraseña from "../controllers/users/recuperarContraseña/modificarContraseña.js";

const router = Router();

router.get("/infoUser/:token", getUser);
router.get("/getAllUsers/paraHabilitar", getAllUserForHability);

router.get("/getAllUsers", getAllUsers);
router.get("/getAllUsers/:hour", getAllUsersForHour);

//busqueda por nombre por

router.get("/searchUserByName/:name", validarJWT, searchUserByname);
router.get("/getinfoUser/:id", validarJWT, getUserById);

router.post("/cargaFicha", cargaFicha);

router.post("/create", createUser);
router.post("/confirm/:token", confirmAccount);
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

export default router;
