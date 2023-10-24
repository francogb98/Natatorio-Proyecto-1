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

const router = Router();

router.get("/infoUser/:token", getUser);
router.get("/getAllUser", getAllUserForHability);

router.get("/getAllUsers", getAllUsers);
router.get("/getAllUsers/:hour", getAllUsersForHour);

//busqueda por nombre por

router.get("/searchUserByName/:name", validarJWT, searchUserByname);

router.post("/infoUser", getUserById);
router.post("/cargaFicha", cargaFicha);

router.post("/create", createUser);
router.post("/confirm/:token", confirmAccount);
router.post("/login", loginUser);

//creo las dos rutas para habilitar y desabilitar ususarios
router.post("/deshabilitar", validarJWT, DeshabilitarUser);
router.post("/habilitar", validarJWT, HabilitarUser);

router.post("/suspenderUsuario", validarJWT, suspenderUsuario);
router.post("/cambiarRole", validarJWT, cambiarRole);

router.post("/resgisterActivity", validarJWT, addUserFromActivity);

export default router;
