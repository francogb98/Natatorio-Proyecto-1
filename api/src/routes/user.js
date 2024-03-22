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
import Activity from "../models/models/Actividades.js";
import { enviarNotificacion } from "../controllers/users/archivos_para_npo_borrar/notificacion.controller.js";

const router = Router();

router.get("/infoUser/:token", getUser);
router.get("/getinfoUser/:id", getUserById);
router.get("/:filter", getUsers);

router.post("/findUser", validarJWT, findUser);
router.post("/getinfoUser", getUserById);

router.patch("/agregarUsuarioActividad", validarJWT, async (req, res) => {
  try {
    const { actividad, id } = req.body;

    const dateNow = new Date();
    const day = dateNow.getDate();
    const month = dateNow.getMonth() + 1;
    const year = dateNow.getFullYear();

    const dateNowSave = `${day}/${month}/${year}`;

    const user = await User.findOne({ customId: id });

    if (!user) {
      return res.status(400).json({
        status: "error",
        msg: `Usuario con el id ${id} no encontrado`,
      });
    }

    const activityUpdate = await Activity.findOneAndUpdate(
      { _id: actividad },
      { $push: { users: user }, $inc: { userRegister: 1 } },
      { new: true }
    );

    if (!activityUpdate) {
      console.log(actividad);
      return res
        .status(400)
        .json({ status: "error", msg: "actividad no encontrada" });
    }

    user.notificaciones.push({
      asunto: "Usuario registrado correctamente",
      cuerpo:
        "Usted ha sido registrado correctamente en la actividad, podrás ver los horarios en la sección de actividades, Recuerda que debes asistir a la actividad para que no seas deshabilitado, ademas de actualizar tu certificado de mucosis y pediculosis cada 1 mes, para mas información comunicate con el administrador del natatorio",
      fecha: dateNowSave,
    });

    user.activity = activityUpdate;
    user.status = true;
    user.inasistencias = [];
    user.asistencia = [];
    user.asistencia.push(dateNowSave);
    await user.save();

    return res.status(200).json({
      status: "success",
      msg: "Usuario agregado a la actividad con exito",
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error en el servidor" });
  }
});

router.patch("/enviarNotificacion", validarJWT, enviarNotificacion);

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

router.put("/colocar_asistencia", async (req, res) => {
  try {
    const { customId, fecha } = req.body;

    const user = await User.findOneAndUpdate(
      { customId: customId },
      {
        $addToSet: {
          asistencia: fecha,
        },
      },
      { new: true }
    );
    res.status(200).json({ status: "success", user });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

export default router;
