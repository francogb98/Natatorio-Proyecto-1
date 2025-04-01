import { Router } from "express";

import { validarJWT } from "../middlewares/validar-jwt.js";
import { getUser } from "../middlewares/findUser.js";

import { userController } from "../controllers/User/userController.js";
import { AdminController } from "../controllers/User/AdminController.js";
import { ClienteController } from "../controllers/User/clienteController.js";
import { getUsers } from "../controllers/User/UsuariosFalta.js";
import { User } from "../models/User.js";

const UserRouter = Router();

UserRouter.param("userId", getUser);

//*-------------- Administradores ----------*/

UserRouter.get("/:filter", getUsers);
UserRouter.get("/infoUser/:token", userController.getUser);
UserRouter.post("/generar-qr", userController.generarQrCode);
UserRouter.post("/asistencia-qr", userController.asistenciaPorQr);

UserRouter.post("/getinfoUser/:type/:id", userController.getUserById);
UserRouter.post(
  "/findUserByLastName/:apellido",
  validarJWT,
  userController.getUserByLastName
);

UserRouter.post("/revisarArchivo", userController.revisarArchivo);

//*-------------- Super Admin -----------------*/

UserRouter.patch(
  "/agregarUsuarioActividad/:userId",
  validarJWT,
  AdminController.agregarUsuarioAUnaActividad
);
UserRouter.patch(
  "/enviarNotificacion/:userId",
  validarJWT,
  AdminController.enviarNotificacion
);
UserRouter.post("/deshabilitar/:userId", AdminController.DeshabilitarUser);
UserRouter.post(
  "/habilitar/:userId",
  validarJWT,
  AdminController.HabilitarUser
);

UserRouter.post(
  "/cambiarRole/:role/:userId",
  validarJWT,
  AdminController.cambiarRole
);
UserRouter.post(
  "/notificaciones/delete/:userId",
  validarJWT,
  AdminController.deleteNotificacion
);

/** -------- Usuarios convencionales --------*/
UserRouter.post("/create", ClienteController.createUser);
UserRouter.post("/login", ClienteController.loginUser);
UserRouter.post("/comprobar-datos", ClienteController.recuperar);
UserRouter.post("/modificar-password", ClienteController.modificarContraseña);
UserRouter.patch("/editarUsuario", ClienteController.editarUsuario);
/**----Archivos */
UserRouter.put("/upload", validarJWT, ClienteController.subirArchivos);

UserRouter.post(
  "/revisionArchivo",
  validarJWT,
  ClienteController.revisionArchivo
);

/**----Actividades */
UserRouter.post(
  "/resgisterActivity/:userId",
  validarJWT,
  userController.solicitudDeInscripcion
);
UserRouter.post(
  "/darDeBajaActividad",
  validarJWT,
  ClienteController.darDeBajaActividad
);
UserRouter.post(
  "/darDeBajaCertificado",
  validarJWT,
  ClienteController.darDeBajaPorCertificado
);
UserRouter.post(
  "/darDeBajaRevision",
  validarJWT,
  ClienteController.darDeBajaPorRevision
);
UserRouter.post(
  "/notificaciones/update/:userId",
  validarJWT,
  ClienteController.notificacionLeida
);

export { UserRouter };
